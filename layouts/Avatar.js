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
    let data = await this.getDraggableData(this.packs);
    this.setState({data});
    API.hit("Avatar");
  }

  async getDraggableData(packs){
    let allPacks = await API.getPacks();

    return allPacks;
  }

  async changeAvatar(avatar){
    await this.avatar(avatar);
    this.props.navigation.pop();
  }


  render() {
    return (
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F9FB"}/>
        <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}}>
          <View style={styles.head}>
            <Text style={API.styles.h1}>Change Avatar</Text>
            <Text style={API.styles.p}>Choose an avatar to symbolize this profile.</Text>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 30, backgroundColor: "#fff", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between"}}>
           {Array.apply(null, Array(17)).map((boy, i) => {
             return (
               <TouchableOpacity style={styles.childAvatar} key={"boy"+(i+1)} onPress={() => this.changeAvatar(`boy${(i+1) < 10 ? "0"+(i+1) : (i+1)}`)}>
                 <CachedImage uri={`https://leeloo.dreamoriented.org/cdn/avatar/boy${(i+1) < 10 ? "0"+(i+1) : (i+1)}.png`} resizeMode="contain" style={styles.childImage} />
               </TouchableOpacity>
             )
           })}
           {Array.apply(null, Array(25)).map((girl, i) => {
             return (
               <TouchableOpacity style={styles.childAvatar} key={"girl"+(i+1)} onPress={() => this.changeAvatar(`girl${(i+1) < 10 ? "0"+(i+1) : (i+1)}`)}>
                 <Image source={{uri: `https://leeloo.dreamoriented.org/cdn/avatar/girl${(i+1) < 10 ? "0"+(i+1) : (i+1)}.png`}} resizeMode="contain" style={styles.childImage} />
               </TouchableOpacity>
             )
           })}
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
    backgroundColor: "#F7F9FB",
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5
  },
  childAvatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
    padding: 5, backgroundColor: "#fff",
    marginLeft: 0,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  childImage: {
    width: 70,
    height: 70,
    position: "relative",
    top: 3
  },
});
