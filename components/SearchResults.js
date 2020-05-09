import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, TextInput } from 'react-native';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';

import API from '../api'

export default class App extends React.Component {

  render(){
    return (
      <View>
        <Text>{this.props.term} search resulsts.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
});
