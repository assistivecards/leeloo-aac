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
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F9FB"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonText={"Save"} rightButtonPress={() => this.save()}/>
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}}>
            <View style={styles.head}>
              <Text style={API.styles.h1}>Account</Text>
              <Text style={API.styles.p}>Make changes to the owner of this account.</Text>
            </View>
            <View style={{flex: 1, backgroundColor: "#fff"}}>
              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>Your Name</Text>
                <Text style={API.styles.subSmall}>Name of account handler or parent</Text>
                <TextInput style={API.styles.input} defaultValue={API.user.name} onChangeText={(text) => this.setState({newName: text})}/>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>Email Address</Text>
                <Text style={API.styles.subSmall}>We will send updates and analytics</Text>
                <TextInput style={API.styles.input} defaultValue={API.user.email} onChangeText={(text) => this.setState({newEmail: text})} autoCapitalize="none"/>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>Account ID</Text>
                <Text style={API.styles.subSmall}>This is an unchangeable ID we might ask from you</Text>
                <TextInput style={[API.styles.input, {backgroundColor: "#f1f1f1"}]} value={API.user.identifier.substr(0, 3) + "-" + API.user.type + "-" + API.user.id} selectTextOnFocus={true}/>
              </View>

              <View style={{height: 300}}></View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  }
});
