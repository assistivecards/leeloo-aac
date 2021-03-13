import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, AppState } from 'react-native';
import Svg, { Path, Line, Circle, Polyline, Rect } from 'react-native-svg';

import API from '../api';
import TopBar from '../components/TopBar'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      pass: ""
    }
  }

  componentDidMount(){
    API.hit("Legal");
  }

  async signIn(){
    let email = this.state.email;
    let pass = this.state.pass;
    if(email && pass){
      let identifier = await API.getAuthIdentifier(email, pass);
      await API.signIn(identifier, "email", {email: email});
      this.props.back();
      API.event.emit("authIdentifier", identifier);
    }else{
      alert("Email and passwords can't be empty");
    }
  }

  render() {
    return(
      <>
        <TopBar back={() => this.props.back()} backgroundColor={"#6989FF"}/>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
          <View style={{paddingTop: 0}}>
            <Text style={API.styles.h1}>{API.t("register_email_title")}</Text>
            <Text style={API.styles.pHome}>{API.t("register_email_description")}</Text>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
            <View style={styles.preferenceItem}>
              <Text style={API.styles.h3}>{API.t("register_your_email")}</Text>
              <Text style={API.styles.subSmall}>{API.t("register_your_email_description")}</Text>
              <TextInput autoCompleteType="email" autoCapitalize="none" style={API.styles.input} onChangeText={(text) => this.setState({email: text})}/>
            </View>

            <View style={styles.preferenceItem}>
              <Text style={API.styles.h3}>{API.t("register_your_pass")}</Text>
              <Text style={API.styles.subSmall}>{API.t("register_your_pass_description")}</Text>
              <TextInput autoCompleteType="password" autoCapitalize="none" style={API.styles.input} onChangeText={(text) => this.setState({pass: text})}/>
            </View>

            <TouchableOpacity style={[API.styles.input, {backgroundColor: "#000", justifyContent: "center", alignItems: "center", marginTop: 20}]} onPress={() => this.signIn()}>
              <Text style={{color: "#fff", fontWeight: "bold"}}>{API.t("register_button_text")}</Text>
            </TouchableOpacity>
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

  selectionCarrier: {
    marginTop: 10,
    marginHorizontal: 30,
    borderBottomWidth: 1,
    paddingBottom: 25,
    borderBottomColor: "#eee"
  },
  selectionItem: {
    flexDirection: "row",
    height: 44,
    alignItems: "center",
  },
  selectionIcon: {
    margin: 10,
    marginRight: 20
  },
  appData: {
    textAlign: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: 30,
    opacity: 0.6
  }
});
