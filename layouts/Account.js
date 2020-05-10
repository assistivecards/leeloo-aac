import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import API from '../api';
import TopBar from '../components/TopBar'

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
            <View style={styles.head}>
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
