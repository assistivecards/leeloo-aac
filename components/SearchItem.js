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

  openCard(card){
    API.event.emit("announce", card);
  }

  render(){
    let result = this.props.result;
    return (
      <TouchableScale style={{width: this.props.width}} onPress={result.type == 2 ? () => this.speak(result.title) : () => this.openCard(result)}>
        <View style={[styles.item, {flexDirection: API.user.isRTL ? "row-reverse" : "row", backgroundColor: result.type == 1 ? result.color : "#F7F7F7"}]}>
          <CachedImage uri={`${API.assetEndpoint}cards/${result.pack}/${result.slug}.png?v=${API.version}`} style={{width: 50, height: 50, margin: 5}}/>
          {result.type == 2 && <Text style={styles.searchItemEmoji}>{result.emoji}</Text>}
          <Text style={[styles.searchItemText, {fontSize: result.type == 2 ? 16 : 19, marginLeft: result.type == 2 ? 0 : 10}]}>{result.title}</Text>
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
    opacity: 0.75,
    flex: 1,
    paddingRight: 10
  },
  searchItemEmoji: {
    fontSize: 25, margin: 10
  }
});
