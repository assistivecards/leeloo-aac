import React from 'react';
import { StyleSheet, Text, View, ScrollView, Animated, ActivityIndicator, Dimensions, TouchableWithoutFeedback, TouchableOpacity, LayoutAnimation, Platform, RefreshControl, Image as RNImage } from 'react-native';
import Constants from 'expo-constants';
import Svg, { Path } from 'react-native-svg';
import { Image } from 'react-native-elements';
import { Image as CachedImage } from "react-native-expo-image-cache";
import { BlurView } from 'expo-blur';

import API from '../api'
import titleCase from '../js/titleCase';

import TopBar from '../components/TopBar'

export default class App extends React.Component {

  state = {
    scrollY: new Animated.Value(0)
  }

  _getInterpolation = (from, to) => {
      const {scrollY} = this.state;

      return scrollY.interpolate({
          inputRange: [0, 140],
          outputRange: [from, to],
          extrapolate: 'clamp',
          useNativeDriver: true
      });
  }

  speak(text){
    API.speak(text);
  }

  render() {
    let user = true;
    let card = this.props.navigation.getParam("card");
    let packSlug = this.props.navigation.getParam("pack");
    this.speak(card.title);
    let width = Dimensions.get("window").width;

    return (
      <BlurView tint="light" intensity={100} style={{flex: 1}}>
        <View style={{backgroundColor: Platform.OS == "android" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0)", flex: 1}}>
        <ScrollView style={{flex: 1, zIndex: 10}}
        scrollEventThrottle={16}
        overScrollMode={'never'}
        onScroll={Animated.event(
            [
              {
                 nativeEvent: {contentOffset:{y:this.state.scrollY}}
              }
            ]
        )}
        refreshControl={
          <RefreshControl onRefresh={() => this.props.navigation.pop()} />
        }>



          <View style={[styles.head, {marginTop: 100}]}>
            <View style={styles.cardHolder}>
              <Animated.View onPress={() => this.speak(card.slug)} style={[styles.button, {right: this._getInterpolation(0, 30)}]}>
                <Svg viewBox="0 0 24 24" width={32} height={32}>
                  <Path fill={"#29395F"} d="M12 4V2.21c0-.45-.54-.67-.85-.35l-2.8 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.32.31.86.09.86-.36V6c3.31 0 6 2.69 6 6 0 .79-.15 1.56-.44 2.25-.15.36-.04.77.23 1.04.51.51 1.37.33 1.64-.34.37-.91.57-1.91.57-2.95 0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-.79.15-1.56.44-2.25.15-.36.04-.77-.23-1.04-.51-.51-1.37-.33-1.64.34C4.2 9.96 4 10.96 4 12c0 4.42 3.58 8 8 8v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V18z"/>
                </Svg>
              </Animated.View>
              <View style={styles.cardMid}>
                <Animated.View style={{height: this._getInterpolation(150, 150), width: this._getInterpolation(150, 150), borderRadius: this._getInterpolation(30, 0), overflow: "hidden", backgroundColor: "transparent", padding: this._getInterpolation(10, 10)}}>
                  <CachedImage uri={`https://leeloo.dreamoriented.org/cdn/${packSlug}/${card.slug}@2x.png`} style={{width:"100%", height: "100%"}} PlaceholderContent={<ActivityIndicator />} resizeMode="contain" placeholderStyle={{backgroundColor: "#F7F9FB"}}/>
                </Animated.View>
              </View>
              <Animated.View style={[styles.button, {left: this._getInterpolation(0, 30)}]}>
                <Svg viewBox="0 0 24 24" width={32} height={32}>
                  <Path fill={"#29395F"} d="M10 8.5v7c0 .41.47.65.8.4l4.67-3.5c.27-.2.27-.6 0-.8L10.8 8.1c-.33-.25-.8-.01-.8.4zm1-5.27c0-.64-.59-1.13-1.21-.99-1.12.26-2.18.7-3.12 1.3-.53.34-.61 1.1-.16 1.55.32.32.83.4 1.21.16.77-.49 1.62-.85 2.54-1.05.44-.1.74-.51.74-.97zM5.1 6.51c-.46-.45-1.21-.38-1.55.16-.6.94-1.04 2-1.3 3.12-.14.62.34 1.21.98 1.21.45 0 .87-.3.96-.74.2-.91.57-1.77 1.05-2.53.26-.39.18-.9-.14-1.22zM3.23 13c-.64 0-1.13.59-.99 1.21.26 1.12.7 2.17 1.3 3.12.34.54 1.1.61 1.55.16.32-.32.4-.83.15-1.21-.49-.76-.85-1.61-1.05-2.53-.09-.45-.5-.75-.96-.75zm3.44 7.45c.95.6 2 1.04 3.12 1.3.62.14 1.21-.35 1.21-.98 0-.45-.3-.87-.74-.96-.91-.2-1.77-.57-2.53-1.05-.39-.24-.89-.17-1.21.16-.46.44-.39 1.19.15 1.53zM22 12c0 4.73-3.3 8.71-7.73 9.74-.62.15-1.22-.34-1.22-.98 0-.46.31-.86.75-.97 3.55-.82 6.2-4 6.2-7.79s-2.65-6.97-6.2-7.79c-.44-.1-.75-.51-.75-.97 0-.64.6-1.13 1.22-.98C18.7 3.29 22 7.27 22 12z"/>
                </Svg>
              </Animated.View>
            </View>
          </View>

          <View style={{flexDirection: "column", alignItems: "center"}}>
            <Text style={[API.styles.h2, {marginTop: 0}]}>{titleCase(card.title)}</Text>
            <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 15}]}>{packSlug}</Text>
          </View>
          <View style={styles.content}>
              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/n/sushi')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>I want to have breakfast</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/n/family')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>I don't like having breakfast</Text>
              </View>

              <View style={[styles.selectionItem, {backgroundColor: "#eee"}]}>
                <RNImage source={require('@moqada/rn-twemoji/n/apple')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>I want you to prepare breakfast for me</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/n/handbag')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>Can I help you prepare breakfast?</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/c/1f467')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>I like eating breakfast</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/c/1f30b')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>I want you to prepare breakfast for me</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/c/1f467')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>Can I help you prepare breakfast?</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/c/1f309')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>I like eating breakfast</Text>
              </View>

              <View style={[styles.selectionItem, {backgroundColor: "#eee"}]}>
                <RNImage source={require('@moqada/rn-twemoji/c/1f191')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>I want you to prepare breakfast for meyou to prepare breakfast for meyou to prepare breakfast for me</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/c/1f43a')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>Can I help you prepare breakfast?</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/c/1f439')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>I like eating breakfast</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/c/1f437')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>I want you to prepare breakfast for me</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/c/1f436')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>Can I help you prepare breakfast? I help you prepare breakfast?</Text>
              </View>

              <View style={styles.selectionItem}>
                <RNImage source={require('@moqada/rn-twemoji/c/1f43c')} style={styles.selectionIcon} />
                <Text style={API.styles.bBig}>I like eating breakfast</Text>
              </View>
          </View>
        </ScrollView>
        </View>
        </BlurView>


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
  content: {
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
    alignItems: "center",
    position: "relative"
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
  }
});
