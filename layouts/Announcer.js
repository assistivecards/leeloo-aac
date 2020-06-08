import React from 'react';
import { StyleSheet, Text, View, ScrollView, Animated, ActivityIndicator, Dimensions, TouchableWithoutFeedback, TouchableOpacity, LayoutAnimation, Platform, RefreshControl, PanResponder, Image as RNImage, Easing, SafeAreaView  } from 'react-native';
import Constants from 'expo-constants';
import Svg, { Path } from 'react-native-svg';
import { Image } from 'react-native-elements';
import { Image as CachedImage } from "react-native-expo-image-cache";
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as ScreenOrientation from 'expo-screen-orientation';

import API from '../api'
import titleCase from '../js/titleCase';

import TopBar from '../components/TopBar'
import TouchableScale from '../components/touchable-scale';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.windowHeight = Dimensions.get('window').height;
    this.offsetValue = 0;
    this.valueListener = null;

    this.card = this.props.navigation.getParam("card");
    this.pack = this.props.navigation.getParam("pack");
    this.speak(this.card.title);

    this.state = {
      orientation: this.props.navigation.getParam("orientation"),
      pop: new Animated.Value(0),
      pan: new Animated.ValueXY({x: 0, y: this.windowHeight}),
      scrollerHeight: 0
    }

    this.valueListener = this.state.pan.addListener((value) => {
      this.offsetValue = value.y
    });

    this.state.panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx != 0 && gestureState.dy != 0;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx != 0 && gestureState.dy != 0;
      },
      onPanResponderGrant: (evt, gestureState) => {
        this.state.pan.setOffset({x: 0, y: this.offsetValue});
        this.state.pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([
        null,
        {
          dy: this.state.pan.y
        }
      ]),
      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();

        let yVal = this.state.pan.y._value;
        let maxToYVal = this.windowHeight - this.state.scrollerHeight;

        if(yVal > 70) {
          this.closeModal();
        }else{
          if(maxToYVal > 0){
            Animated.spring(this.state.pan, {
              toValue: {x: 0, y: 0},
              useNativeDriver: true
            }).start()
          }else{

            if (yVal > 0 || yVal < maxToYVal){
              let toYVal = 0;
              if(yVal < maxToYVal){
                toYVal = maxToYVal;
              }
              Animated.spring(this.state.pan, {
                toValue: {x: 0, y: toYVal},
                useNativeDriver: true
              }).start()
            }else{
              Animated.decay(this.state.pan, {
                velocity: {x: 0, y: vy},
                deceleration: 0.989,
                useNativeDriver: true
              }).start()
            }
          }
        }
      }
    });

  }

  componentDidMount(){
    Animated.timing(
      this.state.pop,
      {
        toValue: 1,
	      duration: 200
      }
    ).start();

    Animated.spring(
      this.state.pan,
      {
        bounciness: 4, toValue: { x: 0, y: 0 },
        useNativeDriver: true
      }
    ).start();

    API.hit("Card:"+this.card.slug);
    this.orientationSubscription = ScreenOrientation.addOrientationChangeListener(this._orientationChanged.bind(this));
  }

  _orientationChanged(orientation){
    let newOrientation = "portrait";
    if(orientation.orientationInfo.orientation == 3 || orientation.orientationInfo.orientation == 4){
      newOrientation = "landscape";
    }
    this.setState({orientation: newOrientation});
  }

  componentWillUnmount(){
    this.state.pan.removeListener(this.valueListener);
    ScreenOrientation.removeOrientationChangeListener(this.orientationSubscription);
  }

  closeModal(){
    API.haptics("impact");

    Animated.timing(
      this.state.pop,
      {
        toValue: 0,
	      duration: 400,
        easing: Easing.in(Easing.ease)
      }
    ).start(() => {
      this.props.navigation.pop();
      API.haptics("touch");

    });

    Animated.spring(
      this.state.pan, // Auto-multiplexed
      {
        speed: 3,
        toValue: { x: 0, y: this.windowHeight},
        useNativeDriver: true
      }
    ).start();
  }

  _getPopInt = (from, to) => {
      const { pop } = this.state;

      return pop.interpolate({
          inputRange: [0, 1],
          outputRange: [from, to],
          extrapolate: 'clamp',
          useNativeDriver: true
      });
  }

  speak(text, speed){
    API.haptics("touch");
    API.speak(text, speed);
  }

  render() {

    return (
      <View style={{flex: 1}}>
        <Animated.View style={{flex: 1, opacity: this._getPopInt(0,1), backgroundColor: Platform.OS == "android" ? "rgba(255,255,255,0.95)" :  "rgba(255,255,255,0.2)"}}>
          <BlurView intensity={100} style={{flex: 1}}>
          </BlurView>
        </Animated.View>
        <Animated.View
          {...this.state.panResponder.panHandlers} style={[{ transform: this.state.pan.getTranslateTransform() }, styles.modal]}>
          <View onLayout={(e) => {
              let {height} = e.nativeEvent.layout;
              this.setState({scrollerHeight: height});
            }}>
            <View style={[styles.head, {paddingTop: this.state.orientation == "portrait" ? 100 : 0}]}>
              <View style={styles.cardHolder}>
                <TouchableScale onPress={() => this.speak(this.card.title)} style={[styles.button, {right: 0}]}>
                  <Svg viewBox="0 0 24 24" width={32} height={32}>
                    <Path fill={"#333"} d="M12 4V2.21c0-.45-.54-.67-.85-.35l-2.8 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.32.31.86.09.86-.36V6c3.31 0 6 2.69 6 6 0 .79-.15 1.56-.44 2.25-.15.36-.04.77.23 1.04.51.51 1.37.33 1.64-.34.37-.91.57-1.91.57-2.95 0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-.79.15-1.56.44-2.25.15-.36.04-.77-.23-1.04-.51-.51-1.37-.33-1.64.34C4.2 9.96 4 10.96 4 12c0 4.42 3.58 8 8 8v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V18z"/>
                  </Svg>
                </TouchableScale>
                <TouchableScale style={styles.cardMid} onPress={() => this.speak(this.card.title)} >
                  <Animated.View style={{height: 150, width: 150, borderRadius: 0, overflow: "hidden", backgroundColor: "transparent", padding: 10}}>
                    <CachedImage uri={`${API.assetEndpoint}cards/${this.pack.slug}/${this.card.slug}.png?v=${API.version}`} style={{width:"100%", height: "100%"}} PlaceholderContent={<ActivityIndicator />} resizeMode="contain" placeholderStyle={{backgroundColor: "#F7F9FB"}}/>
                  </Animated.View>
                </TouchableScale>
                <TouchableScale onPress={() => this.speak(this.card.title, "slow")} style={[styles.button, {left: 0}]}>
                  <Svg viewBox="0 0 24 24" width={32} height={32}>
                    <Path fill={"#333"} d="M10 8.5v7c0 .41.47.65.8.4l4.67-3.5c.27-.2.27-.6 0-.8L10.8 8.1c-.33-.25-.8-.01-.8.4zm1-5.27c0-.64-.59-1.13-1.21-.99-1.12.26-2.18.7-3.12 1.3-.53.34-.61 1.1-.16 1.55.32.32.83.4 1.21.16.77-.49 1.62-.85 2.54-1.05.44-.1.74-.51.74-.97zM5.1 6.51c-.46-.45-1.21-.38-1.55.16-.6.94-1.04 2-1.3 3.12-.14.62.34 1.21.98 1.21.45 0 .87-.3.96-.74.2-.91.57-1.77 1.05-2.53.26-.39.18-.9-.14-1.22zM3.23 13c-.64 0-1.13.59-.99 1.21.26 1.12.7 2.17 1.3 3.12.34.54 1.1.61 1.55.16.32-.32.4-.83.15-1.21-.49-.76-.85-1.61-1.05-2.53-.09-.45-.5-.75-.96-.75zm3.44 7.45c.95.6 2 1.04 3.12 1.3.62.14 1.21-.35 1.21-.98 0-.45-.3-.87-.74-.96-.91-.2-1.77-.57-2.53-1.05-.39-.24-.89-.17-1.21.16-.46.44-.39 1.19.15 1.53zM22 12c0 4.73-3.3 8.71-7.73 9.74-.62.15-1.22-.34-1.22-.98 0-.46.31-.86.75-.97 3.55-.82 6.2-4 6.2-7.79s-2.65-6.97-6.2-7.79c-.44-.1-.75-.51-.75-.97 0-.64.6-1.13 1.22-.98C18.7 3.29 22 7.27 22 12z"/>
                  </Svg>
                </TouchableScale>
              </View>
            </View>

            <View style={{flexDirection: "column", alignItems: "center"}}>
              <Text style={[API.styles.h2, {marginTop: 0}]}>{titleCase(this.card.title)}</Text>
              <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 15}]}>{this.pack.locale}</Text>
            </View>
            <View style={styles.content}>
              {this.card.phrases.map((phrase, pi) => {
                return(
                  <TouchableOpacity style={[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}]} key={pi} onPress={() => this.speak(API.phrase(phrase.phrase))}>
                    <Text style={{fontSize: 24, marginRight: 20, marginLeft: 20}}>{phrase.type}</Text>
                    <Text style={[API.styles.bBig, {textAlign: API.user.isRTL ? "right" : "left"}]}>{API.phrase(phrase.phrase)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Animated.View>
        {Platform.OS == "ios" &&
          <Animated.View style={{transform: [{translateY: this._getPopInt(200, 0)}]}}>
            <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']} style={styles.closeCarrier}>
              <TouchableScale style={[styles.button, {position: "relative", bottom: 10, backgroundColor: "#fca7a7" }]} onPress={() => this.closeModal()}>
                <Svg viewBox="0 0 24 24" width={32} height={32}>
                  <Path fill={"#333"} d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                </Svg>
              </TouchableScale>
            </LinearGradient>
          </Animated.View>
        }
        {Platform.OS == "android" &&
          <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']} style={styles.closeCarrier}>
            <TouchableScale style={[styles.button, {position: "absolute", bottom: 20, backgroundColor: "#fca7a7"}]} onPress={() => this.closeModal()}>
              <Svg viewBox="0 0 24 24" width={32} height={32}>
                <Path fill={"#333"} d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
              </Svg>
            </TouchableScale>
          </LinearGradient>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  head: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5,
    paddingHorizontal: 30,
  },
  modal: {
    flex: 1,
    position: "absolute",
    top: 0,
    width: "100%",
  },
  content: {
    paddingBottom: 130
  },
  cardHolder: {
    justifyContent: "space-around",
    flexDirection: "row",
    paddingTop: 10,
    alignItems: "center",
    paddingBottom: 10
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: "#a5d5ff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  },
  cardMid: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  selectionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingHorizontal: 40
  },
  selectionIcon: {
    marginRight: 20,
    width: 26,
    height: 26
  },
  closeCarrier: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    zIndex: 99,
    width: "100%"
  }
});
