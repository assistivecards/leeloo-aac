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
      notificationSettings: API.user.notificationSettings,
      notificationToken: API.user.notificationToken,
    }
  }

  componentDidMount(){
    API.hit("Notification");
  }

  save(){
    API.haptics("touch");
    let { notificationSettings } = this.state;
    let changedFields = [];
    let changedValues = [];

    if(notificationSettings != API.user.notificationSettings){
      changedFields.push("notificationSettings");
      changedValues.push(notificationSettings);
    }

    API.update(changedFields, changedValues).then(res => {
      this.props.navigation.pop();
      API.haptics("impact");
    })
  }

  didChange(){
    return this.state.notificationSettings != API.user.notificationSettings;
  }

  async componentDidMount(){
    let token = await API.registerForPushNotificationsAsync();
    this.setState({notificationToken: token});
    if(token == "ungranted"){
      AppState.addEventListener("change", this._handleAppStateChange);
    }
  }

  _handleAppStateChange = nextAppState => {
    API.registerForPushNotificationsAsync().then(token => {
      this.setState({notificationToken: token});
    });
  }

  componentWillUnmount(){
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  render() {
    let ns = this.state.notificationSettings.split("");
    let nsBinded = this.state.notificationSettings;
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonPress={() => this.save()}/>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
          <View style={[styles.head, {alignItems: API.isRTL() ? "flex-end" : "flex-start"}]}>
            <Text style={API.styles.h1}>{API.t("settings_selection_notifications")}</Text>
            <Text style={API.styles.pHome}>{API.t("settings_notifications_description")}</Text>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
            {false &&
              <Text>You need to enable notification from your device settings for this app.</Text>
            }
            <View style={styles.preferenceItem}>
              <Text style={API.styles.h2}>{API.t("settings_notifications_reminders")}</Text>
              <Text style={API.styles.subSmall}>{API.t("settings_notifications_reminders_description")}</Text>

              <TouchableOpacity onPress={() => { API.haptics("touch"); ns[0] = "d"; this.setState({notificationSettings: ns.join("")})}} style={styles.listItem}>
                <View style={{width: "80%"}}>
                  <Text style={[API.styles.h3, {marginVertical: 0}]}>{API.t("settings_notifications_reminders_daily")}</Text>
                  <Text style={API.styles.p}>{API.t("settings_notifications_reminders_daily_description")}</Text>
                </View>
                <View style={[styles.pointer, {backgroundColor: this.state.notificationSettings[0] == "d" ? "#6989FF": "#eee"}]}></View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { API.haptics("touch"); ns[0] = "w"; this.setState({notificationSettings: ns.join("")})}} style={styles.listItem}>
                <View style={{width: "80%"}}>
                  <Text style={[API.styles.h3, {marginVertical: 0}]}>{API.t("settings_notifications_reminders_weekly")}</Text>
                  <Text style={API.styles.p}>{API.t("settings_notifications_reminders_weekly_description")}</Text>
                </View>
                <View style={[styles.pointer, {backgroundColor: this.state.notificationSettings[0] == "w" ? "#6989FF": "#eee"}]}></View>
              </TouchableOpacity>

            </View>
            <View style={styles.preferenceItem}>
              <Text style={API.styles.h2}>{API.t("settings_notifications_tipsAndPromo")}</Text>
              <Text style={API.styles.subSmall}>{API.t("settings_notifications_tipsAndPromo_description")}</Text>

              <TouchableOpacity onPress={() => { API.haptics("touch"); ns[1] = ns[1] === "1" ? "0" : "1"; this.setState({notificationSettings: ns.join("")})}} style={styles.listItem}>
                <View style={{width: "80%"}}>
                  <Text style={[API.styles.h3, {marginVertical: 0}]}>{API.t("settings_notifications_tipsAndPromo_tips")}</Text>
                  <Text style={API.styles.p}>{API.t("settings_notifications_tipsAndPromo_tips_description")}</Text>
                </View>
                <View style={[styles.pointerMulti, {backgroundColor: this.state.notificationSettings[1] == "1" ? "#6989FF": "#eee"}]}></View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { API.haptics("touch"); ns[2] = ns[2] === "1" ? "0" : "1"; this.setState({notificationSettings: ns.join("")})}} style={styles.listItem}>
                <View style={{width: "80%"}}>
                  <Text style={[API.styles.h3, {marginVertical: 0}]}>{API.t("settings_notifications_tipsAndPromo_promotion")}</Text>
                  <Text style={API.styles.p}>{API.t("settings_notifications_tipsAndPromo_promotion_description")}</Text>
                </View>
                <View style={[styles.pointerMulti, {backgroundColor: this.state.notificationSettings[2] == "1" ? "#6989FF": "#eee"}]}></View>
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
