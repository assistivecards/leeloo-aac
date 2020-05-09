import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Image as RNImage, PanResponder, Animated } from 'react-native';
import Constants from 'expo-constants';
import Svg, { Path, Line, Circle, Polyline } from 'react-native-svg';
import { Image } from 'react-native-elements';
import * as ScreenOrientation from 'expo-screen-orientation';
import { BlurView } from 'expo-blur';

import API from '../api'

import TopBar from '../components/TopBar'
import Profiles from '../components/Profiles'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSettings: false,
      pan: new Animated.ValueXY(),
      lock: false
    };

    this.state.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {
          dx: this.state.pan.x, // x,y are Animated.Value
          dy: this.state.pan.y
        }
      ]),
      onPanResponderRelease: () => {
        let xVal = this.state.pan.x._value;
        let yVal = this.state.pan.y._value;
        if(yVal < -200 && yVal > -270){
          if(xVal > -20 && xVal < 20){
            console.log("UNLOCKED!!!");
            this.setState({lock: false})
          }
        }
        Animated.spring(
          this.state.pan, // Auto-multiplexed
          { toValue: { x: 0, y: 0 } } // Back to zero
        ).start();
      }
    });
  }

  openAccountSettings(){
    this.props.navigation.push("Account");
  }

  componentDidMount(){
    API.event.on("refresh", this._refreshHandler)
    API.hit("Settings");
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);



  }

  _refreshHandler = () => {
    this.forceUpdate();
  };

  componentWillUnmount(){
    API.event.removeListener("refresh", this._refreshHandler)
    ScreenOrientation.unlockAsync();
  }

  render() {
    let user = API.user;

    let width = Dimensions.get("window").width;

    return (
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F7F7"}/>
        <ScrollView style={{flex: 1, backgroundColor: "#F7F7F7"}}>
          <Profiles navigation={this.props.navigation}/>
          <View style={styles.content}>
            <View style={styles.userSettings}>
              <TouchableOpacity style={styles.selectionItem} onPress={() => this.openAccountSettings()}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Circle cx="12" cy="7" r="4" />
                  <Path d="M5.5 21v-2a4 4 0 0 1 4 -4h5a4 4 0 0 1 4 4v2" />
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_account")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.selectionItem} onPress={() => this.props.navigation.push("Language")}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Path d="M5 7h7m-2 -2v2a5 7 0 0 1 -5 8m1 -4a7 4 0 0 0 6.7 4" />
                  <Path d="M11 19l4 -9l4 9m-.9 -2h-6.2" />
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_language")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.selectionItem} onPress={() => this.props.navigation.push("Voice")}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Path d="M15 8a5 5 0 0 1 0 8" />
                  <Path d="M17.7 5a9 9 0 0 1 0 14" />
                  <Path d="M6 15 h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_voice")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.selectionItem} onPress={() => this.props.navigation.push("Notification")}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                  <Circle cx="16" cy="8" r="3" />
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_notifications")}</Text>
              </TouchableOpacity>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" />
                  <Path d="M10 12l-2 -2.2l.6 -1" />
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_subscriptions")}</Text>
              </View>

              <TouchableOpacity onPress={() => API.signout()}>
                <View style={[styles.selectionItem, {borderBottomWidth: 0}]}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <Path stroke="none" d="M0 0h24v24H0z"/>
                    <Path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                    <Path d="M7 12h14l-3 -3m0 6l3 -3" />
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_signout")}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.appSettings}>
              <View style={styles.selectionCarrier}>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/feedback/"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <Path stroke="none" d="M0 0h24v24H0z"/>
                      <Line x1="10" y1="14" x2="21" y2="3" />
                      <Path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" />
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_sendFeedback")}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/licenses/"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M0 0h24v24H0z" stroke="none"/>
                      <Polyline points="7 8 3 12 7 16"/>
                      <Polyline points="17 8 21 12 17 16"/>
                      <Line x1="14" x2="10" y1="4" y2="20"/>
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_openSourceLicenses")}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/privacypolicy/"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <Path stroke="none" d="M0 0h24v24H0z"/>
                      <Polyline points="14 3 14 8 19 8" />
                      <Path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                      <Path d="M9 15l2 2l4 -4" />
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_privacyPolicy")}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/termsofservice/"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <Path stroke="none" d="M0 0h24v24H0z"/>
                      <Path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
                      <Line x1="9" y1="7" x2="13" y2="7" />
                      <Line x1="9" y1="11" x2="13" y2="11" />
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_termsOfService")}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.selectionItem, {borderBottomWidth: 0}]} onPress={() => this.props.navigation.push("Remove")}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <Path stroke="none" d="M0 0h24v24H0z"/>
                    <Line x1="4" y1="7" x2="20" y2="7" />
                    <Line x1="10" y1="11" x2="10" y2="17" />
                    <Line x1="14" y1="11" x2="14" y2="17" />
                    <Path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <Path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_removeMyData")}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={API.styles.iosBottomPadder}></View>
          </View>
        </ScrollView>
        {
          this.state.lock &&
          <View style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}>
            <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F7F7"}/>
            <View style={{backgroundColor: "#F7F7F7", flex: 1, alignItems: "center", justifyContent: "center"}}>
              <Svg height={50} width={50} viewBox="0 0 24 24">
                <Path fill={"#29395F"} d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"></Path>
              </Svg>
              <View style={{height: 180, alignItems: "center"}}>
                <Text style={API.styles.h2}>Parents Only</Text>
                <Text style={[API.styles.p, {textAlign: "center"}]}>Drag and drop the key to padlock in order to unlock the Settings</Text>
              </View>
              <Animated.View
                {...this.state.panResponder.panHandlers}
                style={this.state.pan.getLayout()}>
                <Svg height={50} width={50} viewBox="0 0 24 24">
                  <Path fill={"#29395F"} d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></Path>
                </Svg>
              </Animated.View>
            </View>
          </View>
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  childCover: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%", height: "100%",
    zIndex: 99,
    justifyContent: "center",
    alignItems: "center"
  },
  childCoverInner: {
    width: "100%",
    height: 300,
    backgroundColor: "#fff"
  },
  account: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#F7F7F7",
    paddingBottom: 15
  },
  content: {
    backgroundColor: "#fff",
    position: "relative"
  },
  userCarrier: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  userLeft: {
    flexDirection: "row"
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10
  },
  userRight: {
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  selectionCarrier: {
    marginTop: 10
  },
  selectionItem: {
    flexDirection: "row",
    height: 44,
    alignItems: "center",
  },
  selectionIcon: {
    margin: 10,
    marginRight: 20
  },
  userSettings: {
    marginHorizontal: 30,
    paddingBottom: 15,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: API.config.theme.mainBorderColor
  },
  appSettings: {
    marginHorizontal: 30,
    paddingTop: 5,
  }
});
