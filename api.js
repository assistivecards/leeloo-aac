import Storage from 'react-native-storage';

import { AsyncStorage, Platform, Alert } from 'react-native';

import * as Speech from 'expo-speech';
import * as Localization from 'expo-localization';
import * as Haptics from 'expo-haptics';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import * as InAppPurchases from 'expo-in-app-purchases';
import * as Notifications from 'expo-notifications';

import { Analytics, ScreenHit, Event as Avent } from 'expo-analytics-safe';
import { CacheManager } from "react-native-expo-image-cache";
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';

import makeid from './js/makeid';
import Event from './js/event';
import styles from './js/styles';
import themes from './js/themes';

const fallbackUIText = require("./data/interface/en.json");

// For test cases
const _DEVELOPMENT = false;

const _NETWORK_STATUS = true;
const _FLUSH = false;
const _DEVUSERIDENTIFIER = "109677539152659927717";
const _DEVLOCALE = "en-US";
const _ISPREMIUM = false;

const API_ENDPOINT = "https://leeloo.dreamoriented.org/";
const ASSET_ENDPOINT = "https://api.assistivecards.com/";
const ANALYTICS_KEY = 'UA-110111146-1';
const ASSET_VERSION = 212;
const RTL = ["ar","ur","he"];

let storage;

storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
	sync: {}
});


class Api {
  constructor(){
		if(_DEVELOPMENT && _FLUSH){
			AsyncStorage.clear();
			CacheManager.clearCache();
		}
		this.cards = {};
		this.uitext = {en: fallbackUIText};
		this.searchArray = [];
		this.development = _DEVELOPMENT;
		this.styles = styles;
		if(_DEVELOPMENT){
			this.analytics = new Analytics("DEVELOPMENT", {slug: "leeloo", name: "Leeloo", version: "2.0.3"});
		}else{
			this.analytics = new Analytics(ANALYTICS_KEY, {slug: "leeloo", name: "Leeloo", version: "2.0.3"});
		}
		this.isTablet = false;
		this._checkIfTablet();

		this.config = {
			theme: themes.light
		}
		this.version = ASSET_VERSION;
		this.assetEndpoint = ASSET_ENDPOINT;

		this.event = Event;
		if(_DEVELOPMENT){
			this.isOnline = _NETWORK_STATUS;
		}else{
			this.isOnline = true;
		}

		this.locked = true;
		this.activeProfileId = null;
		this.premium = "determining";
		this.premiumPlans = [];

    console.log("API: Created instance");
		if(!_DEVELOPMENT){
			this._listenNetwork();
		}

		this._initSubscriptions();
  }

	hit(screen){
		this.analytics.hit(new ScreenHit(screen))
		  .then(() => {
				// hit done
			})
		  .catch(e => console.log(e.message));
	}

	avent(a,b,c){
		this.analytics.event(new Avent(a, b, c))
	}

	_listenNetwork(){
		NetInfo.addEventListener(state => {
		  console.log('Connection type', state.type);
		  console.log('Is connected?', state.isConnected);
			this.isOnline = state.isConnected;
		});
	}

	async _checkIfTablet(){
		let deviceType = await Device.getDeviceTypeAsync()

		this.isTablet = deviceType == Device.DeviceType.TABLET;
	}

	isPremium(){
		if(_DEVELOPMENT){
			return _ISPREMIUM;
		}
		if(this.premium == "lifetime" || this.premium == "yearly" || this.premium == "monthly"){
			return true;
		}else{
			if(this.isGift){
				return true;
			}else{
				return false;
			}
		}
	}

	haptics(style){
		if(this.user.haptic !== "0"){
			switch (style) {
				case "touch":
					Haptics.selectionAsync()
					break;
				case "impact":
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
					break;
				default:
					Haptics.selectionAsync()
			}
		}
	}

