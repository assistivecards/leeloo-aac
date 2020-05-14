import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, TextInput } from 'react-native';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';

import API from '../api'

export default class App extends React.Component {

  render(){
    const results = API.search(this.props.term);

    return (
      <View>
        {
          results.map((result, i) => {
            return (<Text key={i}>{result.title}</Text>);
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
});
