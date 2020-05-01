import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Image as RNImage } from 'react-native';
import Constants from 'expo-constants';
import Svg, { Path } from 'react-native-svg';
import { Image } from 'react-native-elements';
import * as ScreenOrientation from 'expo-screen-orientation';

import API from '../api'

import TopBar from '../components/TopBar'
import Profiles from '../components/Profiles'

export default class App extends React.Component {

  state = {
    userSettings: false
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
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F9FB"}/>
        <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}} stickyHeaderIndices={[1]}>
          <Profiles navigation={this.props.navigation}/>

          <View style={styles.account}>
            {user &&
              <TouchableWithoutFeedback onPress={() => this.openAccountSettings()}>
                <View style={styles.userCarrier}>
                  <View style={styles.userLeft}>
                    <RNImage
                      style={styles.image}
                      source={{uri: user.avatar}}
                      PlaceholderContent={<ActivityIndicator />}/>
                    <View style={styles.userRight}>
                      <Text style={API.styles.h4}>{user.name}</Text>
                      <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 0}]}>{user.email}</Text>
                    </View>
                  </View>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={{margin: 10, marginRight: 0}}>
                    <Path fill={"#395A85"} d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></Path>
                  </Svg>
                </View>
              </TouchableWithoutFeedback>
            }
          </View>
          <View style={styles.content}>
            <View style={styles.userSettings}>
              <TouchableOpacity style={styles.selectionItem} onPress={() => this.props.navigation.push("Language")}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_language")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.selectionItem} onPress={() => this.props.navigation.push("Voice")}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M8 18c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1v10c0 .55.45 1 1 1zm4 4c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1s-1 .45-1 1v18c0 .55.45 1 1 1zm-8-8c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 .55.45 1 1 1zm12 4c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1v10c0 .55.45 1 1 1zm3-7v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_voice")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.selectionItem} onPress={() => this.props.navigation.push("Notification")}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M19.29 17.29L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.9 0 1.34-1.08.71-1.71zM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_notifications")}</Text>
              </TouchableOpacity>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1v-5h16v5c0 .55-.45 1-1 1zm1-10H4V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v1z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_subscriptions")}</Text>
              </View>

              <TouchableOpacity onPress={() => API.signout()}>
                <View style={[styles.selectionItem, {borderBottomWidth: 0}]}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                    <Path fill={"#666"} d="M10.79 16.29c.39.39 1.02.39 1.41 0l3.59-3.59c.39-.39.39-1.02 0-1.41L12.2 7.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L12.67 11H4c-.55 0-1 .45-1 1s.45 1 1 1h8.67l-1.88 1.88c-.39.39-.38 1.03 0 1.41zM19 3H5c-1.11 0-2 .9-2 2v3c0 .55.45 1 1 1s1-.45 1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></Path>
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_signout")}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.appSettings}>
              <View style={styles.selectionCarrier}>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/feedback/"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                      <Path fill={"#666"} d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z"></Path>
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_sendFeedback")}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/licenses/"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                      <Path fill={"#666"} d="M8.7 15.9L4.8 12l3.9-3.9c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.6c.39.39 1.01.39 1.4 0 .39-.39.39-1.01 0-1.4zm6.6 0l3.9-3.9-3.9-3.9c-.39-.39-.39-1.01 0-1.4.39-.39 1.01-.39 1.4 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.6c-.39.39-1.01.39-1.4 0-.39-.39-.39-1.01 0-1.4z"></Path>
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_openSourceLicenses")}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/privacypolicy/"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                      <Path fill={"#666"} d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17z"></Path>
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_privacyPolicy")}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/termsofservice/"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                      <Path fill={"#666"} d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm5.5 2.47c-.28-.14-.58-.21-.89-.21H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.44-.72c-.37-.08-.76.04-1.03.31-.43.44-.43 1.14 0 1.58l4.01 4.01c.38.37.89.58 1.42.58h6.1c1 0 1.84-.73 1.98-1.72l.63-4.47c.12-.85-.32-1.69-1.09-2.07l-4.08-2.03z"></Path>
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_termsOfService")}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.selectionItem, {borderBottomWidth: 0}]} onPress={() => this.props.navigation.push("Remove")}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                    <Path fill={"#666"} d="M16 16h2c.55 0 1 .45 1 1s-.45 1-1 1h-2c-.55 0-1-.45-1-1s.45-1 1-1zm0-8h5c.55 0 1 .45 1 1s-.45 1-1 1h-5c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h4c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM13 5h-2l-.71-.71c-.18-.18-.44-.29-.7-.29H6.41c-.26 0-.52.11-.7.29L5 5H3c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1z"></Path>
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_removeMyData")}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={API.styles.iosBottomPadder}></View>
          </View>
        </ScrollView>
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
    backgroundColor: "#F7F9FB",
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
  },
  cover: {
    width: "110%",
    height: "110%",
    backgroundColor: "rgba(255,255,255,0.3)",
    position: "absolute",
    top: -10,
    left: 0,
    zIndex: 99
  }
});
