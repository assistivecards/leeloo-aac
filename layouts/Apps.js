import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Linking } from 'react-native';
import { Image as CachedImage } from "react-native-expo-image-cache";

import API from '../api';
import TopBar from '../components/TopBar'
import Svg, { Path, Line, Circle, Polyline, Rect } from 'react-native-svg';

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      apps: []
    }
  }

  async componentDidMount(){
    API.hit("Apps");
    let apps = await API.getAllApps();
    this.setState({apps});
  }

  async downloadApp(storeId){
    if(Platform.OS == "ios"){
      let url = `itms-apps://itunes.apple.com/us/app/apple-store/${storeId.appStore}?mt=8`;
      const supported = await Linking.canOpenURL(url);
      if(supported){
        Linking.openURL(url)
      }
    }else{
      let url = `market://details?id=${storeId.googlePlay}`;
      const supported = await Linking.canOpenURL(url);
      if(supported){
        Linking.openURL(url)
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={API.config.backgroundColor}/>
        <ScrollView style={{flex: 1, backgroundColor: API.config.backgroundColor}} contentContainerStyle={{flex: 1}}>
          <View style={[styles.head, {alignItems: API.isRTL() ? "flex-end" : "flex-start"}]}>
            <Text style={API.styles.h1}>{API.t("settings_selection_apps")}</Text>
            <Text style={API.styles.pHome}>{API.t("settings_apps_description")}</Text>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 30, backgroundColor: "#fff", flexDirection: "column", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
            {!(this.state.apps.length) &&
              <View style={{height: 300, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size={"large"}/>
              </View>
            }
            {this.state.apps.map(app => {
              return (
                <TouchableOpacity onPress={() => this.downloadApp(app.storeId)} key={app.slug} style={{paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#eee"}}>
                  <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Image source={{uri: API.assetEndpoint + "apps/icon/"+app.slug+".png"}} style={{width: 60, height: 60, marginBottom: 10, marginRight: 10, borderRadius: 30}}/>
                      <View>
                        <Text style={[API.styles.h2, {marginHorizontal: 0, marginTop: 0, marginBottom: 5}]}>{app.name}</Text>
                        <Text style={[API.styles.sub, {marginHorizontal: 0, marginTop: 0}]}>{app.tagline}</Text>
                      </View>
                    </View>
                    <View style={[API.styles.button, {width: 50, height: 30}]}>
                      <Svg height={24} width={24} viewBox="0 0 24 24" strokeWidth="2" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M0 0h24v24H0z" stroke="none"/>
                        <Path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/>
                        <Polyline points="7 11 12 16 17 11"/>
                        <Line x1="12" x2="12" y1="4" y2="16"/>
                      </Svg>
                    </View>
                  </View>
                  <View>
                    <Text style={[API.styles.p, {marginHorizontal: 0}]}>{app.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: API.config.backgroundColor,
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5
  }
});
