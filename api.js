import Storage from 'react-native-storage';

import { AsyncStorage, Platform, Alert } from 'react-native';

import * as Speech from 'expo-speech';
import * as Localization from 'expo-localization';
import * as Haptics from 'expo-haptics';
import * as Permissions from 'expo-permissions';

import { Notifications } from 'expo';
import Constants from 'expo-constants';

import UIText from './js/uitext.js';

import makeid from './js/makeid';
import Event from './js/event';
import styles from './js/styles';
import themes from './js/themes';

// For test cases
const NETWORK_STATUS = true;
const _FLUSH = true;
const _DEVELOPMENT = true;
const _DEVUSERIDENTIFIER = "114203700870626824237";
const _DEVLOCALE = "en-US";
const API_ENDPOINT = "https://leeloo.dreamoriented.org/";

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
		//AsyncStorage.clear();
		this.styles = styles;
		this.config = {
			theme: themes.light
		}
		this.event = Event;

    console.log("API: Created instance");
  }

	haptics(style){
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

	async registerForPushNotificationsAsync(){
	    if(Constants.isDevice) {
	      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
	      let finalStatus = existingStatus;
	      if(existingStatus !== 'granted'){
	        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	        finalStatus = status;
	      }
	      if(finalStatus !== 'granted'){
	        return "ungranted";
	      }

	      let token = await Notifications.getExpoPushTokenAsync();

		    if(Platform.OS === 'android'){
		      Notifications.createChannelAndroidAsync('default', {
		        name: 'default',
		        sound: true,
		        priority: 'max',
		        vibrate: [0, 250, 250, 250],
		      });
		    }

				this.update(["notificationToken"], [token]).then(res => {
					console.log("updated notification token");
		    })

	    }else{
	      console.log('Must use physical device for Push Notifications');
				return "";
	    }
	  }

	async signIn(identifier, type, user){
    var url = API_ENDPOINT + "user/";
    var formData = new FormData();
		formData.append('identifier', identifier);

		if(type == "apple"){
			formData.append('type', type);
			formData.append('email', user.email);
			formData.append('name', user.fullName.givenName + " " +user.fullName.familyName);

		}else if(type == "google"){
			formData.append('type', type);
			formData.append('email', user.email);
			formData.append('name', user.displayName);
			formData.append('avatar', user.photoURL);
		}

		let userResponse;

		try {
			userResponse = await fetch(url, { method: 'POST', body: formData })
	    .then(res => res.json());
			this.setData("user", JSON.stringify(userResponse));
		} catch(error){
			console.log("Offline, Falling back to cached userdata!");
			let userResponseString = await this.getData("user");
			if(userResponseString){
				userResponse = JSON.parse(userResponseString);
			}
		}

		this.user = userResponse;
		this.user.active_profile = await this.getCurrentProfile();
		return userResponse;
	}


  signout(){
    Alert.alert(
      "Confirm Sign Out",
      "Keep in mind you can keep signed in, and don't have to sign out of your account every time.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
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

			try {
				let userResponse = await fetch(url, { method: 'POST', credentials: 'include', body: formData })
		    .then(res => res.json());
				this.setData("user", JSON.stringify(userResponse));
				this.user = userResponse;
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
			let currentProfileId = await this.getData("currentProfileId");
			if(currentProfileId){
				return profiles.find(profile => profile.id == currentProfileId);
			}else{
				let fallbackProfile;
				if(profiles.length != 0){
					fallbackProfile = profiles[0];
				}else{
					fallbackProfile = {id: 0};
				}
				this.setData("currentProfileId", fallbackProfile.id);
				return fallbackProfile;
			}
		}else{
			return null;
		}
	}

	async setCurrentProfile(profileId){
		if(this.user){
			let profiles = this.user.profiles;
			this.user.active_profile = profiles.find(profile => profile.id == profileId);
			await this.setData("currentProfileId", profileId);
		}
	}

	async getAvailableVoicesAsync(recall){
		let voices = await Speech.getAvailableVoicesAsync();

		if(voices.length == 0){
			if(recall){
				return "unsupported";
			}else{
				await new Promise(function(resolve) {
		        setTimeout(resolve, 1000);
		    });
				console.log("WAITED FOR IT MAN.. KINDA WIERD");
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

	t(UITextIdentifier, variableArray){
		let lang = "en";
		if(this.user.language){
			lang = this.user.language
		}else{
			lang = Localization.locale.substr(0, 2);
		}

		if(typeof variableArray == "string" || typeof variableArray == "number"){
			let text = UIText[lang][UITextIdentifier];
			if(text) return text.replace("$1", variableArray);
			return "UnSupportedIdentifier";
		}else if(typeof variableArray == "array"){
			let text = UIText[lang][UITextIdentifier];
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
			let text = UIText[lang][UITextIdentifier];
			if(text) return text;
			return "UnSupportedIdentifier";
		}
	}

  setData(key, data){
		console.log(key, data)
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
