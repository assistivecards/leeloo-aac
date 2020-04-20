import React from 'react';
import { Text, View, StatusBar, TouchableOpacity } from 'react-native';
import Navigator from './Navigator';

import * as Font from 'expo-font';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as GoogleSignIn from 'expo-google-sign-in';

import API from './api';

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      screen: "loading"
    }

  }

  async componentDidMount(){
    let identifier = await API.getData("identifier");
    if(identifier != ""){
      let user = await API.signIn(identifier);
      this.setState({screen: "logged"});
    }else{
      this.setState({screen: "login"});
    }
  }

  async signInWithApple(){
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log(credential);
      let user = await API.signIn(credential.user, "apple", credential);
      API.setData("identifier", credential.user);
      this.setState({screen: "logged"});

      // signed in
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }

  async signInWithGoogle(){
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        this._syncUserWithStateAsync();
        const credential = await GoogleSignIn.signInSilentlyAsync();
        let user = await API.signIn(credential.user, "google", credential);
        alert('credential:' + JSON.stringify(credential));

      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  }


  signInScreen(){
    return (
      <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={{ width: 200, height: 44 }}
          onPress={this.signInWithApple.bind(this)}
        />

        <TouchableOpacity
          style={{ width: 200, height: 44 }}
          onPress={this.signInWithGoogle.bind(this)}
        ><Text>Signin with google</Text></TouchableOpacity>
      </View>
    )
  }

  render() {
    let screen = this.state.screen;

    if(screen == "login"){
      return this.signInScreen();
    }else if(screen == "logged"){
      return (
        <View style={{flex: 1}}>
          <StatusBar backgroundColor="blue" barStyle={"dark-content"} />
          <Navigator/>
        </View>
      );
    }else if(screen == "loading"){
      return (
        <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
          <Text>Loading...</Text>
        </View>
      )
    }
  }
}
