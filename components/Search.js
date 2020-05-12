import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, TextInput } from 'react-native';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import API from '../api'

export default class App extends React.Component {

  render(){
    return (
      <LinearGradient style={styles.textInputCarrier} colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)']}>
        <TextInput
          placeholder={API.t("search_input_placeholder")}
          style={styles.textInput}
          onBlur={this.props.onBlur}
          onFocus={this.props.onFocus}
          onChangeText={this.props.onChangeText}
        />

        <Svg width={26} height={26} viewBox={"0 0 24 24"} style={{position: "absolute", top: 16, left: 40}}>
          <Circle cx="7" cy="7" r="7" transform="translate(7 3)" strokeWidth="2" stroke="#000" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0)"/>
          <Line y1="6" x2="6" transform="translate(3 15)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
        </Svg>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  textInputCarrier: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5
  },
  textInput: {
    fontSize: 17,
    paddingLeft: 55,
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    borderWidth: 0.5,
    borderColor: '#EAEBEE',
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  }
});