	async registerForPushNotificationsAsync(){
    if(Constants.isDevice) {
	    await Notifications.requestPermissionsAsync({
	      ios: {
	        allowAlert: true,
	        allowBadge: true,
	        allowSound: true,
	        allowAnnouncements: true,
	      },
	    });

	    let experienceId = undefined;
	    if (!Constants.manifest) {
	      // Absence of the manifest means we're in bare workflow
	      experienceId = '@burak/leeloo';
	    }

	    const expoPushToken = await Notifications.getExpoPushTokenAsync({
	      experienceId,
	    });

			console.log("token", expoPushToken.data);

			if(token != this.user.notificationToken){
				await this.update(["notificationToken"], [expoPushToken.data]);
			}
			return token;

    }else{
      console.log('Must use physical device for Push Notifications');
			return "";
    }
  }

	async signIn(identifier, type, user){
    var url = API_ENDPOINT + "user/";
    var formData = new FormData();
		formData.append('identifier', identifier);

		let localIdentifier = await this.getData("identifier");
		let localUserString = await this.getData("user");
		let registerAgain = false;
		let localUser;
		if(localUserString){
			localUser = JSON.parse(localUserString);
			if(localUser.identifier){
				if(!localUser.language){
					registerAgain = true;
				}
			}
		}

		if(localIdentifier != identifier || registerAgain){

			let deviceLanguage = Localization.locale.substr(0,2);
			let bestTTS = await this.getBestAvailableVoiceDriver(deviceLanguage);
			formData.append('type', type);
			formData.append('language', Localization.locale.substr(0,2));
			formData.append('voice', bestTTS.identifier);
			formData.append('os', Platform.OS);
			formData.append('modelName', Device.modelName);
			formData.append('timeline', Localization.timezone);

			if(type == "apple"){
				formData.append('email', user.email);
				formData.append('name', user.fullName.givenName + " " +user.fullName.familyName);

			}else if(type == "google"){
				formData.append('email', user.email);
				formData.append('name', user.displayName);
				formData.append('avatar', user.photoURL);
			}else if(type == "email"){
				formData.append('email', user.email);
			}
		}

		let userResponse;

		try {
			userResponse = await fetch(url, { method: 'POST', body: formData })
	    .then(res => res.json());

			userResponse.profiles.forEach((profile, i) => {
				userResponse.profiles[i].packs = JSON.parse(profile.packs);
			});

			await this.setData("user", JSON.stringify(userResponse));
		} catch(error){
			console.log("Offline, Falling back to cached userdata!", error);
			let userResponseString = await this.getData("user");
			if(userResponseString){
				userResponse = JSON.parse(userResponseString);
			}
		}

		this.user = userResponse;
		if(registerAgain){
			await this.ramLanguage(Localization.locale.substr(0, 2));
		}else{
			if(this.user.language){
				await this.ramLanguage(this.user.language);
			}
		}
		this.user.isRTL = ["ar","ur","he"].includes(this.user.language);
		if(this.user.premium == "gift"){
			this.isGift = true;
		}
		this.user.active_profile = await this.getCurrentProfile();
		return userResponse;
	}

  signout(){
    Alert.alert(
      this.t("alert_signout_title"),
      this.t("alert_signout_description"),
      [
        {
          text: this.t("alert_cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: this.t("alert_ok"), onPress: () => {
					AsyncStorage.clear();
					this.event.emit("refresh", "signout");
				} }
      ],
      { cancelable: true }
    );
  }

