import React from 'react';
import { Alert, StyleSheet, Text, View, ScrollView, Animated, ActivityIndicator, Dimensions, TouchableWithoutFeedback, TouchableOpacity, LayoutAnimation, Platform, RefreshControl, PanResponder, Image as RNImage, Easing, SafeAreaView  } from 'react-native';
import Constants from 'expo-constants';
import Svg, { Path } from 'react-native-svg';
import { Image } from 'react-native-elements';
import { Image as CachedImage } from "react-native-expo-image-cache";
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as ScreenOrientation from 'expo-screen-orientation';
import prompt from 'react-native-prompt-android';

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
      scrollerHeight: 0,
      isFavorite: false,
      altPhrases: []
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
        },
      ],{useNativeDriver: false}),
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

  syncAltPhrases(){
    API.getAltPhrases(this.pack.slug, this.card.slug).then((altPhrases) => {
      console.log(this.pack.slug, this.card.slug, altPhrases);
      this.setState({altPhrases});
    });
  }

  componentDidMount(){
    API.isFavorite(this.card).then((isFavorite) => {
      this.setState({isFavorite})
    });

    this.syncAltPhrases();

    Animated.timing(
      this.state.pop,
      {
        toValue: 1,
	      duration: 200,
        useNativeDriver: false
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
        easing: Easing.in(Easing.ease),
        useNativeDriver: false
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

  favorite(){
    if(this.state.isFavorite){
      this.setState({isFavorite: false});
      this.card.packSlug = this.pack.slug;
      API.removeFavorite(this.card);
    }else{
      this.setState({isFavorite: true});
      this.card.packSlug = this.pack.slug;
      API.addFavorite(this.card);
    }
  }

  async removeAltPhrase(altPhrase){
    await API.removeAltPhrase(altPhrase.packSlug, altPhrase.cardSlug, altPhrase.altText);
    Alert.alert(
      API.t("custom_phrase_removed"),
      API.t("custom_phrase_removed_desc")
    );
    this.syncAltPhrases();
  }

  addAltPhrase(){
    if(API.isPremium()){
      prompt(
        API.t("custom_phrase_add"),
        API.t("custom_phrase_add_desc"),
        [
         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
         {text: 'OK', onPress: text => {
           API.addAltPhrase(this.pack.slug, this.card.slug, text).then(() => {
             this.syncAltPhrases();
           })
         }},
        ],
        {
            type: 'plain-text',
            cancelable: false,
            defaultValue: '',
            placeholder: API.t("custom_phrase_add_new_phrase")
        }
      )
    }else{
      this.props.navigation.pop();
      this.props.navigation.push("Premium");
    }
  }

  renderAltPhrases(altPhrases){
    if(altPhrases.length){
      return altPhrases.map((altPhrase, i) => {
        return(
          <TouchableOpacity style={[styles.selectionItem, {flexDirection: API.isRTL() ? "row-reverse" : "row"}]} key={"alt"+i} onLongPress={() => this.speak(altPhrase.altText)} delayLongPress={16}>
            <TouchableOpacity onPress={() => this.removeAltPhrase(altPhrase)} style={{position: "absolute", left: 0, top: 7}}>
              <Text style={{fontSize: 10, padding: 20}}>{"❌"}</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 24, marginRight: 20, marginLeft: 20}}>{altPhrases.emoji ? altPhrase.emoji : "🗣️"}</Text>
            <Text style={[API.styles.bBig, {textAlign: API.isRTL() ? "right" : "left"}]}>{altPhrase.altText}</Text>
          </TouchableOpacity>
        );
      });
    }
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
            }} style={{flexDirection: this.state.orientation == "portrait" ? "column" : "row"}}>
            <View style={this.state.orientation == "portrait" ? {overflow: "hidden"} : {width:  400}}>
              <View style={[styles.head, {paddingTop: this.state.orientation == "portrait" ? 100 : 50}]}>
                <View style={styles.cardHolder}>
                  <TouchableScale onLongPress={() => this.speak(this.card.title)} delayLongPress={16} style={[styles.button, {right: 0}]}>
                    <Svg viewBox="0 0 24 24" width={32} height={32}>
                      <Path fill={"#333"} d="M12 4V2.21c0-.45-.54-.67-.85-.35l-2.8 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.32.31.86.09.86-.36V6c3.31 0 6 2.69 6 6 0 .79-.15 1.56-.44 2.25-.15.36-.04.77.23 1.04.51.51 1.37.33 1.64-.34.37-.91.57-1.91.57-2.95 0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-.79.15-1.56.44-2.25.15-.36.04-.77-.23-1.04-.51-.51-1.37-.33-1.64.34C4.2 9.96 4 10.96 4 12c0 4.42 3.58 8 8 8v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V18z"/>
                    </Svg>
                  </TouchableScale>
                  <TouchableScale style={styles.cardMid} onLongPress={() => this.speak(this.card.title)} delayLongPress={16} >
                    <Animated.View style={{height: 150, width: 150, borderRadius: 0, overflow: "hidden", backgroundColor: "transparent", padding: 10}}>
                      <CachedImage uri={`${API.assetEndpoint}cards/${this.pack.slug}/${this.card.slug}.png?v=${API.version}`} style={{width:"100%", height: "100%"}} PlaceholderContent={<ActivityIndicator />} resizeMode="contain" placeholderStyle={{backgroundColor: "#F7F9FB"}}/>
                    </Animated.View>
                  </TouchableScale>
                  <TouchableScale onLongPress={() => this.favorite()} delayLongPress={16} style={[styles.button, {left: 0}]}>
                    <Svg viewBox="0 0 24 24" width={32} height={32} strokeLinecap="round" strokeWidth="2" stroke={this.state.isFavorite ? "#EFEF1D" : "#333"} fill="none" >
                      <Path fill={this.state.isFavorite ? "#EFEF1D" : "transparent"} d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z"/>
                    </Svg>
                  </TouchableScale>
                </View>
              </View>

              <View style={{flexDirection: "column", alignItems: "center"}}>
                <Text style={[API.styles.h2, {marginTop: 0}]}>{titleCase(this.card.title)}</Text>
                <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 15}]}>{this.pack.locale}</Text>
              </View>
            </View>
            <View style={[styles.content, {flex: 2, paddingTop: this.state.orientation == "portrait" ? 0 : 50}]}>
              {this.card.phrases.map((phrase, pi) => {
                return(
                  <TouchableOpacity style={[styles.selectionItem, {flexDirection: API.isRTL() ? "row-reverse" : "row"}]} key={pi} onLongPress={() => this.speak(API.phrase(phrase.phrase))} delayLongPress={16}>
                    <Text style={{fontSize: 24, marginRight: 20, marginLeft: 20}}>{phrase.type}</Text>
                    <Text style={[API.styles.bBig, {textAlign: API.isRTL() ? "right" : "left"}]}>{API.phrase(phrase.phrase)}</Text>
                  </TouchableOpacity>
                );
              })}
              {this.renderAltPhrases(this.state.altPhrases)}
              <TouchableOpacity style={[styles.selectionItem, {flexDirection: API.isRTL() ? "row-reverse" : "row"}]} onLongPress={() => this.addAltPhrase()} delayLongPress={16}>
                <Text style={{fontSize: 24, marginRight: 20, marginLeft: 20}}>➕</Text>
                <Text style={[API.styles.bBig, {textAlign: API.isRTL() ? "right" : "left"}]}>{API.phrase(API.t("custom_phrase_add"))}</Text>
                {!API.isPremium() &&
                  <TouchableOpacity onPress={() => this.props.navigation.push("Premium")} style={[styles.buttonSub, {backgroundColor: "#a2ddfd"}]}>
                    <Text style={{color: "#3e455b", fontWeight: "bold", fontSize: 11, lineHeight: 20}}>Premium</Text>
                  </TouchableOpacity>
                }
              </TouchableOpacity>
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
  buttonSub: {
    backgroundColor: "#6989FF",
    height: 26,
    borderRadius: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center"
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
