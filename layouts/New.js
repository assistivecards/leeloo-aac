import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import API from '../api';
import TopBar from '../components/TopBar'
import { Image as CachedImage } from "react-native-expo-image-cache";

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: "",
      avatar: "default"
    }
  }

  componentDidMount(){
    API.hit("NewProfile");
  }

  save(){
    let { name } = this.state;

    let profile = {
      name,
      avatar: this.state.avatar
    }

    API.newProfile(profile).then(res => {
      this.props.navigation.pop();
    })
  }

  didChange(){
    return this.state.name != "" && this.state.avatar != "default";
  }

  async changeAvatar(avatar){
    console.log(avatar);
    this.setState({avatar})
  }

  render() {
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonPress={() => this.save()}/>
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
            <View style={[styles.head, {alignItems: API.user.isRTL ? "flex-end" : "flex-start"}]}>
              <Text style={API.styles.h1}>{API.t("settings_selection_new_profile")}</Text>
              <Text style={API.styles.pHome}>{API.t("settings_new_profile_description")}</Text>
            </View>
            <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>{API.t("settings_new_profile_profileName_title")}</Text>
                <Text style={API.styles.subSmall}>{API.t("settings_new_profile_profileName_description")}</Text>
                <TextInput style={API.styles.input} defaultValue={""} onChangeText={(text) => this.setState({name: text})}/>
              </View>

              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>{API.t("settings_new_profile_profileAvatar_title")}</Text>
                <Text style={API.styles.subSmall}>{API.t("settings_new_profile_profileAvatar_description")}</Text>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <TouchableOpacity style={styles.childAvatar} onPress={() => this.props.navigation.push("Avatar", {avatar: this.changeAvatar.bind(this)})}>
                    <CachedImage uri={`${API.assetEndpoint}cards/avatar/${this.state.avatar}.png?v=${API.version}`} resizeMode="contain" style={styles.childImage} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>{API.t("settings_new_profile_aacCards_title")}</Text>
                <Text style={API.styles.subSmall}>{API.t("settings_new_profile_aacCards_description")}</Text>
              </View>
              <View style={API.styles.iosBottomPadder}></View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  preferenceItem: {
    marginBottom: 10
  },
  childAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F5F5F7",
    borderWidth: 9,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  },
  childImage: {
    width: 60,
    height: 60,
    position: "relative",
    margin: 6
  },
});
