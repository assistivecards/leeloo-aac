import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, ActivityIndicator } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

import API from '../api'

export default class App extends React.Component {

  state = {
    rightButtonActivity: false
  }

  onRightButtonPress(){
    this.setState({rightButtonActivity: true})
    setTimeout(() => {
      this.props.rightButtonPress();
    }, 200);
  }

  render(){
    return (
      <View style={{backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : "#6989FF"}}>
        <StatusBar backgroundColor={this.props.backgroundColor ? this.props.backgroundColor : "#6989FF"} barStyle={this.props.backgroundColor == "#6989FF" ? "light-content" : "dark-content"} />
        <SafeAreaView>
          <View style={[styles.container, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]}>
            <TouchableOpacity onPress={this.props.back} style={{padding: 10, paddingHorizontal: 25}}>
              <Svg width={30} height={30} viewBox="0 0 25 25">
                <Path fill={this.props.backgroundColor == "#6989FF" ? "#fff" : "#000"} d={API.user.isRTL ? "M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" : "M5.48528137,11 L21.1081973,11 C21.655955,11 22.1000004,11.4438648 22.1000004,12 C22.1000004,12.5522847 21.6446948,13 21.1081973,13 L5.41421356,13 L9.50573309,17.0915195 C9.89757882,17.4833653 9.89052429,18.1094757 9.5,18.5 C9.10675304,18.893247 8.47887752,18.8930911 8.09151952,18.5057331 L2.70137369,13.1155873 C2.60533276,13.0195463 2.53325514,12.9094323 2.48491363,12.7921633 C2.25074352,12.6099472 2.10000038,12.3240302 2.10000038,12 C2.10000038,11.657359 2.27524935,11.3549673 2.5364101,11.1747669 C2.58072179,11.0950773 2.63690805,11.0199462 2.70504261,10.9518116 L8.12338452,5.53346973 C8.5127688,5.14408545 9.14228695,5.14228695 9.53553391,5.53553391 C9.9260582,5.9260582 9.93149357,6.5537878 9.53759808,6.9476833 L5.48528137,11 Z"}></Path>
              </Svg>
            </TouchableOpacity>
            {this.props.rightButtonRender &&
              <TouchableOpacity disabled={!this.props.rightButtonActive} onPress={() => this.onRightButtonPress()} style={{padding: 10, paddingHorizontal: 25}}>
                <View style={[styles.rightButton, {backgroundColor: "#fff", opacity: this.props.rightButtonActive ? 1: 0.4}]}>
                  {this.state.rightButtonActivity &&
                    <ActivityIndicator color={"#6989FF"}/>
                  }
                  {!this.state.rightButtonActivity &&
                    <Svg width={25} height={25} viewBox="0 0 25 25" strokeWidth={1} stroke={"#6989FF"}>
                      <Path fill={"#6989FF"} d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"></Path>
                    </Svg>
                  }
                </View>
              </TouchableOpacity>
            }
            {this.props.lock == "locked" &&
              <TouchableOpacity onPress={this.props.lockPress} style={{padding: 10, paddingHorizontal: 29}}>
                <Svg width={30} height={30} viewBox="0 0 24 24" strokeLinecap="round" strokeWidth="2" stroke="#fff" fill="none">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Rect x="5" y="11" width="14" height="10" rx="2" />
                  <Circle cx="12" cy="16" r="1" />
                  <Path d="M8 11v-5a4 4 0 0 1 8 0" />
                </Svg>
              </TouchableOpacity>
            }

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
    paddingTop: 0,
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
  },
  rightButton: {
    backgroundColor: "#6989FF",
    height: 30,
    width: 60,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  }
});
