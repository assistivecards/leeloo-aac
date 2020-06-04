import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import { Image as CachedImage } from "react-native-expo-image-cache";

import API from '../api';
import TopBar from '../components/TopBar'
import Svg, { Path } from 'react-native-svg';

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.avatar = this.props.navigation.getParam("avatar");
  }

  async componentDidMount(){
    API.hit("Avatar");
  }

  changeAvatar(avatar){
    this.avatar(avatar);
    this.props.navigation.pop();
  }


  render() {
    return (
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"}/>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
          <View style={[styles.head, {alignItems: API.user.isRTL ? "flex-end" : "flex-start"}]}>
            <Text style={API.styles.h1}>{API.t("settings_change_avatar_title")}</Text>
            <Text style={API.styles.pHome}>{API.t("settings_change_avatar_description")}</Text>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 30, backgroundColor: "#fff", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
           {Array.apply(null, Array(33)).map((boy, i) => {
             return (
               <TouchableOpacity style={styles.childAvatar} key={"boy"+(i+1)} onPress={() => this.changeAvatar(`boy${(i+1) < 10 ? "0"+(i+1) : (i+1)}`)}>
                 <Image source={{uri: `${API.assetEndpoint}cards/avatar/boy${(i+1) < 10 ? "0"+(i+1) : (i+1)}.png?v=${API.version}`}} resizeMode="contain" style={styles.childImage} />
               </TouchableOpacity>
             )
           })}
           {Array.apply(null, Array(27)).map((girl, i) => {
             return (
               <TouchableOpacity style={styles.childAvatar} key={"girl"+(i+1)} onPress={() => this.changeAvatar(`girl${(i+1) < 10 ? "0"+(i+1) : (i+1)}`)}>
                 <Image source={{uri: `${API.assetEndpoint}cards/avatar/girl${(i+1) < 10 ? "0"+(i+1) : (i+1)}.png?v=${API.version}`}} resizeMode="contain" style={styles.childImage} />
               </TouchableOpacity>
             )
           })}
           {Array.apply(null, Array(29)).map((misc, i) => {
             return (
               <TouchableOpacity style={styles.childAvatar} key={"misc"+(i+1)} onPress={() => this.changeAvatar(`misc${(i+1) < 10 ? "0"+(i+1) : (i+1)}`)}>
                 <Image source={{uri: `${API.assetEndpoint}cards/avatar/misc${(i+1) < 10 ? "0"+(i+1) : (i+1)}.png?v=${API.version}`}} resizeMode="contain" style={styles.childImage} />
               </TouchableOpacity>
             )
           })}
           <View style={[styles.childAvatar, {backgroundColor: "#fff", borderColor: "#fff"}]}>
           </View>
          </View>
          <View style={{backgroundColor: "#fff"}}>
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
  childAvatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
    padding: 4, backgroundColor: "#FAFAFA",
    marginLeft: 0,
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#FAFAFA",
  },
  childImage: {
    width: 64,
    height: 64,
    margin: 3
  },
});
