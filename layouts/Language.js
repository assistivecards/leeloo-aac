import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as Localization from 'expo-localization';

import API from '../api';
import Languages from '../data/languages.json';
import TopBar from '../components/TopBar'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      language: API.user.language
    }
  }

  async save(){
    API.haptics("touch");
    let { language } = this.state;
    let changedFields = [];
    let changedValues = [];

    if(language != API.user.language){
      changedFields.push("language");
      changedValues.push(language);
    }

    let voiceDriver = await API.getBestAvailableVoiceDriver(language);
    console.log("returnedVoice driver ######", voiceDriver);

    if(voiceDriver == "unsupported"){
      alert("Your device doesn't support voice driver for this language. In order to use TTS capabilities, you need to install a voice driver. You can try 'Google TTS' app to install and manage drivers!");
    }

    changedFields.push("voice");
    changedValues.push(voiceDriver != "unsupported" ? voiceDriver.identifier : "unsupported");

    let updateRes = await API.update(changedFields, changedValues);
    this.props.navigation.pop();
    API.haptics("impact");
  }

  didChange(){
    return this.state.language != API.user.language;
  }

  render() {
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F9FB"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonText={"Apply"} rightButtonPress={() => this.save()}/>
        <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}}>
          <View style={styles.head}>
            <Text style={API.styles.h1}>{API.t("settings_selection_language")}</Text>
            <Text style={API.styles.p}>Choose the language for app interface and assistive cards</Text>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff"}}>
            <View style={styles.preferenceItem}>
              <Text style={API.styles.h3}>Based On Your Device</Text>
              <Text style={API.styles.subSmall}>Languages from your native settings</Text>
              {Languages.languages.filter(lang => Localization.locales.join('|').includes(lang.code) || lang.code == API.user.language).map((lang, i) => {
                return (
                  <TouchableOpacity onPress={() => { API.haptics("touch"); this.setState({language: lang.code})}} key={i} style={styles.listItem}>
                    <View>
                      <Text style={[API.styles.h3, {marginVertical: 0}]}>{lang.title}</Text>
                      <Text style={API.styles.p}>{lang.native}</Text>
                    </View>
                    <View style={[styles.pointer, {backgroundColor: this.state.language == lang.code ? "#4e88c5": "#eee"}]}></View>
                  </TouchableOpacity>
                )
              })}
            </View>
            <View style={styles.preferenceItem}>
              <Text style={API.styles.h3}>Supported Languages</Text>
              <Text style={API.styles.subSmall}>All the languages that Leeloo AAC cards supports</Text>
              {Languages.languages.map((lang, i) => {
                return (
                  <TouchableOpacity onPress={() => { API.haptics("touch"); this.setState({language: lang.code})}} key={i} style={styles.listItem}>
                    <View>
                      <Text style={[API.styles.h3, {marginVertical: 0}]}>{lang.title}</Text>
                      <Text style={API.styles.p}>{lang.native}</Text>
                    </View>
                    <View style={[styles.pointer, {backgroundColor: this.state.language == lang.code ? "#4e88c5": "#eee"}]}></View>
                  </TouchableOpacity>
                )
              })}
            </View>
            <View style={{height: 600}}></View>
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
