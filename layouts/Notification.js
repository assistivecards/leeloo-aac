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
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F9FB"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonText={"Apply"} rightButtonPress={() => this.save()}/>
        <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}}>
          <View style={styles.head}>
            <Text style={API.styles.h1}>Notifications</Text>
            <Text style={API.styles.p}>Choose when and why you would like to be notified by the app</Text>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff"}}>
            {this.state.notificationToken == "ungranted" &&
              <Text>You need to enable notification from your device settings for this app.</Text>
            }
            <View style={styles.preferenceItem}>
              <Text style={API.styles.h3}>Reminders</Text>
              <Text style={API.styles.subSmall}>We will remind you to use and practice the app</Text>

              <TouchableOpacity onPress={() => { API.haptics("touch"); ns[0] = "d"; this.setState({notificationSettings: ns.join("")})}} style={styles.listItem}>
                <View style={{width: "80%"}}>
                  <Text style={[API.styles.h3, {marginVertical: 0}]}>Daily Reminders</Text>
                  <Text style={API.styles.p}>We will send you reminder to practice daily</Text>
                </View>
                <View style={[styles.pointer, {backgroundColor: this.state.notificationSettings[0] == "d" ? "#4e88c5": "#eee"}]}></View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { API.haptics("touch"); ns[0] = "w"; this.setState({notificationSettings: ns.join("")})}} style={styles.listItem}>
                <View style={{width: "80%"}}>
                  <Text style={[API.styles.h3, {marginVertical: 0}]}>Weekly Reminders</Text>
                  <Text style={API.styles.p}>We will send you reminder to practice weekly</Text>
                </View>
                <View style={[styles.pointer, {backgroundColor: this.state.notificationSettings[0] == "w" ? "#4e88c5": "#eee"}]}></View>
              </TouchableOpacity>

            </View>
            <View style={styles.preferenceItem}>
              <Text style={API.styles.h3}>Tips & Promotions</Text>
              <Text style={API.styles.subSmall}>Decide if you like us to send you tips for using the app or new promotions</Text>

              <TouchableOpacity onPress={() => { API.haptics("touch"); ns[1] = ns[1] === "1" ? "0" : "1"; this.setState({notificationSettings: ns.join("")})}} style={styles.listItem}>
                <View style={{width: "80%"}}>
                  <Text style={[API.styles.h3, {marginVertical: 0}]}>Usability Tips</Text>
                  <Text style={API.styles.p}>How to effectively use the app</Text>
                </View>
                <View style={[styles.pointerMulti, {backgroundColor: this.state.notificationSettings[1] == "1" ? "#4e88c5": "#eee"}]}></View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { API.haptics("touch"); ns[2] = ns[2] === "1" ? "0" : "1"; this.setState({notificationSettings: ns.join("")})}} style={styles.listItem}>
                <View style={{width: "80%"}}>
                  <Text style={[API.styles.h3, {marginVertical: 0}]}>Promotions</Text>
                  <Text style={API.styles.p}>Let us notify you when we have a discount for the subscription</Text>
                </View>
                <View style={[styles.pointerMulti, {backgroundColor: this.state.notificationSettings[2] == "1" ? "#4e88c5": "#eee"}]}></View>
              </TouchableOpacity>
            </View>
            <View style={{height: 600}}></View>
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