	async update(fields, values){
		if(this.user.identifier){
	    var url = API_ENDPOINT + "update/";
	    var formData = new FormData();
			formData.append('identifier', this.user.identifier);

			for (var i = 0; i < fields.length; i++) {
				formData.append(fields[i], values[i]);
			}

			console.log(formData);

			try {
				let userResponse = await fetch(url, { method: 'POST', body: formData })
		    .then(res => res.json());
				await this.setData("user", JSON.stringify(userResponse));

				console.log(userResponse);

				userResponse.profiles.forEach((profile, i) => {
					userResponse.profiles[i].packs = JSON.parse(profile.packs);
				});
				this.user = userResponse;
				await this.ramLanguage(this.user.language);
				if(this.user.premium == "gift"){
					this.isGift = true;
				}
				this.user.isRTL = RTL.includes(this.user.language);
				this.user.active_profile = await this.getCurrentProfile();
			} catch(error){
				alert("Please check your internet connectivity!");
			}

			this.event.emit("refresh");

			return true;
		}
	}

	async newProfile(profile){
		if(this.user.identifier && profile.name){
	    var url = API_ENDPOINT + "profile/";
	    var formData = new FormData();
			formData.append('identifier', this.user.identifier);
			formData.append('name', profile.name);
			formData.append('avatar', profile.avatar);
			formData.append('packs', `["conversation","people","feelings","food","animals","school","activities","shapes","colors","clothes"]`);

			try {
				let newProfileResponse = await fetch(url, { method: 'POST', body: formData })
		    .then(res => res.json());

				newProfileResponse.packs = JSON.parse(newProfileResponse.packs);

				this.user.profiles.push(newProfileResponse);

				await this.setData("user", JSON.stringify(this.user));

				this.user.active_profile = await this.getCurrentProfile();
			} catch(error){
				console.log("Please check your internet connectivity!", error);
				alert("Please check your internet connectivity!");
			}

			this.event.emit("refresh");

			return true;
		}
	}

	async updateProfile(profileId, fields, values){
		if(this.user.identifier && profileId){
	    var url = API_ENDPOINT + "profile/update/";
	    var formData = new FormData();
			formData.append('id', profileId);
			formData.append('identifier', this.user.identifier);

			for (var i = 0; i < fields.length; i++) {
				formData.append(fields[i], values[i]);
			}

			try {
				let profileResponse = await fetch(url, { method: 'POST', body: formData })
		    .then(res => res.json());

				profileResponse.packs = JSON.parse(profileResponse.packs);

				for (var i in this.user.profiles) {
					if (this.user.profiles[i].id == profileId) {
						this.user.profiles[i] = profileResponse;
						break;
					}
				}

				await this.setData("user", JSON.stringify(this.user));

				this.user.active_profile = await this.getCurrentProfile();
			} catch(error){
				console.log(error);
				alert("Please check your internet connectivity!");
			}

			this.event.emit("refresh");

			return true;
		}
	}

	async removeProfile(profileId){
		if(this.user.identifier && profileId){
	    var url = API_ENDPOINT + "profile/remove/";
	    var formData = new FormData();
			formData.append('id', profileId);
			formData.append('identifier', this.user.identifier);

			try {
				let profileResponse = await fetch(url, { method: 'POST', body: formData })
		    .then(res => res.json());
				console.log(profileResponse);
				if(profileResponse == "deleted"){

					this.user.profiles = this.user.profiles.filter(profile => profile.id != profileId);
					await this.setData("user", JSON.stringify(this.user));

				}else{
					alert("A problem occured while trying to remove profile.");
				}
				this.user.active_profile = await this.getCurrentProfile();
			} catch(error){
				alert("Please check your internet connectivity!");
			}

			this.event.emit("refresh");

			return true;
		}
	}

	async getCurrentProfile(){
		if(this.user){
			let profiles = this.user.profiles;
			if(this.activeProfileId){
				return profiles.find(profile => profile.id == this.activeProfileId);
			}else{
				if(profiles.length == 1){
					let profile = profiles[0];
					this.activeProfileId = profile.id;
					return profile;
				}else if(profiles.length == 0){
					return "noprofile";
				}else{
					return "multiple";
				}
			}
		}else{
			return "nouser";
		}
	}

