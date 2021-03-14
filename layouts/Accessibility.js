import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, AppState } from 'react-native';
import * as Localization from 'expo-localization';

import API from '../api';
import Languages from '../languages.json';
import TopBar from '../components/TopBar'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      haptic: API.user.haptic,
      pressIn: API.user.pressIn
    }
  }

  componentDidMount(){
    API.hit("Accessibility");
  }

  save(){
    API.haptics("touch");
    let { haptic, pressIn } = this.state;
    let changedFields = [];
    let changedValues = [];

    if(haptic != API.user.haptic){
      changedFields.push("haptic");
      changedValues.push(haptic);
    }

    if(pressIn != API.user.pressIn){
      changedFields.push("pressIn");
      changedValues.push(pressIn);
    }

    API.update(changedFields, changedValues).then(res => {
      this.props.navigation.pop();
      API.haptics("impact");
    })
  }

  didChange(){
    return this.state.haptic != API.user.haptic || this.state.pressIn != API.user.pressIn;
  }

  render() {
    let hap = this.state.haptic;
    let pin = this.state.pressIn;
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={API.config.backgroundColor} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonPress={() => this.save()}/>
        <ScrollView style={{flex: 1, backgroundColor: API.config.backgroundColor}}>
          <View style={[styles.head, {alignItems: API.isRTL() ? "flex-end" : "flex-start"}]}>
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
                <View style={[styles.pointerMulti, {backgroundColor: hap == "1" ? API.config.backgroundColor: "#eee"}]}></View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { API.haptics("touch"); this.setState({pressIn: pin === "1" ? "0" : "1"})}} style={styles.listItem}>
                <View style={{width: "80%"}}>
                  <Text style={[API.styles.h3, {marginVertical: 0}]}>{API.t("settings_accessibility_sensory_pressIn")}</Text>
                  <Text style={API.styles.p}>{API.t("settings_accessibility_sensory_pressIn_description")}</Text>
                </View>
                <View style={[styles.pointerMulti, {backgroundColor: pin == "1" ? API.config.backgroundColor: "#eee"}]}></View>
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
    backgroundColor: API.config.backgroundColor,
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
