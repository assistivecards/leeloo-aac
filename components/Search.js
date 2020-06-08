import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, TextInput } from 'react-native';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import API from '../api'

export default class App extends React.Component {

  clear(){
    this.props.dismiss();
    this._textInput.blur();
  }

  render(){

    let searchIconStyle = {position: "absolute", top: 16, left: 40 };
    if(API.user.isRTL){
      searchIconStyle = {position: "absolute", top: 16, right: 40, transform: [{rotateY: "180deg"}]};
    }

    let clearIconStyle = {padding: 15, position: "absolute", top: 0, right: 25};
    if(API.user.isRTL){
      clearIconStyle = {padding: 15, position: "absolute", top: 0, left: 25};
    }

    return (
      <LinearGradient style={styles.textInputCarrier} colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)']}>
        <TextInput
          placeholder={API.t("search_input_placeholder")}
          style={[styles.textInput, {textAlign: API.user.isRTL ? "right" : "left"}]}
          ref={component => this._textInput = component}
          onBlur={this.props.onBlur}
          onFocus={this.props.onFocus}
          value={this.props.term}
          placeholderTextColor={"#b6b6b7"}
          onChangeText={this.props.onChangeText}
        />

        <TouchableOpacity onPress={() => this._textInput.focus()} style={searchIconStyle}>
          <Svg width={26} height={26} viewBox={"0 0 24 24"}>
            <Circle cx="7" cy="7" r="7" transform="translate(7 3)" strokeWidth="2" stroke="#000" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0)"/>
            <Line y1="6" x2="6" transform="translate(3 15)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </Svg>
        </TouchableOpacity>

        {this.props.term != "" &&
          <TouchableOpacity onPress={this.props.back} style={clearIconStyle} onPress={() => this.clear()}>
            <Svg width={30} height={30} viewBox="0 0 25 25">
              <Path fill={"#000"} d={"M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"}></Path>
            </Svg>
          </TouchableOpacity>
        }
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
    paddingHorizontal: 55,
    backgroundColor: "#fff",
    color: "#333",
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