	async setCurrentProfile(profileId){
		if(this.user){
			let profiles = this.user.profiles;
			this.activeProfileId = profileId;
			this.user.active_profile = profiles.find(profile => profile.id == profileId);
			this.event.emit("refresh");
		}
	}


	async getAuthIdentifier(email, pass){
		if(email && pass){
	    var url = API_ENDPOINT + "auth/";
	    var formData = new FormData();
			formData.append('email', email);
			formData.append('pass', pass);

			let identifier = null;

			try {
				let authIdentifierResponse = await fetch(url, { method: 'POST', body: formData })
		    .then(res => res.json());

				identifier = authIdentifierResponse.identifier;
			} catch(error){
				console.log("Please check your internet connectivity!", error);
				alert("Please check your internet connectivity!");
			}

			return identifier;
		}
	}


	speak(text, speed){
		//text = this.phrase()
		let rate = 1;
		if(speed == "slow"){
			rate = 0.5;
		}
		if(this.user.voice != "unsupported"){
			Speech.speak(text, {
				voice: this.user.voice,
				language: this.user.language,
				pitch: 1,
				rate: rate
			});
		}
	}

	async getAvailableVoicesAsync(recall){
		let voices = await Speech.getAvailableVoicesAsync();
		if(voices.length == 0){
			if(recall){
				return [];
			}else{
				await new Promise(function(resolve) {
		        setTimeout(resolve, 1000);
		    });
				return await this.getAvailableVoicesAsync(true);
			}
		}else{
			return voices;
		}
	}

	async getBestAvailableVoiceDriver(language){
		let allVoices = await this.getAvailableVoicesAsync();
		let voices = allVoices.filter(voice => voice.language.includes(language));

		if(voices.length == 0){
			return "unsupported";
		}else if(voices.length == 1){
			return voices[0];
		}else if(voices.length > 1){
			let localeString = this.localeString().toLowerCase().replace(/_/g, "-");
			let localeVoices = voices.filter(voice => localeString.includes(voice.language.toLowerCase().replace(/_/g, "-")));

			if(localeVoices.length == 0){
				// check if there is an enhanced one
				return voices.sort((a, b) => {
	          let aQ = !(a.quality == "Enhanced");
	          let bQ = !(b.quality == "Enhanced");
	          if (aQ < bQ) return -1
	          if (aQ > bQ) return 1
	          return 0
	      })[0];
			}else if(localeVoices.length == 1){
				return localeVoices[0];
			}else if(localeVoices.length > 1){
				// check if there is an enhanced one
				return localeVoices.sort((a, b) => {
	          let aQ = !(a.quality == "Enhanced");
	          let bQ = !(b.quality == "Enhanced");
	          if (aQ < bQ) return -1
	          if (aQ > bQ) return 1
	          return 0
	      })[0];
			}
		}
	}

	async getPacks(force){
		var url = ASSET_ENDPOINT + "packs/" + this.user.language + "/metadata.json?v="+this.version;

		if(this.packs && force == null){
			console.log("pulling from ram");
			return this.packs;
		}else{
			let packsResponse;
			try {
				packsResponse = await fetch(url, {cache: "no-cache"})
		    .then(res => res.json());
				this.setData("packs", JSON.stringify(packsResponse));

			} catch(error){
				console.log("Offline, Falling back to cached packdata!", error);
				let packsResponseString = await this.getData("packs");
				if(packsResponseString){
					packsResponse = JSON.parse(packsResponseString);
				}
			}
			this.packs = packsResponse;
			return packsResponse;
		}
	}

	search(term){
		if(term.length >= 2){
			let results = [];
			for (var i = 0; i < this.searchArray.length; i++) {
				if(this.searchArray[i].search.includes(" "+term.toLocaleLowerCase())){
					results.push(this.searchArray[i]);
					if(results.length == 10){
						break;
					}
				}
			}
			return results;
		}else{
			return [];
		}
	}

	phrase(string){
		if(string.includes("{name}")){
			return string.replace("{name}", this.user.active_profile.name)
		}else{
			return string;
		}
	}

