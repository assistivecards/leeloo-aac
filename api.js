import Storage from 'react-native-storage';

import { AsyncStorage } from 'react-native';

import * as Speech from 'expo-speech';

import * as Localization from 'expo-localization';
// Check segment credentials

import UIText from './data/text.json';

import makeid from './js/makeid';
import Event from './js/event';
import styles from './js/styles';
import themes from './js/themes';

// For test cases
const NETWORK_STATUS = true;
const _FLUSH = true;
const _DEVELOPMENT = true;
const _DEVLANG = "";
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
		Speech.getAvailableVoicesAsync().then(res => {
			console.log(res);
		})
		//AsyncStorage.clear();
		this.styles = styles;
		this.config = {
			theme: themes.light
		}
		this.event = Event;
    console.log("API: Created instance");
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
			userResponse = await fetch(url, { method: 'POST', credentials: 'include', body: formData })
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

	async getCurrentProfile(){
		if(this.user){
			let profiles = this.user.profiles;
			let currentProfileId = await this.getData("currentProfileId");
			if(currentProfileId){
				return profiles.find(profile => profile.id == currentProfileId);
			}else{
				let fallbackProfile = profiles[0];
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
