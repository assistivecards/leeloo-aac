import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, TextInput } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import API from '../api'

export default class App extends React.Component {

  render(){
    return (
      <View style={styles.textInputCarrier}>
        <TextInput
          placeholder={"Search cards"}
          style={styles.textInput}
        />

        <Svg width={30} height={30} viewBox={"0 0 196 196"} style={{position: "absolute", top: 12, left: 35}}>
          <Rect  width="85.583" height="97.433" rx="10" transform="translate(0 37.597) rotate(-16)" fill="#00BBD3"/>
          <Rect  width="104.016" height="118.499" rx="10" transform="translate(28.807 13.245)" fill="#70E3F2"/>
          <Rect  width="104.016" height="118.499" rx="10" transform="translate(59.943 0) rotate(8)" fill="#FF81A2"/>
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputCarrier: {
    paddingHorizontal: 20,
    flex: 1,
    marginBottom: 5,
    marginTop: 5
  },
  textInput: {
    fontSize: 16,
    paddingLeft: 55,
    paddingTop: 2,
    backgroundColor: "#fff",
    borderRadius: 7,
    height: 45,
    borderWidth: 1,
    borderColor: '#eee'
  }
});
