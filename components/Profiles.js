import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, Image as RNImage  } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import API from '../api'
import TouchableScale from '../components/touchable-scale'
import { Image as CachedImage } from "react-native-expo-image-cache";

export default class App extends React.Component {

  swapProfile(profileId){
    API.setCurrentProfile(profileId).then(res => {
      console.log("now active profile id", profileId);
      this.props.navigation.pop();
    })
  }

  editProfile(profile){
    this.props.navigation.push("Profile", {profile});
  }

  addProfile(){
    this.props.navigation.push("New");
  }

  render(){
    return (
      <View style={styles.profileCarrier}>
        {
          API.user.profiles.map(profile => {
            return (
              <TouchableOpacity style={[styles.profileItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]} key={profile.id} onPress={() => this.editProfile(profile)}>
                <View style={styles.child}>
                  <CachedImage uri={`https://leeloo.dreamoriented.org/cdn/avatar/${profile.avatar}.png?v=${API.version}`} resizeMode="contain" style={styles.childImage} />
                </View>
                {API.user.active_profile.id == profile.id &&
                  <View style={styles.active}><Text style={{fontWeight: "600", fontSize: 10, color: "#6989FF"}}>{API.t("settings_profile_active")}</Text></View>
                }
                <View style={{alignItems: API.user.isRTL ? "flex-end" : "flex-start"}}>
                  <Text style={{fontSize: 22, color: "#fff", fontWeight: "bold"}}>{profile.name}</Text>
                  <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 0, color: "#fff", fontWeight: "normal"}]}>{API.t("settings_packs", profile.packs.length)}</Text>
                </View>
                <View style={{flex: 1, justifyContent: API.user.isRTL ? "flex-start" : "flex-end", alignItems: API.user.isRTL ? "flex-start" : "flex-end", flexDirection: "row", alignItems: "center"}}>
                  <Svg height={32} width={32} viewBox="0 0 24 24">
                    <Path fill={"#fff"} d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z"></Path>
                  </Svg>
                </View>
              </TouchableOpacity>
            )
          })
        }
        <View style={styles.profileItem}>
          <TouchableOpacity style={styles.addNew} onPress={() => this.addProfile()}>
            <Svg height={30} width={30} viewBox="0 0 24 24" style={{margin: 10, marginRight: 5}}>
              <Path fill={"#fff"} d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"></Path>
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profileCarrier: {
    flexDirection: "column",
    padding: 10,
    paddingHorizontal: 28,
    paddingBottom: 10
  },
  child: {
    width: 70,
    height: 70,
    borderRadius: 37,
    backgroundColor: "#F5F5F7",
    marginHorizontal: 15,
    borderWidth: 7,
    borderColor: "#ffffff",
    overflow: "hidden"
  },
  childImage: {
    width: 46,
    height: 46,
    position: "relative",
    top: 5,
    margin: 6
  },
  addNew: {
    height: 50,
    flex: 1,
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(247,249,255,0.5)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5
  },
  profileItem: {
    flexDirection: "row",
    paddingBottom: 10,
    marginBottom: 5,
    alignItems: "center"
  },
  active: {
    backgroundColor: "#fff",
    height: 16,
    width: 55,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 5,
    marginHorizontal: 22,
  }
});
