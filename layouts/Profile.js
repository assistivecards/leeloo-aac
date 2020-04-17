import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, TouchableWithoutFeedback, TouchableOpacity, LayoutAnimation } from 'react-native';
import Constants from 'expo-constants';
import Svg, { Path } from 'react-native-svg';
import { Image } from 'react-native-elements';

import API from '../api'

import TopBar from '../components/TopBar'

var CustomLayoutLinear = {
  duration: 150,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  }
};

export default class App extends React.Component {

  state = {
    userSettings: false
  }

  openAccountSettings(){
    this.props.navigation.push("Settings");
  }

  render() {
    let user = true;

    let width = Dimensions.get("window").width;

    return (
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F9FB"}/>
        <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}} stickyHeaderIndices={[0]}>
          <View style={styles.head}>
            {user &&
              <TouchableWithoutFeedback onPress={() => this.openAccountSettings()}>
                <View style={styles.userCarrier}>
                  <View style={styles.userLeft}>
                    <Image
                      style={styles.image}
                      source={{uri: user.avatar}}
                      PlaceholderContent={<ActivityIndicator />}/>
                    <View style={styles.userRight}>
                      <Text style={API.styles.h4}>Sarah Marian</Text>
                      <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 0}]}>sarahmarian@gmail.com</Text>
                    </View>
                  </View>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={{margin: 10, marginRight: 0}}>
                    <Path fill={"#395A85"} d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></Path>
                  </Svg>
                </View>
              </TouchableWithoutFeedback>
            }
            <View style={styles.accountSettings}>
              <View style={styles.selectionCarrier}>

                <View style={styles.selectionItem}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                    <Path fill={"#666"} d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1v-5h16v5c0 .55-.45 1-1 1zm1-10H4V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v1z"></Path>
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>Payment & Subscriptions</Text>
                </View>

                <TouchableOpacity onPress={() => API.logout()}>
                  <View style={[styles.selectionItem, {borderBottomWidth: 0}]}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                      <Path fill={"#666"} d="M10.79 16.29c.39.39 1.02.39 1.41 0l3.59-3.59c.39-.39.39-1.02 0-1.41L12.2 7.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L12.67 11H4c-.55 0-1 .45-1 1s.45 1 1 1h8.67l-1.88 1.88c-.39.39-.38 1.03 0 1.41zM19 3H5c-1.11 0-2 .9-2 2v3c0 .55.45 1 1 1s1-.45 1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></Path>
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>Sign Out</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.userSettings}>
              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M17.73 12.02l3.98-3.98c.39-.39.39-1.02 0-1.41l-4.34-4.34c-.39-.39-1.02-.39-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63c-.39.39-.39 1.02 0 1.41l3.98 3.98L2.25 16c-.39.39-.39 1.02 0 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.2.2.45.29.71.29.26 0 .51-.1.71-.29l4.34-4.34c.39-.39.39-1.02 0-1.41l-3.99-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2.66 9.34l-3.63-3.62 3.63-3.63 3.62 3.62-3.62 3.63z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>Medical Data</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M18 4v1h-2V4c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H6V4c0-.55-.45-1-1-1s-1 .45-1 1v16c0 .55.45 1 1 1s1-.45 1-1v-1h2v1c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1h2v1c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1s-1 .45-1 1zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>Video Preferences</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M20 12c0-2.54-1.19-4.81-3.04-6.27l-.68-4.06C16.12.71 15.28 0 14.31 0H9.7c-.98 0-1.82.71-1.98 1.67l-.67 4.06C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27l.67 4.06c.16.96 1 1.67 1.98 1.67h4.61c.98 0 1.81-.71 1.97-1.67l.68-4.06C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>Devices & Watch</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M19.29 17.29L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.9 0 1.34-1.08.71-1.71zM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>Notification & Alerts</Text>
              </View>

              <View style={[styles.selectionItem, {borderBottomWidth: 0}]}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M3 18c0 .55.45 1 1 1h5v-2H4c-.55 0-1 .45-1 1zM3 6c0 .55.45 1 1 1h9V5H4c-.55 0-1 .45-1 1zm10 14v-1h7c.55 0 1-.45 1-1s-.45-1-1-1h-7v-1c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1zM7 10v1H4c-.55 0-1 .45-1 1s.45 1 1 1h3v1c0 .55.45 1 1 1s1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1zm14 2c0-.55-.45-1-1-1h-9v2h9c.55 0 1-.45 1-1zm-5-3c.55 0 1-.45 1-1V7h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V4c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>Customize</Text>
              </View>
            </View>


            <View style={styles.appSettings}>
              <View style={styles.selectionCarrier}>

                <View style={styles.selectionItem}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                    <Path fill={"#666"} d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></Path>
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>Change Language</Text>
                </View>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://workoapp.com/pages/feedback.html"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                      <Path fill={"#666"} d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z"></Path>
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>Send Feedback</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://workoapp.com/pages/licensing.html"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                      <Path fill={"#666"} d="M8.7 15.9L4.8 12l3.9-3.9c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.6c.39.39 1.01.39 1.4 0 .39-.39.39-1.01 0-1.4zm6.6 0l3.9-3.9-3.9-3.9c-.39-.39-.39-1.01 0-1.4.39-.39 1.01-.39 1.4 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.6c-.39.39-1.01.39-1.4 0-.39-.39-.39-1.01 0-1.4z"></Path>
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>Open Source Licenses</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://workoapp.com/pages/privacy-policy.html"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                      <Path fill={"#666"} d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17z"></Path>
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>Privacy Policy</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://workoapp.com/pages/terms-of-service.html"})}>
                  <View style={styles.selectionItem}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                      <Path fill={"#666"} d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm5.5 2.47c-.28-.14-.58-.21-.89-.21H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.44-.72c-.37-.08-.76.04-1.03.31-.43.44-.43 1.14 0 1.58l4.01 4.01c.38.37.89.58 1.42.58h6.1c1 0 1.84-.73 1.98-1.72l.63-4.47c.12-.85-.32-1.69-1.09-2.07l-4.08-2.03z"></Path>
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15}]}>Terms of Service</Text>
                  </View>
                </TouchableOpacity>

                <View style={[styles.selectionItem, {borderBottomWidth: 0}]}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                    <Path fill={"#666"} d="M16 16h2c.55 0 1 .45 1 1s-.45 1-1 1h-2c-.55 0-1-.45-1-1s.45-1 1-1zm0-8h5c.55 0 1 .45 1 1s-.45 1-1 1h-5c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h4c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM13 5h-2l-.71-.71c-.18-.18-.44-.29-.7-.29H6.41c-.26 0-.52.11-.7.29L5 5H3c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1z"></Path>
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>Remove My Data</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://workoapp.com/pages/privacy-policy.html"})}>
              <View style={styles.privacy}>
                <Svg height={30} width={30} viewBox="0 0 46 46" style={{margin: 10}}>
                  <Path fill={"#fff"} d="M34.199,3.83c-3.944,0-7.428,1.98-9.51,4.997c0,0-0.703,1.052-1.818,1.052c-1.114,0-1.817-1.052-1.817-1.052
                		c-2.083-3.017-5.565-4.997-9.51-4.997C5.168,3.83,0,8.998,0,15.376c0,1.506,0.296,2.939,0.82,4.258
                		c3.234,10.042,17.698,21.848,22.051,22.279c4.354-0.431,18.816-12.237,22.052-22.279c0.524-1.318,0.82-2.752,0.82-4.258
                		C45.743,8.998,40.575,3.83,34.199,3.83z"></Path>
                </Svg>
                <View style={{width: Dimensions.get("window").width - 100}}>
                  <Text style={[API.styles.b, {color: "#fff", paddingHorizontal: 10}]}>Your every activity on worko is safely encrypted and will never be shared with third party entities.</Text>
                  <Text style={[API.styles.b, {color: "#fff", paddingHorizontal: 10, opacity: 0.7, marginTop: 5}]}>Touch to learn more</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#F7F9FB",
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5,
    paddingHorizontal: 30
  },
  content: {
    backgroundColor: "#fff",
    position: "relative",
    padding: 10
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
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#43B1D9",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.54,
    elevation: 3
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
    marginHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: API.config.theme.mainBorderColor
  },
  appSettings: {
    marginHorizontal: 20,
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
