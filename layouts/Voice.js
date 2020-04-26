import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as Localization from 'expo-localization';
import * as Speech from 'expo-speech';

import API from '../api';
import Languages from '../data/languages.json';
import TopBar from '../components/TopBar'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      voice: API.user.voice,
      voices: []
    }

    API.getAvailableVoicesAsync().then(voices => this.setState({
      voices: voices.filter(voice => voice.language.includes(API.user.language)).sort((a, b) => {
          let aQ = !(a.quality == "Enhanced");
          let bQ = !(b.quality == "Enhanced");
          if (aQ < bQ) return -1
          if (aQ > bQ) return 1
          return 0
      })
    }));
    // Move this so somewhere better + add a loading indicator

    this.testPhrase = "This is a test voice.";
  }

  save(){
    API.haptics("touch");
    let { voice } = this.state;
    let changedFields = [];
    let changedValues = [];

    if(voice != API.user.voice){
      changedFields.push("voice");
      changedValues.push(voice);
    }

    API.update(changedFields, changedValues).then(res => {
      this.props.navigation.pop();
      API.haptics("impact");
    })
  }

  didChange(){
    return this.state.voice != API.user.voice;
  }

  listVoices(voices){
    return voices.map((voice, i) => {
      return (
        <TouchableOpacity onPress={() => { API.haptics("touch"); Speech.speak(this.testPhrase, {voice: voice.identifier}); this.setState({voice: voice.identifier})}} key={i} style={styles.listItem}>
          <View style={{width: "80%"}}>
            <Text style={[API.styles.h3, {marginVertical: 0}]}>{voice.name}</Text>
            <Text style={[API.styles.p, {marginBottom: 2}]}>{voice.language} - {voice.quality}</Text>
            <Text style={API.styles.sub}>{voice.identifier}</Text>
          </View>
          <View style={[styles.pointer, {backgroundColor: this.state.voice == voice.identifier ? "#4e88c5": "#eee"}]}></View>
        </TouchableOpacity>
      )
    })
  }

  renderVoices(){
    let voices = this.state.voices;

    if(voices.length == 0){
      return (<Text>No voice driver</Text>);
    }else if(voices.length == 1){
      return this.listVoices(voices);
    }else{
      if(voices[0].language.length == 2){
        return this.listVoices(voices);
      }else{
        // locale info is in the expected version en-US|en-us|en_US|en_us
        let deviceLocaleCodeString = API.localeString().toLowerCase().replace(/_/g, "-");

        let localizedVoices = voices.filter(voice => deviceLocaleCodeString.includes(voice.language.toLowerCase()))
        if(localizedVoices.length == 0 || (voices.length - localizedVoices.length) == 0){
          return this.listVoices(voices);
        }else{

          let non_localizedVoices = voices.filter(voice => !deviceLocaleCodeString.includes(voice.language.toLowerCase()))
          return (
            <View>
              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>{API.t("settings_voice_basedOnYourLocation")}</Text>
                <Text style={API.styles.subSmall}>{API.t("settings_voice_basedOnYourLocation_description")}</Text>
                {this.listVoices(localizedVoices)}
              </View>

              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>{API.t("settings_voice_supportedVoice")}</Text>
                <Text style={API.styles.subSmall}>{API.t("settings_voice_supportedVoice_description")}</Text>
                {this.listVoices(non_localizedVoices)}
              </View>
            </View>
          );
        }
      }
    }
  }

  // no voice driver x
  // one voice driver x
  // no voice for the locale, but multiple for that language
  // one voice driver for your locale, and one or more for that language
  // multiple voice driver for your locale, and

  render() {
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F9FB"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonPress={() => this.save()}/>
        <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}}>
          <View style={styles.head}>
            <Text style={API.styles.h1}>{API.t("settings_selection_voice")}</Text>
            <Text style={API.styles.p}>{API.t("settings_voice_description")}</Text>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff"}}>
            <View style={styles.preferenceItem}>
              {this.renderVoices()}
            </View>
            <View style={API.styles.iosBottomPadder}></View>
          </View>
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#F7F9FB",
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5
  },
  preferenceItem: {
    marginBottom: 10
  },
  listItem: {
    borderBottomWidth: 1, borderColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  pointer: {
    width: 24, height: 24, borderRadius: 12,
    marginRight: 30
  }
});
