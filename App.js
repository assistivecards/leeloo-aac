import React from 'react';
import { Text, View, StatusBar, TouchableOpacity, ActivityIndicator, Image, Linking, SafeAreaView } from 'react-native';
import Navigator from './Navigator';
import Switch from './layouts/Switch';
import ProfileSetup from './layouts/ProfileSetup';

import * as Font from 'expo-font';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Localization from 'expo-localization';

import API from './api';

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      screen: "loading",
      moreSignin: false,
      activity: false,
      premium: API.premium
    }

    API.event.on("premium", () => {
      console.log("$$$$$", API.premium)
      this.setState({premium: API.premium});
    })

  }

  async componentDidMount(){
    this.checkIdentifier();

    API.event.on("refresh", (type) => {
      if(type == "signout"){
        this.setState({screen: "login"});
      }
    })
  }

  async checkIdentifier(){
    let identifier = await API.getIdentifier();
    if(identifier != ""){
      let user = await API.signIn(identifier);
      console.log("Already exists: ", user.language);
      if(user.language){
        API.ramLanguage(user.language).then(res => {
          this.setState({screen: "logged"});
        });
      }else{
        API.ramLanguage(Localization.locale.substr(0,2)).then(res => {
          this.setState({screen: "login"});
        });
      }
    }else{
      API.ramLanguage(Localization.locale.substr(0,2)).then(res => {
        this.setState({screen: "login"});
      });
    }
  }

  async signInWithApple(){
    try {
      this.setState({activity: true});

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      let user = await API.signIn(credential.user, "apple", credential);
      API.setData("identifier", credential.user);

      API.ramLanguage(user.language).then(res => {
        this.setState({screen: "logged", activity: false});
      });

      // signed in
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
        this.setState({activity: false});
      } else {
        // handle other errors
        alert('Make sure to have internet connection and try again later:' + e.code);
        this.setState({activity: false});
      }
    }
  }

  async signInWithGoogle(){
    try {
      this.setState({activity: true});
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        const credential = await GoogleSignIn.signInSilentlyAsync();
        let user = await API.signIn(credential.uid, "google", credential);
        API.setData("identifier", credential.uid);

        API.ramLanguage(user.language).then(res => {
          this.setState({screen: "logged", activity: false});
        });
      }
    } catch ({ message }) {
      alert('Make sure to have internet connection and try again later:' + message);
      this.setState({activity: false});
    }
  }

  setCurrentProfile(id){
    if(id){
      API.setCurrentProfile(id);
      this.forceUpdate();

    }else{
      API.getCurrentProfile().then(profile => {
        API.setCurrentProfile(profile.id);
        this.forceUpdate();
      })
    }
  }


  signInScreen(){
    return (
      <>
        <SafeAreaView style={{justifyContent: "center", alignItems: "center", flex: 1, backgroundColor: "#6989FF"}}>
          <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", padding: 30, paddingBottom: 0, marginTop: 20}}>
            <Text style={[API.styles.h1, {color: "#fff", marginTop: 0, marginHorizontal: 0, fontSize: 28, textAlign: "center"}]}>{API.t("setup_welcome_title1")}</Text>
            <Text style={[API.styles.h1, {color: "#fff", marginTop: 0, marginHorizontal: 0, fontSize: 42, textAlign: "center", marginBottom: 15}]}>{API.t("setup_welcome_title2")}</Text>
            <Text style={[API.styles.pHome, {marginBottom: 0, marginHorizontal: 0, textAlign: "center"}]}>{API.t("setup_welcome_description")}</Text>
          </View>
          <Image source={require("./assets/mascot.png")} style={{width: 150, height: 150, flex: 1}} resizeMode={"contain"} />

          {this.renderSignInButtons()}
          <TouchableOpacity onPress={() => Linking.openURL("https://dreamoriented.org/privacypolicy/")} style={{marginTop: 15, marginBottom: 30}}>
            <Text style={[API.styles.pHome, {textAlign: "center"}]}>
              By signing in you accept our <Text style={{fontWeight: "600"}}>Terms of Use</Text> and <Text style={{fontWeight: "600"}}>Privacy Policy</Text>.
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
        {this.state.activity &&
          <View style={{backgroundColor: "rgba(0,0,0,0.3)", width: "100%", height: "100%", position: "absolute", top: 0, left: 0, justifyContent: "center", alignItems: "center"}}>
            <View style={{width: 60, height: 60, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderRadius: 30}}>
              <ActivityIndicator color={"#6989FF"}/>
            </View>
          </View>
        }
      </>
    )
  }

  renderSignInButtons(){
    if(this.state.moreSignin){
      return (
        <View style={{justifyContent: "center", alignItems: "center", backgroundColor: "#6989FF"}}>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
            cornerRadius={25}
            style={{ width: 240, height: 50, borderRadius: 25 }}
            onPress={this.signInWithApple.bind(this)}
          />
          <View style={{height: 10}}></View>
          <TouchableOpacity
            style={{ width: 240, height: 46, alignItems: "center", borderRadius: 25, backgroundColor: "#fff",  justifyContent: "center", flexDirection: "row"}}
            onPress={this.signInWithGoogle.bind(this)}>
            <Image source={{uri: "https://developers.google.com/identity/images/g-logo.png"}} style={{width: 18, height: 18, marginRight: 5}}/>
            <Text style={{fontSize: 19, fontWeight: "500"}}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      )
    }else{
      if(Platform.OS == "ios"){
        return (
          <>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
              cornerRadius={25}
              style={{ width: 240, height: 50, borderRadius: 25 }}
              onPress={this.signInWithApple.bind(this)}
            />
            <TouchableOpacity onPress={() => this.setState({moreSignin: true})}><Text style={{color: "rgba(255,255,255,0.9)", marginTop: 18.5, marginBottom: 20}}>{API.t("setup_other_options")}</Text></TouchableOpacity>
          </>
        )
      }else{
        return(
          <>
            <TouchableOpacity
              style={{ width: 240, height: 46, alignItems: "center", borderRadius: 25, backgroundColor: "#fff",  justifyContent: "center", flexDirection: "row"}}
              onPress={this.signInWithGoogle.bind(this)}>
              <Image source={{uri: "https://developers.google.com/identity/images/g-logo.png"}} style={{width: 18, height: 18, marginRight: 5}}/>
              <Text style={{fontSize: 18, fontWeight: "500"}}>Sign in with Google</Text>
            </TouchableOpacity>
          </>
        );
      }
    }
  }

  renderLoading(){
    return (
      <View style={{flex: 1, backgroundColor: "#6989FF", justifyContent: "center", alignItems: "center"}}>
        <StatusBar backgroundColor="#6989FF" barStyle={"light-content"} />
        <View style={{width: 60, height: 60, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderRadius: 30}}>
          <ActivityIndicator color={"#6989FF"}/>
        </View>
      </View>
    )
  }

  render() {
    let screen = this.state.screen;

    if(screen == "login"){
      return this.signInScreen();
    }else if(screen == "logged"){
      if(API.user.active_profile == "noprofile"){
        return (<ProfileSetup done={this.setCurrentProfile.bind(this)}/>);
      }else if(API.user.active_profile == "multiple"){
        return (<Switch onChoose={this.setCurrentProfile.bind(this)}/>);
      }else if(API.user.active_profile.id){
        if(this.state.premium == "determining"){
          return this.renderLoading();
        }else{
          return (
            <View style={{flex: 1}}>
              <StatusBar backgroundColor="#ffffff" barStyle={"dark-content"} />
              <Navigator/>
            </View>
          );
        }
      }

    }else if(screen == "loading"){
      return this.renderLoading();
    }
  }
}
