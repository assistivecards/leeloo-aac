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
      voices: []
    }
  }

  componentDidMount(){
    Speech.getAvailableVoicesAsync().then(voices => {
      this.setState({voices});
    })
  }

  save(){
    let { newName, newEmail } = this.state;
    let changedFields = [];
    let changedValues = [];

    if(newName != null){
      changedFields.push("name");
      changedValues.push(newName);
    }

    if(newEmail != null){
      changedFields.push("email");
      changedValues.push(newEmail);
    }

    API.update(changedFields, changedValues).then(res => {
      this.props.navigation.pop();
    })
  }

  didChange(){
    return false;
  }

  render() {
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F9FB"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonText={"Apply"} rightButtonPress={() => this.save()}/>
        <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}}>
          <View style={styles.head}>
            <Text style={API.styles.h1}>TTS Voices</Text>
            <Text style={API.styles.p}>Voice drives that is supported by your device</Text>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff"}}>
            <View style={styles.preferenceItem}>
              <Text style={API.styles.p}>{JSON.stringify(Localization.locales)}</Text>
              {this.state.voices.map((voice, i) => {
                if(voice.language.includes("en")){
                  return (
                    <View key={i}>
                      <Text style={API.styles.h3}>{voice.name}</Text>
                      <Text style={API.styles.p}>{voice.language}</Text>
                      <Text style={API.styles.sub}>{voice.identifier}</Text>
                    </View>
                  )
                }
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
  }
});
