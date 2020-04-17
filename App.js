import React from 'react';
import { Text, View, StatusBar } from 'react-native';
import Navigator from './Navigator';

import * as Font from 'expo-font';

import API from './api';

export default class App extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar hidden={true}/>
        <Navigator/>
      </View>
    );
  }
}
