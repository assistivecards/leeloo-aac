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

  componentDidMount(){
    API.hit("Language");
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

    if(voiceDriver == "unsupported"){
      alert(API.t("alert_yourDeviceDoesNotSupportTTS"));
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
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonPress={() => this.save()}/>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
          <View style={styles.head}>
            <Text style={API.styles.h1}>{API.t("settings_selection_language")}</Text>
            <Text style={API.styles.pHome}>{API.t("settings_language_description")}</Text>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
            <View style={styles.preferenceItem}>
              <Text style={API.styles.h2}>{API.t("settings_language_basedOnYourDevice")}</Text>
              <Text style={API.styles.subSmall}>{API.t("settings_language_basedOnYourDevice_description")}</Text>
              {Languages.languages.filter(lang => Localization.locales.join('|').includes(lang.code) || lang.code == API.user.language).map((lang, i) => {
                return (
                  <TouchableOpacity onPress={() => { API.haptics("touch"); this.setState({language: lang.code})}} key={i} style={styles.listItem}>
                    <View>
                      <Text style={[API.styles.h3, {marginVertical: 0}]}>{lang.title}</Text>
                      <Text style={API.styles.p}>{lang.native}</Text>
                    </View>
                    <View style={[styles.pointer, {backgroundColor: this.state.language == lang.code ? "#6989FF": "#eee"}]}></View>
                  </TouchableOpacity>
                )
              })}
            </View>
            <View style={styles.preferenceItem}>
              <Text style={API.styles.h2}>{API.t("settings_language_supportedLanguages")}</Text>
              <Text style={API.styles.subSmall}>{API.t("settings_language_supportedLanguages_description")}</Text>
              {Languages.languages.map((lang, i) => {
                return (
                  <TouchableOpacity onPress={() => { API.haptics("touch"); this.setState({language: lang.code})}} key={i} style={styles.listItem}>
                    <View>
                      <Text style={[API.styles.h3, {marginVertical: 0}]}>{lang.title}</Text>
                      <Text style={API.styles.p}>{lang.native}</Text>
                    </View>
                    <View style={[styles.pointer, {backgroundColor: this.state.language == lang.code ? "#6989FF": "#eee"}]}></View>
                  </TouchableOpacity>
                )
              })}
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
    backgroundColor: "#6989FF",
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
