import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import API from '../api';
import TopBar from '../components/TopBar'
import Svg, { Path, Line, Circle, Polyline, Rect } from 'react-native-svg';

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      newName: null,
    }
  }

  componentDidMount(){
    API.hit("Account");
  }

  save(){
    let { newName, newEmail } = this.state;
    let changedFields = [];
    let changedValues = [];

    if(newName != null){
      changedFields.push("name");
      changedValues.push(newName);
    }

    if(newEmail != null){
      changedFields.push("email");
      changedValues.push(newEmail);
    }

    API.update(changedFields, changedValues).then(res => {
      this.props.navigation.pop();
      API.haptics("impact");
    })
  }

  didChange(){
    return this.state.newName != null || this.state.newEmail != null;
  }

  render() {
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonPress={() => this.save()}/>
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
            <View style={[styles.head, {alignItems: API.user.isRTL ? "flex-end" : "flex-start"}]}>
              <Text style={API.styles.h1}>{API.t("settings_selection_account")}</Text>
              <Text style={API.styles.pHome}>{API.t("settings_account_description")}</Text>
            </View>
            <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>{API.t("settings_account_section1_title")}</Text>
                <Text style={API.styles.subSmall}>{API.t("settings_account_section1_description")}</Text>
                <TextInput style={API.styles.input} defaultValue={API.user.name} onChangeText={(text) => this.setState({newName: text})}/>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>{API.t("settings_account_section2_title")}</Text>
                <Text style={API.styles.subSmall}>{API.t("settings_account_section2_description")}</Text>
                <TextInput style={API.styles.input} defaultValue={API.user.email} onChangeText={(text) => this.setState({newEmail: text})} autoCapitalize="none"/>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>{API.t("settings_account_section3_title")}</Text>
                <Text style={API.styles.subSmall}>{API.t("settings_account_section3_description")}</Text>
                <TextInput style={[API.styles.input, {backgroundColor: "#f1f1f1"}]} value={API.user.identifier.substr(0, 3) + "-" + API.user.type + "-" + API.user.id} selectTextOnFocus={true}/>
              </View>
              <TouchableOpacity onPress={() => API.signout()}>
                <View style={[[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}], {borderBottomWidth: 0, padding: 25}]}>
                  <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <Path stroke="none" d="M0 0h24v24H0z"/>
                    <Path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                    <Path d="M7 12h14l-3 -3m0 6l3 -3" />
                  </Svg>
                  <Text style={[API.styles.b, {fontSize: 15, marginLeft: 10}]}>{API.t("settings_selection_signout")}</Text>
                </View>
              </TouchableOpacity>
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
    paddingBottom: 20,
    borderBottomWidth: 1, borderColor: "#f5f5f5",
  }
});
