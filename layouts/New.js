import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import API from '../api';
import TopBar from '../components/TopBar'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: "",
    }
  }

  componentDidMount(){
    API.hit("NewProfile");
  }

  save(){
    let { name } = this.state;

    let profile = {
      name,
      packs: "[1,2,3,4,5,6,7]"
    }

    API.newProfile(profile).then(res => {
      this.props.navigation.pop();
    })
  }

  didChange(){
    return this.state.name != "";
  }

  render() {
    return(
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonPress={() => this.save()}/>
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
            <View style={styles.head}>
              <Text style={API.styles.h1}>New Profile</Text>
              <TextInput style={API.styles.input} defaultValue={""} onChangeText={(text) => this.setState({name: text})}/>

              <Text style={API.styles.p}>Make changes to the owner of this account.</Text>
            </View>
            <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
              <View style={styles.preferenceItem}>
                <Text style={API.styles.h3}>Your Name</Text>
                <Text style={API.styles.subSmall}>Name of account handler or parent</Text>
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
  }
});
