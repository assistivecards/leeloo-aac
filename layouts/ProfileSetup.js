import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, Easing, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator } from 'react-native';

import API from '../api';
import Svg, { Path, Ellipse, G } from 'react-native-svg';
import * as ScreenOrientation from 'expo-screen-orientation';

export default class Setting extends React.Component {

  state = {
    page: "name",
    boy: true,
    girl: true,
    mixed: true,
    avatar: "",
    name: "",
    pageTransition: new Animated.Value(0),
    creating: false
  }

  componentDidMount(){
    API.getPacks();
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    this.animateTransition("name");
  }

  animateTransition(toPage){
    Animated.timing(
      this.state.pageTransition,
      {
        toValue: 0,
	      duration: 200
      }
    ).start(() => {
      if(toPage){
        if(toPage == "close"){
          this.props.done();
        }else{
          this.setState({page: toPage});
          Animated.timing(
            this.state.pageTransition,
            {
              toValue: 1,
      	      duration: 400
            }
          ).start();
        }
      }
    });
  }

  chooseAvatar(avatar){
    this.setState({avatar})
    this.animateTransition("finish");
  }

  _getTransitionInt = (from, to) => {
      const { pageTransition } = this.state;

      return pageTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [from, to],
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
      });
  }

  componentWillUnmount(){
    ScreenOrientation.unlockAsync();
  }

  setName(){
    this.animateTransition("avatar");
  }

  renderName(){
    return (
      <View style={{flex: 1}}>
        <KeyboardAvoidingView style={{flex: 1}}  behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <View style={{flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "column", padding: 30}}>
            <Text style={[API.styles.h2, {color: "#fff", marginTop: 30, fontSize: 26, marginHorizontal: 0, textAlign: "center"}]}>{API.t("setup_create_profile_title")}</Text>
            <Text style={[API.styles.pHome, {marginBottom: 35, marginHorizontal: 0, textAlign: "center"}]}>{API.t("setup_create_profile_description")}</Text>
            <TextInput style={[API.styles.input, {width: "100%", backgroundColor: "#fff"}]} placeholder={API.t("setup_your_name")} value={this.state.name} onChangeText={(name) => this.setState({name})}/>
            {this.state.name.length >= 2 &&
              <TouchableOpacity style={[API.styles.whiteButton, {marginTop: 30}]} onPress={() => this.setName()}>
                <Text style={{color: "#6989FF", fontWeight: "bold", fontSize: 18}}>{API.t("button_next")}</Text>
              </TouchableOpacity>
            }
            {this.state.name.length < 2 &&
              <View style={[API.styles.whiteButton, {marginTop: 30, backgroundColor: "rgba(255,255,255,0.5)"}]} onPress={() => this.setName()}>
                <Text style={{color: "#6989FF", fontWeight: "bold", fontSize: 18}}>{API.t("button_next")}</Text>
              </View>
            }
          </View>
        </KeyboardAvoidingView>
        {this.renderLeeloo()}
      </View>
    )
  }

  createProfile(){
    this.setState({creating: true});
    let { name, avatar } = this.state;

    let profile = {
      name,
      avatar
    }

    API.newProfile(profile).then(res => {
      this.animateTransition("close");
    })
  }

  renderAvatar(){
    return (
      <KeyboardAvoidingView style={{flex: 1}}>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
          <View style={{justifyContent: "center", alignItems: "center", flexDirection: "column", padding: 30}}>
            <Text style={[API.styles.h2, {color: "#fff", marginTop: 30, fontSize: 26, marginHorizontal: 0, textAlign: "center"}]}>{API.t("setup_avatar_title")}</Text>
            <Text style={[API.styles.pHome, {marginBottom: 10, marginHorizontal: 0, textAlign: "center"}]}>{API.t("setup_avatar_description")}</Text>
          </View>

          <View style={{borderWidth: 1, marginBottom: 10, borderColor: "rgba(255,255,255,0.5)", height: 36, backgroundColor: "rgba(255,255,255,0.1)", flexDirection: "row", borderRadius: 18, overflow: "hidden", marginHorizontal: 25}}>
            <TouchableOpacity onPress={() => this.setState({boy: true, girl: false, mixed: false})} style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: this.state.boy ? "rgba(255,255,255,0.2)" : "transparent"}}><Text style={{fontSize: 15, fontWeight: "bold", color: "#fff"}}>{API.t("setup_label_boy")}</Text></TouchableOpacity>
            <View style={{height: "100%", borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.5)"}}></View>
            <TouchableOpacity onPress={() => this.setState({boy: false, girl: true, mixed: false})} style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: this.state.girl ? "rgba(255,255,255,0.2)" : "transparent"}}><Text style={{fontSize: 15, fontWeight: "bold", color: "#fff"}}>{API.t("setup_label_girl")}</Text></TouchableOpacity>
            <View style={{height: "100%", borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.5)"}}></View>
            <TouchableOpacity onPress={() => this.setState({boy: false, girl: false, mixed: true})} style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: this.state.mixed ? "rgba(255,255,255,0.2)" : "transparent"}}><Text style={{fontSize: 15, fontWeight: "bold", color: "#fff"}}>{API.t("setup_label_mixed")}</Text></TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 30, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingTop: 15}}>
           {this.state.boy && Array.apply(null, Array(33)).map((boy, i) => {
             return (
               <TouchableOpacity style={styles.childAvatar} key={"boy"+(i+1)} onPress={() => this.chooseAvatar(`boy${(i+1) < 10 ? "0"+(i+1) : (i+1)}`)}>
                 <Image source={{uri: `${API.assetEndpoint}cards/avatar/boy${(i+1) < 10 ? "0"+(i+1) : (i+1)}.png?v=${API.version}`}} resizeMode="contain" style={styles.childImage} />
               </TouchableOpacity>
             )
           })}
           {this.state.girl && Array.apply(null, Array(27)).map((girl, i) => {
             return (
               <TouchableOpacity style={styles.childAvatar} key={"girl"+(i+1)} onPress={() => this.chooseAvatar(`girl${(i+1) < 10 ? "0"+(i+1) : (i+1)}`)}>
                 <Image source={{uri: `${API.assetEndpoint}cards/avatar/girl${(i+1) < 10 ? "0"+(i+1) : (i+1)}.png?v=${API.version}`}} resizeMode="contain" style={styles.childImage} />
               </TouchableOpacity>
             )
           })}
           {this.state.mixed && Array.apply(null, Array(29)).map((misc, i) => {
             return (
               <TouchableOpacity style={styles.childAvatar} key={"misc"+(i+1)} onPress={() => this.chooseAvatar(`misc${(i+1) < 10 ? "0"+(i+1) : (i+1)}`)}>
                 <Image source={{uri: `${API.assetEndpoint}cards/avatar/misc${(i+1) < 10 ? "0"+(i+1) : (i+1)}.png?v=${API.version}`}} resizeMode="contain" style={styles.childImage} />
               </TouchableOpacity>
             )
           })}
          </View>
          <View style={{backgroundColor: "#6989FF", height: 40}}>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  renderLeeloo(){
    return (
      <View style={{position: "relative", top: 30}}>
      <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="140"
          viewBox="0 0 159.982 131.696"
        >
          <G
            id="Group_1472"
            data-name="Group 1472"
            transform="translate(-272.187 -259.941)"
          >
            <G
              id="Group_1443"
              data-name="Group 1443"
              transform="rotate(-9 -1455.979 934.989)"
            >
              <G
                id="Group_1357"
                data-name="Group 1357"
                transform="translate(351.842 546)"
              >
                <G id="Group_1427" data-name="Group 1427">
                  <G id="Group_1353" data-name="Group 1353">
                    <Path
                      id="Path_2648"
                      fill="#f5f5f5"
                      d="M298.1 117.272a11.1 11.1 0 0021.593 4.5l.211-.65c4.378-13.31 17.765-22.014 30.563-27.718a16.781 16.781 0 10-16.656-28.932c-1.922 2.038-32.79 21.128-35.711 52.8z"
                      data-name="Path 2648"
                      transform="translate(-228.65 -44.596)"
                    ></Path>
                    <Path
                      id="Path_2649"
                      fill="#ebebeb"
                      d="M319.835 105.066c-9.3 9.05-20.068 23.026-21.735 41.1a11.1 11.1 0 0021.593 4.5l.211-.65c3.633-11.045 13.471-18.916 24.028-24.536a70.029 70.029 0 00-24.1-20.409z"
                      data-name="Path 2649"
                      transform="translate(-228.651 -73.491)"
                    ></Path>
                    <Path
                      id="Path_2650"
                      fill="#f5f5f5"
                      d="M150.345 81.367a11.1 11.1 0 01-21.828-3.161l.024-.683c.438-14-9.165-26.762-19.24-36.5a16.781 16.781 0 1125.547-21.491c1.107 2.578 23.583 31.079 15.497 61.835z"
                      data-name="Path 2650"
                      transform="translate(-100.685 -12.181)"
                    ></Path>
                    <Path
                      id="Path_2651"
                      fill="#ebebeb"
                      d="M163.741 80.284A70.412 70.412 0 00134.109 91.2c8 8.89 14.549 19.651 14.185 31.272l-.024.683a11.1 11.1 0 0021.828 3.161c4.613-17.541-.719-34.349-6.357-46.032z"
                      data-name="Path 2651"
                      transform="translate(-120.438 -57.133)"
                    ></Path>
                    <Path
                      id="Path_2652"
                      fill="#fff"
                      d="M208.987 166.958c-4.542 25.76-32.9 36.685-64.525 31.109s-54.536-25.542-49.994-51.3 33.86-42.122 65.484-36.546 53.577 30.979 49.035 56.737z"
                      data-name="Path 2652"
                      transform="translate(-93.893 -76.173)"
                    ></Path>
                  </G>
                </G>
              </G>
              <Path
                id="Intersection_10"
                fill="#f5f5f5"
                d="M50.569 81.856C18.945 76.28-3.968 56.314.575 30.554 2.907 17.325 11.777 6.574 24.134 0c.721.285 1.138.454 1.138.454s-43.312 73.332 63.85 78.29c.687.032 1.36.064 2.024.1a66.262 66.262 0 01-24.795 4.437 91.043 91.043 0 01-15.782-1.425z"
                data-name="Intersection 10"
                transform="translate(350.792 586.039)"
              ></Path>
              <G
                id="Group_1426"
                data-name="Group 1426"
                transform="translate(359.42 609.854)"
              >
                <G
                  id="Group_1350"
                  fill="#a2ddfd"
                  data-name="Group 1350"
                  transform="translate(0 4.637)"
                >
                  <Ellipse
                    id="Ellipse_342"
                    cx="10.33"
                    cy="12.972"
                    data-name="Ellipse 342"
                    rx="10.33"
                    ry="12.972"
                    transform="matrix(.174 -.985 .985 .174 0 20.351)"
                  ></Ellipse>
                  <Ellipse
                    id="Ellipse_343"
                    cx="10.33"
                    cy="12.972"
                    data-name="Ellipse 343"
                    rx="10.33"
                    ry="12.972"
                    transform="rotate(-79.98 54.026 -25.008)"
                  ></Ellipse>
                </G>
                <G
                  id="Group_1351"
                  fill="#3e455b"
                  data-name="Group 1351"
                  transform="translate(14.289)"
                >
                  <Path
                    id="Path_2654"
                    d="M248.2 237.423a12.188 12.188 0 01-10.446-5.908 2.549 2.549 0 114.367-2.632 7.093 7.093 0 0010.545 1.859 2.55 2.55 0 113.2 3.967 12.206 12.206 0 01-7.666 2.714z"
                    data-name="Path 2654"
                    transform="translate(-210.475 -218.258)"
                  ></Path>
                  <Path
                    id="Path_2655"
                    d="M338.419 240.4a2.592 2.592 0 01-.446-.039 2.55 2.55 0 01-2.068-2.954 3.3 3.3 0 10-6.5-1.147 2.55 2.55 0 01-5.022-.886 8.4 8.4 0 1116.545 2.918 2.55 2.55 0 01-2.508 2.107z"
                    data-name="Path 2655"
                    transform="translate(-267.871 -218.772)"
                  ></Path>
                  <Path
                    id="Path_2679"
                    d="M338.419 240.4a2.592 2.592 0 01-.446-.039 2.55 2.55 0 01-2.068-2.954 3.3 3.3 0 10-6.5-1.147 2.55 2.55 0 01-5.022-.886 8.4 8.4 0 1116.545 2.918 2.55 2.55 0 01-2.508 2.107z"
                    data-name="Path 2679"
                    transform="translate(-324.343 -228.429)"
                  ></Path>
                </G>
              </G>
            </G>
            <G
              id="Group_1449"
              data-name="Group 1449"
              transform="translate(159 215)"
            >
              <Path
                id="Path_2963"
                fill="#f5f5f5"
                d="M324.832 250.637a12.109 12.109 0 01-.771-24.192c18.55-1.2 35.9-21.73 41.789-35.226a12.108 12.108 0 1122.2 9.683c-13.458 30.851-41.588 48.359-62.42 49.709-.27.017-.53.026-.798.026z"
                data-name="Path 2963"
                transform="translate(-115.89 -74)"
              ></Path>
              <Path
                id="Path_2964"
                fill="#ebebeb"
                d="M369.894 188.476a12.047 12.047 0 00-4.044 5c-5.887 13.5-23.239 34.023-41.789 35.226a12.109 12.109 0 00.771 24.192q.395 0 .795-.026a49.052 49.052 0 008.934-1.472q3.222-1.811 6.2-3.84c18.935-12.94 29.363-31.951 29.363-53.532 0-1.862-.081-3.711-.23-5.548z"
                data-name="Path 2964"
                transform="translate(-115.891 -76.257)"
              ></Path>
            </G>
          </G>
        </Svg>
      </View>
    )
  }


  renderFinish(){
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "column", padding: 30}}>
          <Text style={[API.styles.h2, {color: "#fff", marginTop: 30, fontSize: 26, marginHorizontal: 0, textAlign: "center"}]}>{API.t("setup_congrats_title", this.state.name)}</Text>
          <Text style={[API.styles.pHome, {marginBottom: 35, marginHorizontal: 0, textAlign: "center"}]}>{API.t("setup_congrats_description")}</Text>
          <Image source={require("../assets/leeloo_magic.png")} style={{width: 200, height: 300, padding: 10}} resizeMode={"contain"}/>
          {!this.state.creating &&
            <TouchableOpacity style={API.styles.whiteButton} onPress={() => this.createProfile()}>
              <Text style={{color: "#6989FF", fontWeight: "bold", fontSize: 18}}>{API.t("button_start")}</Text>
            </TouchableOpacity>
          }
          {this.state.creating &&
            <View style={API.styles.whiteButton}>
              <ActivityIndicator color={"#6989FF"}/>
            </View>
          }
        </View>
      </View>
    )
  }

  render() {
    return(
      <View style={{flex: 1, backgroundColor: "#6989FF"}}>
        <StatusBar backgroundColor="#6989FF" barStyle={"light-content"} />
        <Animated.View style={{flex: 1, opacity: this._getTransitionInt(0, 1), transform: [{translateY: this._getTransitionInt(50, 0)}]}}>
          {this.state.page == "name" && this.renderName()}
          {this.state.page == "avatar" && this.renderAvatar()}
          {this.state.page == "finish" && this.renderFinish()}
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  childAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F5F5F7",
    borderWidth: 9,
    borderColor: "#ffffff",
    overflow: "hidden",
    marginBottom: 15
  },
  childImage: {
    width: 60,
    height: 60,
    position: "relative",
    top: 6,
    margin: 6
  }
});
