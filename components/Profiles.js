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

  render(){
    return (
      <View style={styles.profileCarrier}>
        {
          API.user.profiles.map(profile => {
            return (
              <TouchableOpacity style={styles.profileItem} key={profile.id} onPress={() => this.editProfile(profile)}>
                <View style={styles.child}>
                  <CachedImage uri={profile.avatar} style={styles.childImage} />
                </View>
                <View>
                  <Text style={API.styles.h4}>{profile.name}</Text>
                  <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 0}]}>{JSON.parse(profile.packs).length} packs</Text>
                </View>
                <View style={{flex: 1, justifyContent: "flex-end", alignItems: "flex-end", flexDirection: "row", alignItems: "center"}}>
                  {API.user.active_profile.id == profile.id &&
                    <View style={styles.active}><Text style={{fontWeight: "600", fontSize: 12, color: "#fff"}}>Active</Text></View>
                  }
                  <Svg height={36} width={36} viewBox="0 0 24 24">
                    <Path fill={"#395A85"} d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z"></Path>
                  </Svg>
                </View>
              </TouchableOpacity>
            )
          })
        }
        <View style={styles.profileItem}>
          <TouchableOpacity style={styles.addNew}>
            <Svg height={30} width={30} viewBox="0 0 24 24" style={{margin: 10, marginRight: 5, opacity: 0.5}}>
              <Path fill={"#395A85"} d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"></Path>
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
    width: 55,
    height: 55,
    borderRadius: 8,
    padding: 5, backgroundColor: "#fff",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  addNew: {
    height: 50,
    flex: 1,
    borderRadius: 8,
    padding: 5,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5
  },
  childImage: {
    width: 43,
    height: 43,
    position: "relative",
    top: 5
  },
  profileItem: {
    flexDirection: "row",
    paddingBottom: 10,
    alignItems: "center"
  },
  active: {
    backgroundColor: "#4e88c5",
    height: 24,
    width: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  }
});
