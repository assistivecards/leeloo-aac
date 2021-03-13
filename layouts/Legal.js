import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, AppState, Linking, Share } from 'react-native';
import Svg, { Path, Line, Circle, Polyline, Rect } from 'react-native-svg';

import API from '../api';
import TopBar from '../components/TopBar'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  componentDidMount(){
    API.hit("Legal");
  }



  async rateThisApp(){
    if(Platform.OS == "ios"){
      let url = 'itms-apps://itunes.apple.com/us/app/apple-store/1508952198?mt=8';
      const supported = await Linking.canOpenURL(url);
      if(supported){
        Linking.openURL(url)
      }
    }else{
      let url = 'market://details?id=4973589507294195479';
      const supported = await Linking.canOpenURL(url);
      if(supported){
        Linking.openURL(url)
      }
    }
  }

  shareApp(){
    Share.share({
      title: API.t("settings_share_title"),
      message: API.t("settings_share_message"),
      url: API.t("settings_share_url")
    })
  }


  render() {
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"}/>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
          <View style={[styles.head, {alignItems: API.isRTL() ? "flex-end" : "flex-start"}]}>
            <Text style={API.styles.h1}>{API.t("settings_selection_aboutapp")}</Text>
            <Text style={API.styles.pHome}>{API.t("settings_aboutapp_description")}</Text>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
            <View style={styles.selectionCarrier}>

              <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/"})}>
                <View style={[styles.selectionItem, {flexDirection: API.isRTL() ? "row-reverse" : "row"}]}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M0 0h24v24H0z" stroke="none"/>
                    <Circle cx="12" cy="12" r="9"/>
                    <Line x1="12" x2="12.01" y1="8" y2="8"/>
                    <Polyline points="11 12 12 12 12 16 13 16"/>
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_company")}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.shareApp()}>
                <View style={[styles.selectionItem, {flexDirection: API.isRTL() ? "row-reverse" : "row"}]}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M0 0h24v24H0z" stroke="none"/>
                  	<Circle cx="6" cy="12" r="3"/>
                  	<Circle cx="18" cy="6" r="3"/>
                  	<Circle cx="18" cy="18" r="3"/>
                  	<Line x1="8.7" x2="15.3" y1="10.7" y2="7.3"/>
                  	<Line x1="8.7" x2="15.3" y1="13.3" y2="16.7"/>
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_share_the_app")}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.rateThisApp()}>
                <View style={[styles.selectionItem, {flexDirection: API.isRTL() ? "row-reverse" : "row"}]}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M0 0h24v24H0z" stroke="none"/>
                  	<Path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z"/>
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_rate_the_app")}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/licenses/"})}>
                <View style={[styles.selectionItem, {flexDirection: API.isRTL() ? "row-reverse" : "row"}]}>
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
                <View style={[styles.selectionItem, {flexDirection: API.isRTL() ? "row-reverse" : "row"}]}>
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
                <View style={[styles.selectionItem, {flexDirection: API.isRTL() ? "row-reverse" : "row"}]}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <Path stroke="none" d="M0 0h24v24H0z"/>
                    <Path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
                    <Line x1="9" y1="7" x2="13" y2="7" />
                    <Line x1="9" y1="11" x2="13" y2="11" />
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15}]}>{API.t("settings_selection_termsOfService")}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.appData}>
              <View style={{marginBottom:7}}><Text>Build Number: {API.version}</Text></View>
              <View style={{marginBottom:7}}><Text>Version: {String(API.version).split("").join(".")}</Text></View>
              <View style={{marginBottom:7}}><Text>Asset CDN: {API.assetEndpoint}</Text></View>
              <View style={{marginBottom:7}}><Text>CDN Status: Active</Text></View>
              <View style={{marginBottom:7}}><Text>Private API Status: Active</Text></View>
              <View style={{marginBottom:7}}><Text></Text></View>
              <View style={{marginBottom:7}}><Text>2020 &copy; Dream Oriented Limited</Text></View>
            </View>
            <View style={API.styles.iosBottomPadder}></View>
          </View>
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#6989FF",
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5
  },

  selectionCarrier: {
    marginTop: 10,
    marginHorizontal: 30,
    borderBottomWidth: 1,
    paddingBottom: 25,
    borderBottomColor: "#eee"
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
  appData: {
    textAlign: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: 30,
    opacity: 0.6
  }
});
