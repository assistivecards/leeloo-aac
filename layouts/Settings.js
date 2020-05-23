import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Image, PanResponder, Animated } from 'react-native';
import Constants from 'expo-constants';
import Svg, { Path, Line, Circle, Polyline, Rect } from 'react-native-svg';
import * as ScreenOrientation from 'expo-screen-orientation';

import API from '../api'

import TopBar from '../components/TopBar'
import Profiles from '../components/Profiles'
import Promo from '../components/Promo'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSettings: false,
      pan: new Animated.ValueXY(),
      lock: API.locked,
      lockByUser: false,
      lockAnim: new Animated.Value(API.locked ? 0 : 1)
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
        if(yVal < 25 && yVal > -25){
          if(xVal > -170 && xVal < -90){
            console.log("UNLOCKED!!!");

            Animated.timing(this.state.lockAnim, {
              toValue: 0,
              duration: 200
            }).start();
            setTimeout(() => {
              this.setState({lock: false});
              API.locked = false;
            }, 200)
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
    if(API.locked){
      this.state.lockAnim.setValue(1);
    }else{
      this.state.lockAnim.setValue(0);
    }
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


  lockPress(){
    this.setState({
      lock: true,
      lockByUser: true
    })
    API.locked = true;

    Animated.timing(this.state.lockAnim, {
      toValue: 1,
      duration: 400
    }).start();

    setTimeout(() => {
      this.props.navigation.pop();
    }, 1000);
  }

  render() {
    let user = API.user;

    let width = Dimensions.get("window").width;

    let lockBG = this.state.lockAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(105,137,255,0)", "rgba(105,137,255,0.8)"]
    });

    return (
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"} lock={"locked"} lockPress={this.lockPress.bind(this)}/>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
          <Profiles navigation={this.props.navigation}/>
          <View style={styles.content}>
            <View style={styles.userSettings}>
              <TouchableOpacity style={[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]} onPress={() => this.openAccountSettings()}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Circle cx="12" cy="7" r="4" />
                  <Path d="M5.5 21v-2a4 4 0 0 1 4 -4h5a4 4 0 0 1 4 4v2" />
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_account")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]} onPress={() => this.props.navigation.push("Language")}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Path d="M5 7h7m-2 -2v2a5 7 0 0 1 -5 8m1 -4a7 4 0 0 0 6.7 4" />
                  <Path d="M11 19l4 -9l4 9m-.9 -2h-6.2" />
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_language")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]} onPress={() => this.props.navigation.push("Voice")}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Path d="M15 8a5 5 0 0 1 0 8" />
                  <Path d="M17.7 5a9 9 0 0 1 0 14" />
                  <Path d="M6 15 h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_voice")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]} onPress={() => this.props.navigation.push("Notification")}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                  <Circle cx="16" cy="8" r="3" />
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_notifications")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]} onPress={() => this.props.navigation.push("Subscription")}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <Path stroke="none" d="M0 0h24v24H0z"/>
                  <Path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" />
                  <Path d="M10 12l-2 -2.2l.6 -1" />
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_subscriptions")}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.appSettings}>
              <View style={styles.selectionCarrier}>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/leeloo-feedback/"})}>
                  <View style={[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <Path stroke="none" d="M0 0h24v24H0z"/>
                      <Line x1="10" y1="14" x2="21" y2="3" />
                      <Path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" />
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_sendFeedback")}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/licenses/"})}>
                  <View style={[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]}>
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
                  <View style={[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <Path stroke="none" d="M0 0h24v24H0z"/>
                      <Polyline points="14 3 14 8 19 8" />
                      <Path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                      <Path d="M9 15l2 2l4 -4" />
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_privacyPolicy")}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/termsofuse/"})}>
                  <View style={[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <Path stroke="none" d="M0 0h24v24H0z"/>
                      <Path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
                      <Line x1="9" y1="7" x2="13" y2="7" />
                      <Line x1="9" y1="11" x2="13" y2="11" />
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_termsOfService")}</Text>
                  </View>
                </TouchableOpacity>

                {false &&
                  <TouchableOpacity style={[[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}], {borderBottomWidth: 0}]} onPress={() => this.props.navigation.push("Remove")}>
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
                }
                <View style={{height: 10}}></View>
              </View>
              {!API.isPremium() &&
                <Promo showPremium={() => this.props.navigation.push("Premium")}/>
              }
            </View>
            <View style={API.styles.iosBottomPadder}></View>
          </View>
        </ScrollView>
        {
          this.state.lock &&
          <View style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}>
            <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"}/>
            <Animated.View style={{backgroundColor: lockBG, flex: 1, alignItems: "center", justifyContent: "center"}}>
              {
                this.state.lockByUser &&
                  <View style={{width: 60, height: 60, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderRadius: 30}}>
                    <ActivityIndicator color={"#6989FF"}/>
                  </View>
              }
              {
                !this.state.lockByUser &&
                <Animated.View style={{flex: 1, alignItems: "center", justifyContent: "center", opacity: this.state.lockAnim}}>
                  <View style={[styles.shadow, {alignItems: "center", justifyContent: "center", backgroundColor: "#6989FF", margin: 20, borderRadius: 40, paddingVertical: 30}]}>
                    <View style={{marginBottom: 0}}>
                      <Image source={require("../assets/mascot.png")} style={{width: 100, height: 100}} resizeMode={"contain"}/>
                    </View>
                    <Text style={[API.styles.h1, {color: "#fff", marginTop: 15}]}>{API.t("settings_locked_title")}</Text>
                    <Text style={[API.styles.pHome, {textAlign: "center", marginTop: 5}]}>{API.t("settings_locked_description")}</Text>
                    <View style={{flexDirection: "row", justifyContent: "center", marginTop: 20}}>
                      <View style={{width: 50, height: 50, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderRadius: 25}}>
                        <Svg width={30} height={30} viewBox="0 0 24 24" strokeLinecap="round" strokeWidth="2" stroke="#6989FF" fill="none">
                          <Path stroke="none" d="M0 0h24v24H0z"/>
                          <Rect x="5" y="11" width="14" height="10" rx="2" />
                          <Circle cx="12" cy="16" r="1" />
                          <Path d="M8 11v-5a4 4 0 0 1 8 0" />
                        </Svg>
                      </View>
                      <View style={{width: 100}}></View>
                      <Animated.View
                        {...this.state.panResponder.panHandlers}
                        style={this.state.pan.getLayout()}>
                        <View style={{width: 50, height: 50, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderRadius: 25}}>
                          <Svg width={30} height={30} viewBox="0 0 24 24" strokeLinecap="round" strokeWidth="2" stroke="#6989FF" fill="none">
                            <Path stroke="none" d="M0 0h24v24H0z"/>
                            <Circle cx="8" cy="15" r="4" />
                            <Line x1="10.85" y1="12.15" x2="19" y2="4" />
                            <Line x1="18" y1="5" x2="20" y2="7" />
                            <Line x1="15" y1="8" x2="17" y2="10" />
                          </Svg>
                        </View>
                      </Animated.View>
                    </View>
                  </View>
                </Animated.View>
              }
            </Animated.View>
          </View>
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  account: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#F7F7F7",
    paddingBottom: 15
  },
  content: {
    backgroundColor: "#fff",
    position: "relative",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20
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
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.22,

    elevation: 3,
  }
});
