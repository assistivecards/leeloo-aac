import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import API from '../api'

export default class App extends React.Component {

  render(){
    return (
      <View style={{backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : "#DBEFEE"}}>
        <SafeAreaView>
          <View style={styles.container}>
            <TouchableOpacity onPress={this.props.back} style={{padding: 10, paddingHorizontal: 25}}>
            <Svg width={30} height={30} viewBox="0 0 25 25">
              <Path fill={"#000"} d="M5.48528137,11 L21.1081973,11 C21.655955,11 22.1000004,11.4438648 22.1000004,12 C22.1000004,12.5522847 21.6446948,13 21.1081973,13 L5.41421356,13 L9.50573309,17.0915195 C9.89757882,17.4833653 9.89052429,18.1094757 9.5,18.5 C9.10675304,18.893247 8.47887752,18.8930911 8.09151952,18.5057331 L2.70137369,13.1155873 C2.60533276,13.0195463 2.53325514,12.9094323 2.48491363,12.7921633 C2.25074352,12.6099472 2.10000038,12.3240302 2.10000038,12 C2.10000038,11.657359 2.27524935,11.3549673 2.5364101,11.1747669 C2.58072179,11.0950773 2.63690805,11.0199462 2.70504261,10.9518116 L8.12338452,5.53346973 C8.5127688,5.14408545 9.14228695,5.14228695 9.53553391,5.53553391 C9.9260582,5.9260582 9.93149357,6.5537878 9.53759808,6.9476833 L5.48528137,11 Z"></Path>
            </Svg>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  buttonHolder: {
    paddingTop: 12,
    paddingBottom: 3,
    paddingHorizontal: 25,
  },
  buttonHolderFS: {
    paddingTop: 7,
    paddingBottom: 8,
    paddingHorizontal: 25,
  },
  title: {
    width: Dimensions.get("window").width - 78 * 2,
    height: 43,
    position: "relative",
    top: 3,
    flexDirection: "row",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  }
});
