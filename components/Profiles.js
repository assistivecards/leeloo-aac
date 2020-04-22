import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, Image as RNImage  } from 'react-native';

import API from '../api'
import TouchableScale from '../components/touchable-scale'
import { Image as CachedImage } from "react-native-expo-image-cache";

export default class App extends React.Component {

  swapProfile(profileId){
    API.setCurrentProfile(profileId).then(res => {
      console.log("now active profile id", profileId);
      this.props.pop();
    })
  }

  render(){
    return (
      <View style={styles.profileCarrier}>
        {
          API.user.profiles.map(profile => {
            return (
              <TouchableScale style={styles.profileItem} key={profile.id} onPress={() => this.swapProfile(profile.id)} disabled={profile.id == API.user.active_profile.id}>
                <CachedImage uri={profile.avatar} style={[styles.child, {backgroundColor: API.user.active_profile.id == profile.id ? "#a6d4ea" : "#eee"}]} />
                <Text style={{color: "#555", marginTop: 5}}>{profile.name}</Text>
              </TouchableScale>
            )
          })
        }
        <View style={styles.child}>
          <Text style={{fontSize: 40, color: "#aaa", textAlign: "center", lineHeight: 41}}>+</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  child: {
    width: 60,
    height: 60,
    marginHorizontal: 5, borderRadius: 10,
    padding: 10, backgroundColor: "#eee"
  },
  profileCarrier: {
    flexDirection: "row",
    padding: 15,
    paddingHorizontal: 30
  },
  profileItem: {
    alignItems: "center",
    justifyContent: "center"
  }
});
