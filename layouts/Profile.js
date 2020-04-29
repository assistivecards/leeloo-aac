import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import API from '../api';
import TopBar from '../components/TopBar'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.profile = this.props.navigation.getParam("profile");
    this.state = {
      name: this.profile.name,
    }
  }

  save(){
    let { name } = this.state;
    let changedFields = [];
    let changedValues = [];

    if(name != null){
      changedFields.push("name");
      changedValues.push(name);
    }

    API.updateProfile(this.profile.id, changedFields, changedValues).then(res => {
      this.props.navigation.pop();
    })
  }

  remove(){
    API.removeProfile(this.profile.id).then(res => {
      this.props.navigation.pop();
    })
  }

  setCurrent(){
    API.setCurrentProfile(this.profile.id).then(res => {
      this.props.navigation.pop();
    });
  }

  didChange(){
    return this.state.name != this.profile.name;
  }

  render() {
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F9FB"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonPress={() => this.save()}/>
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}}>
            <View style={styles.head}>
              <Text style={API.styles.h1}>{this.profile.name}</Text>
              <TextInput style={API.styles.input} defaultValue={this.profile.name} onChangeText={(text) => this.setState({name: text})}/>

              <Text style={API.styles.p}>Make changes to the owner of this account.</Text>
            </View>
            <View style={{flex: 1, backgroundColor: "#fff"}}>
              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>Your Name</Text>
                <Text style={API.styles.subSmall}>Name of account handler or parent</Text>
              </View>
              <TouchableOpacity onPress={() => this.setCurrent()}><Text style={[API.styles.h3, {color: "blue"}]}>Set as Current profile</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => this.remove()}><Text style={[API.styles.h3, {color: "red"}]}>Remove this profile</Text></TouchableOpacity>

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
    backgroundColor: "#F7F9FB",
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5
  },
  preferenceItem: {
    marginBottom: 10
  }
});
