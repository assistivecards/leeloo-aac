import React from 'react';
import { Text, View, StatusBar, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image, Linking, SafeAreaView } from 'react-native';
import Navigator from './Navigator';
import Switch from './layouts/Switch';
import ProfileSetup from './layouts/ProfileSetup';
import EmailSignIn from './layouts/EmailSignIn';
import Browser from './layouts/Browser';
import ErrorBoundary from './ErrorBoundary';

import Svg, { Path, Line, Circle, Polyline, Rect } from 'react-native-svg';

import * as Font from 'expo-font';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Localization from 'expo-localization';
import * as ScreenOrientation from 'expo-screen-orientation';

import API from './api';

TouchableOpacity.defaultProps = TouchableOpacity.defaultProps || {};
TouchableOpacity.defaultProps.delayPressIn = 0;
TouchableWithoutFeedback.defaultProps = TouchableWithoutFeedback.defaultProps || {};
TouchableWithoutFeedback.defaultProps.delayPressIn = 0;

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
    setTimeout(() => {
      if(this.state.screen == "loading"){
        this.setState({screen: "login"});
      }
    }, 5000);
    this.checkIdentifier();
    ScreenOrientation.unlockAsync();

    API.event.on("refresh", (type) => {
      if(type == "signout"){
        this.setState({screen: "login"});
      }
    })
  }

  async checkIdentifier(providedIdentifier){
    let identifier = providedIdentifier;
    if(!identifier){
      identifier = await API.getIdentifier();
    }

    if(identifier != ""){
      let user = await API.signIn(identifier);
      console.log("Already exists: ", user.language);
      if(user.language){
        this.setState({screen: "logged"});
      }else{
        this.setState({screen: "login"});
      }
    }else{
      this.setState({screen: "login"});
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

      this.setState({screen: "logged", activity: false});

      // signed in
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
        this.setState({activity: false});
      } else {
        // handle other errors
        alert('Make sure to have internet connection and try again later:' + JSON.stringify(e));
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

        this.setState({screen: "logged", activity: false});
      }
    } catch ({ message }) {
      alert('Make sure to have internet connection and try again later:' + message);
      this.setState({activity: false});
    }
  }

  signInWithEmail(){
    this.setState({screen: "email"});
    API.event.on("authIdentifier", (identifier) => {
      this.checkIdentifier(identifier);
      API.setData("identifier", identifier);
    });
  }

  setCurrentProfile(id){
    if(id){
      API.setCurrentProfile(id);
      this.forceUpdate();

    }else{
      API.getCurrentProfile().then(profile => {
        if(profile){
          API.setCurrentProfile(profile.id);
        }else{
          API.setCurrentProfile(API.user.profiles[0].id);
        }
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
          <TouchableOpacity onPress={() => this.setState({screen: "policy"})} style={{marginTop: 15, marginBottom: 30}}>
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
            <TouchableOpacity style={{marginTop: 30, position: "absolute", bottom: 30}} onPress={() => this.setState({activity: false})}>
              <Text style={{color: "#fff", fontWeight: "bold", fontSize: 18}}>{API.t("alert_cancel")}</Text>
            </TouchableOpacity>
          </View>
        }
      </>
    )
  }

  renderSignInButtons(){
    if(this.state.moreSignin){

      if(Platform.OS == "android"){
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
        );
      }else if(Platform.OS == "ios"){
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
            <View style={{height: 10}}></View>
            <TouchableOpacity
              style={{ width: 240, height: 46, alignItems: "center", borderRadius: 25, backgroundColor: "#fff",  justifyContent: "center", flexDirection: "row"}}
              onPress={this.signInWithEmail.bind(this)}>
              <Svg height={18} width={18} viewBox="0 0 24 24" style={{marginRight: 5}} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <Path d="M0 0h24v24H0z" stroke="none"/>
                <Rect height="14" width="18" rx="2" x="3" y="5"/>
                <Polyline points="3 7 12 13 21 7"/>
              </Svg>
              <Text style={{fontSize: 19, fontWeight: "500"}}>Sign in with Email</Text>
            </TouchableOpacity>
          </View>
        );
      }
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
            <TouchableOpacity
              style={{ width: 240, height: 46, alignItems: "center", borderRadius: 25, backgroundColor: "#fff",  justifyContent: "center", flexDirection: "row", marginTop: 10}}
              onPress={this.signInWithEmail.bind(this)}>
              <Svg height={18} width={18} viewBox="0 0 24 24" style={{marginRight: 5}} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <Path d="M0 0h24v24H0z" stroke="none"/>
                <Rect height="14" width="18" rx="2" x="3" y="5"/>
                <Polyline points="3 7 12 13 21 7"/>
              </Svg>
              <Text style={{fontSize: 19, fontWeight: "500"}}>Sign in with Email</Text>
            </TouchableOpacity>
          </>
        );
      }
    }
  }

  renderLoading(type){
    if(type == "premium"){
      setTimeout(() => {
        this.setState({premium: "none"});
      }, 5000);
    }
    return (
      <View style={{flex: 1, backgroundColor: "#6989FF", justifyContent: "center", alignItems: "center"}}>
        <StatusBar backgroundColor="#6989FF" barStyle={"light-content"} />
        <View style={{width: 60, height: 60, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderRadius: 30}}>
          <ActivityIndicator color={"#6989FF"}/>
        </View>
      </View>
    )
  }

  renderAll() {
    let screen = this.state.screen;

    if(screen == "login"){
      return this.signInScreen();
    }else if(screen == "policy"
  ){
      return (<Browser link={"https://dreamoriented.org/privacypolicy_textonly"} back={() => this.setState({screen: "login"})}/>);
    }else if(screen == "email"){
      return (<EmailSignIn back={() => this.setState({screen: "login"})}/>);
    }else if(screen == "logged"){
      if(API.user.active_profile == "noprofile"){
        return (<ProfileSetup done={this.setCurrentProfile.bind(this)}/>);
      }else if(API.user.active_profile == "multiple"){
        return (<Switch onChoose={this.setCurrentProfile.bind(this)}/>);
      }else if(API.user.active_profile){
        if(this.state.premium == "determining"){
          return this.renderLoading("premium");
        }else{
          return (
            <View style={{flex: 1}}>
              <StatusBar backgroundColor="#ffffff" barStyle={"dark-content"} />
              <Navigator/>
            </View>
          );
        }
      }else{
        return (<ProfileSetup done={this.setCurrentProfile.bind(this)}/>);
      }

    }else if(screen == "loading"){
      return this.renderLoading();
    }
  }

  render(){
    return (
      <ErrorBoundary>
        {this.renderAll()}
      </ErrorBoundary>
    )
  }
}
