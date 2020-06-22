import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, AppState } from 'react-native';
import * as Localization from 'expo-localization';

import API from '../api';
import Languages from '../data/languages.json';
import TopBar from '../components/TopBar'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      haptic: API.user.haptic
    }
  }

  componentDidMount(){
    API.hit("Accessibility");
  }

  save(){
    API.haptics("touch");
    let { haptic } = this.state;
    let changedFields = [];
    let changedValues = [];

    if(haptic != API.user.haptic){
      changedFields.push("haptic");
      changedValues.push(haptic);
    }

    API.update(changedFields, changedValues).then(res => {
      this.props.navigation.pop();
      API.haptics("impact");
    })
  }

  didChange(){
    return this.state.haptic != API.user.haptic;
  }

  render() {
    let hap = this.state.haptic;
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonPress={() => this.save()}/>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
          <View style={[styles.head, {alignItems: API.user.isRTL ? "flex-end" : "flex-start"}]}>
            <Text style={API.styles.h1}>{API.t("settings_selection_accessibility")}</Text>
            <Text style={API.styles.pHome}>{API.t("settings_accessibility_description")}</Text>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
            <View style={styles.preferenceItem}>
              <Text style={API.styles.h2}>{API.t("settings_accessibility_sensory")}</Text>
              <Text style={API.styles.subSmall}>{API.t("settings_accessibility_sensory_description")}</Text>

              <TouchableOpacity onPress={() => { API.haptics("touch"); this.setState({haptic: hap === "1" ? "0" : "1"})}} style={styles.listItem}>
                <View style={{width: "80%"}}>
                  <Text style={[API.styles.h3, {marginVertical: 0}]}>{API.t("settings_accessibility_sensory_haptic")}</Text>
                  <Text style={API.styles.p}>{API.t("settings_accessibility_sensory_haptic_description")}</Text>
                </View>
                <View style={[styles.pointerMulti, {backgroundColor: hap == "1" ? "#6989FF": "#eee"}]}></View>
              </TouchableOpacity>

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
  },
  pointerMulti: {
    width: 24, height: 24, borderRadius: 4,
    marginRight: 30
  }
});
