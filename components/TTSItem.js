import React from 'react';
import { StyleSheet, Platform, Text, View, TouchableOpacity, StatusBar, Dimensions, Image, TextInput } from 'react-native';
import { Image as CachedImage } from "react-native-expo-image-cache";

import API from '../api'
import TouchableScale from './touchable-scale'

export default class App extends React.Component {

  speak(text, speed){
    API.haptics("touch");
    API.speak(text, speed);
  }

  render(){
    let result = this.props.result;
    return (
      <TouchableScale style={{width: this.props.width}} onPress={() => this.speak(this.props.term)}>
        <View style={[styles.item, {flexDirection: API.user.isRTL ? "row-reverse" : "row", backgroundColor: "#F7F7F7"}]}>
          <Image source={require("../assets/voice.png")} style={{width: API.isTablet ? 70 : 50, height: API.isTablet ? 70 : 50, margin: 5}}/>
          <Text style={[styles.searchItemText, {fontSize: 19, marginLeft: 10, color: "#555"}]}>{this.props.term}</Text>
        </View>
      </TouchableScale>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  searchItemText:{
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.75)",
    flex: 1,
    paddingRight: 10
  },
  searchItemEmoji: {
    fontSize: 25, margin: 10
  }
});
