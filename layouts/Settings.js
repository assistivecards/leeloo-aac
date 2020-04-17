import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity } from 'react-native';

import API from '../api';

export default class Setting extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return(<View style={{flex: 1}}><Text>test settings</Text></View>)
  }
}

const styles = StyleSheet.create({
  carrier: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%"
  },
  carrierSV: {
    width: "100%",
    height: Dimensions.get("window").height - 50
  }
});
