import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as Localization from 'expo-localization';
import * as Speech from 'expo-speech';

import API from '../api';
import Languages from '../data/languages.json';
import TopBar from '../components/TopBar'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    API.hit("RemoveData");
  }

  render() {
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"}/>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
          <View style={[styles.head, {alignItems: API.user.isRTL ? "flex-end" : "flex-start"}]}>
            <Text style={API.styles.h1}>{API.t("settings_selection_removeMyData")}</Text>
            <Text style={API.styles.pHome}>{API.t("settings_removeMyData_description")}</Text>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
            <Text style={API.styles.p}>{API.t("settings_removeMyData_p1")}</Text>
            <Text style={API.styles.p}>{API.t("settings_removeMyData_p2")}</Text>
            <Text style={API.styles.p}>{API.t("settings_removeMyData_p3")}</Text>
            <Text style={API.styles.p}>{API.t("settings_removeMyData_p4")}</Text>
            <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/removemydata/"})}><Text style={[API.styles.h3, {color: "red"}]}>{API.t("settings_removeMyData_button")}</Text></TouchableOpacity>
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
  preferenceItem: {
    marginBottom: 10
  },
  listItem: {
    borderBottomWidth: 1, borderColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  pointer: {
    width: 24, height: 24, borderRadius: 12,
    marginRight: 30
  }
});