	async ramCards(slugArray, force){
		for (var i = 0; i < slugArray.length; i++) {
			await this.getCards(slugArray[i], force);
		}

		if(!this.isPremium()){
			let allPacks = await this.getPacks();
			slugArray = slugArray.map(slug => {
				if(!allPacks.filter(allpack => allpack.slug == slug)[0].premium){
					return slug;
				}
			}).filter(slug => slug != null);
		}


		this.searchArray = []; // empty the old search array.

		slugArray.forEach((packSlug, i) => {
			this.cards[packSlug].forEach((card, i) => {
				let color = this.packs.filter(pack => pack.slug == packSlug)[0].color;
				this.searchArray.push({pack: packSlug, color, search: " "+card.title.toLocaleLowerCase()+" ", slug: card.slug, emoji: null, title: card.title, type: 1});

				card.phrases.forEach((phrase, i) => {
					this.searchArray.push({pack: packSlug, search: " "+this.phrase(phrase.phrase).toLocaleLowerCase()+" ", slug: card.slug, emoji: phrase.type, title: this.phrase(phrase.phrase), type: 2});
				});
			});
		});

	}

	async _initSubscriptions(){
    try{
			if(_DEVELOPMENT){
				if(!_ISPREMIUM){
					this.premium = "none";
					this.event.emit("premium");
				}
			}

	    if(!Constants.isDevice) {
				this.premium = "none";
				this.event.emit("premium");
			}
      const history = await InAppPurchases.connectAsync();
			if (history.responseCode === InAppPurchases.IAPResponseCode.OK) {
			  // get to know if user is premium or npt.
				let lifetime = history.results.filter(res => res.productId == "lifetime")[0];
				if(lifetime){
					this.premium = "lifetime";
				}else{
					let orderedHistory = history.results.sort((a, b) => (a.purchaseTime > b.purchaseTime) ? 1 : -1);
					if(orderedHistory[0]){
						this.premium = orderedHistory[0].productId;
					}else{
						this.premium = "none";
					}
				}

				this.event.emit("premium");
				await this.setData("premium", this.premium);

				this.getPlans(); // async fetch the plans for later use.

	      InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
	        // Purchase was successful
	        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
	          results.forEach(purchase => {
	            if (!purchase.acknowledged) {
	              alert(`Successfully purchased ${purchase.productId}`);
	              // Process transaction here and unlock content...
								this.premium = purchase.productId;
								this.event.emit("premium");
								this.event.emit("premiumPurchase", this.premium);
								this.setData("premium", this.premium);
								this.event.emit("refresh");

	              // Then when you're done
	              InAppPurchases.finishTransactionAsync(purchase, true);
	            }
	          });
	        }

	        // Else find out what went wrong
	        if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
	          console.log('User canceled the transaction');
	        } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
	          console.log('User does not have permissions to buy but requested parental approval (iOS only)');
	        } else {
	          console.warn(`Something went wrong with the purchase. Received errorCode ${responseCode}`);
	        }
	      });
			}else{
				console.log("#### Appstore status is not ok.");
				this.premium = await this.getData("premium");
				if(!this.premium) {
					this.premium = "none";
					this.setData("premium", "none");
				}
				this.event.emit("premium");
			}

    } catch(err){
      console.log("###### maybe no internet, or the app reloaded in dev mode", err);
			this.premium = await this.getData("premium");
			if(!this.premium) {
				this.premium = "none";
				this.setData("premium", "none");
			}
			this.event.emit("premium");
    }
	}

	async getPlans(){
		if(this.premiumPlans.length != 0){
			return this.premiumPlans;
		}else{
			try {
	      const { responseCode, results } = await InAppPurchases.getProductsAsync(["monthly", "yearly", "lifetime"]);
				console.log(results);
				if (responseCode === InAppPurchases.IAPResponseCode.OK) {
					this.premiumPlans = results;
				}
			}catch (err) {
				console.log("Issues with fetching products: ", err);
			}
			return this.premiumPlans;
		}
	}

	async purchasePremium(productId, oldProductId){
		if(oldProductId && oldProductId != "none"){
			await InAppPurchases.purchaseItemAsync(productId, oldProductId);
		}else{
			await InAppPurchases.purchaseItemAsync(productId);
		}
		this.avent("Premium", "PurchaseClick", productId);

	}

	async getCards(slug, force){
		var url = ASSET_ENDPOINT + "packs/" + this.user.language + "/"+ slug +".json?v="+this.version;

		if(this.cards[slug] && force == null){
			console.log("pulling from ram", "cardsFor", slug);
			return this.cards[slug];
		}else{
			let cardsResponse;
			try {
				cardsResponse = await fetch(url, {cache: "no-cache"})
				.then(res => res.json());
				this.setData("cards:"+slug, JSON.stringify(cardsResponse));

			} catch(error){
				console.log("Offline, Falling back to cached cardData!", error, slug);
				let cardsResponseString = await this.getData("cards:"+slug);
				if(cardsResponseString){
					cardsResponse = JSON.parse(cardsResponseString);
				}
			}
			this.cards[slug] = cardsResponse;
			return cardsResponse;
		}
	}

	getCardData(slug, pack){
		console.log(slug, pack);
		return this.cards[pack].filter(ramCard => ramCard.slug == slug)[0];
	}

	localeString(){
		if(_DEVELOPMENT){
			return _DEVLOCALE;
		}else{
			return Localization.locales.join("|");
		}
	}

	async getIdentifier(){
		if(_DEVELOPMENT && Platform.OS === 'android'){
			return _DEVUSERIDENTIFIER;
		}
		return await this.getData("identifier");
	}

	async ramLanguage(langCode, force){

		var url = ASSET_ENDPOINT + "interface/" + langCode +".json?v="+this.version;
		if(this.uitext[langCode] && force == null){
			console.log("pulling from ram", "language", langCode);
			return this.uitext[langCode];
		}else{
			let uiLangResponse;
			try {
				uiLangResponse = await fetch(url, {cache: "no-cache"})
				.then(res => res.json());
				this.setData("lang:"+langCode, JSON.stringify(uiLangResponse));

			} catch(error){
				console.log("Offline, Falling back to cached ui lang!", error);
				let uiLangResponseString = await this.getData("lang:"+langCode);
				if(uiLangResponseString){
					uiLangResponse = JSON.parse(uiLangResponseString);
				}
			}
			this.uitext[langCode] = uiLangResponse;
			return uiLangResponse;
		}
	}

	t(UITextIdentifier, variableArray){
		let lang = "en";
		if(this.user){
			lang = this.user.language
		}else{
			lang = Localization.locale.substr(0, 2);
		}

		if(!this.uitext[lang]){
			lang = "en";
		}

		if(typeof variableArray == "string" || typeof variableArray == "number"){
			let text = this.uitext[lang][UITextIdentifier];
			if(text) return text.replace("$1", variableArray);
			return "UnSupportedIdentifier";
		}else if(typeof variableArray == "array"){
			let text = this.uitext[lang][UITextIdentifier];
			if(text){
				variableArray.forEach((variable, i) => {
					let variableIdentifier = `${i+1}`;
				 	text = text.replace(variableIdentifier, variable);
				});
				return text;
			}else{
				return "UnSupportedIdentifier";
			}

		}else{
			let text = this.uitext[lang][UITextIdentifier];
			if(text) return text;
			return "UnSupportedIdentifier";
		}
	}

  setData(key, data){
		return storage.save({key, data});
  }

  async getData(key){
    // returns promise
		try {
			return await storage.load({key});
		} catch (error) {
			return "";
		}
  }
}

const _api = new Api();
export default _api;
