import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, TouchableWithoutFeedback, TouchableOpacity, LayoutAnimation, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import Svg, { Path } from 'react-native-svg';
import { Image } from 'react-native-elements';

import API from '../api'
import titleCase from '../js/titleCase';

import TopBar from '../components/TopBar'

var CustomLayoutLinear = {
  duration: 150,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  }
};

export default class App extends React.Component {

  state = {
    userSettings: false
  }

  openAccountSettings(){
    this.props.navigation.push("Settings");

  }

  render() {
    let user = true;
    let card = this.props.navigation.getParam("card");

    let width = Dimensions.get("window").width;

    return (
      <>
        <TouchableWithoutFeedback onPress={() => this.props.navigation.pop()}>
          <View style={{height: 100}}></View>
        </TouchableWithoutFeedback>

        <View style={[styles.head, {marginBottom: 0, borderTopLeftRadius: 40, borderTopRightRadius: 40}]}>
          <View style={{alignItems: "center", justifyContent: "center"}}>
            <View style={{height: 7, width: 55, backgroundColor: "#ccc", borderRadius: 4, marginTop: 3}}></View>
          </View>
          <View style={styles.cardHolder}>
            <View style={styles.button}>
              <Svg viewBox="0 0 24 24" width={32} height={32}>
                <Path fill={"#29395F"} d="M12 4V2.21c0-.45-.54-.67-.85-.35l-2.8 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.32.31.86.09.86-.36V6c3.31 0 6 2.69 6 6 0 .79-.15 1.56-.44 2.25-.15.36-.04.77.23 1.04.51.51 1.37.33 1.64-.34.37-.91.57-1.91.57-2.95 0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-.79.15-1.56.44-2.25.15-.36.04-.77-.23-1.04-.51-.51-1.37-.33-1.64.34C4.2 9.96 4 10.96 4 12c0 4.42 3.58 8 8 8v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V18z"/>
              </Svg>
            </View>
            <View style={styles.cardMid}>
              <View style={{width: 150, height: 150, borderRadius: 30, overflow: "hidden", backgroundColor: "transparent", padding: 10}}>
                <Image source={{uri: `https://www.pngrepo.com/png/${card.id}/300/${card.slug}.png`}} style={{width: 130, height: 130}} PlaceholderContent={<ActivityIndicator />} resizeMode="contain" placeholderStyle={{backgroundColor: "#F7F9FB"}}/>
              </View>
              <Text style={API.styles.h4}>{titleCase(card.title)}</Text>
              <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 0}]}>Breakfast</Text>
            </View>
            <View style={styles.button}>
              <Svg viewBox="0 0 24 24" width={32} height={32}>
                <Path fill={"#29395F"} d="M10 8.5v7c0 .41.47.65.8.4l4.67-3.5c.27-.2.27-.6 0-.8L10.8 8.1c-.33-.25-.8-.01-.8.4zm1-5.27c0-.64-.59-1.13-1.21-.99-1.12.26-2.18.7-3.12 1.3-.53.34-.61 1.1-.16 1.55.32.32.83.4 1.21.16.77-.49 1.62-.85 2.54-1.05.44-.1.74-.51.74-.97zM5.1 6.51c-.46-.45-1.21-.38-1.55.16-.6.94-1.04 2-1.3 3.12-.14.62.34 1.21.98 1.21.45 0 .87-.3.96-.74.2-.91.57-1.77 1.05-2.53.26-.39.18-.9-.14-1.22zM3.23 13c-.64 0-1.13.59-.99 1.21.26 1.12.7 2.17 1.3 3.12.34.54 1.1.61 1.55.16.32-.32.4-.83.15-1.21-.49-.76-.85-1.61-1.05-2.53-.09-.45-.5-.75-.96-.75zm3.44 7.45c.95.6 2 1.04 3.12 1.3.62.14 1.21-.35 1.21-.98 0-.45-.3-.87-.74-.96-.91-.2-1.77-.57-2.53-1.05-.39-.24-.89-.17-1.21.16-.46.44-.39 1.19.15 1.53zM22 12c0 4.73-3.3 8.71-7.73 9.74-.62.15-1.22-.34-1.22-.98 0-.46.31-.86.75-.97 3.55-.82 6.2-4 6.2-7.79s-2.65-6.97-6.2-7.79c-.44-.1-.75-.51-.75-.97 0-.64.6-1.13 1.22-.98C18.7 3.29 22 7.27 22 12z"/>
              </Svg>
            </View>
          </View>
        </View>
        <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}} refreshControl={
          <RefreshControl onRefresh={() => this.props.navigation.pop()} />
        }>
          <View style={styles.content}>
            <View style={styles.userSettings}>
              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M17.73 12.02l3.98-3.98c.39-.39.39-1.02 0-1.41l-4.34-4.34c-.39-.39-1.02-.39-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63c-.39.39-.39 1.02 0 1.41l3.98 3.98L2.25 16c-.39.39-.39 1.02 0 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.2.2.45.29.71.29.26 0 .51-.1.71-.29l4.34-4.34c.39-.39.39-1.02 0-1.41l-3.99-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2.66 9.34l-3.63-3.62 3.63-3.63 3.62 3.62-3.62 3.63z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>I want to have breakfast</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M18 4v1h-2V4c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H6V4c0-.55-.45-1-1-1s-1 .45-1 1v16c0 .55.45 1 1 1s1-.45 1-1v-1h2v1c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1h2v1c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1s-1 .45-1 1zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>I don't like having breakfast</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M20 12c0-2.54-1.19-4.81-3.04-6.27l-.68-4.06C16.12.71 15.28 0 14.31 0H9.7c-.98 0-1.82.71-1.98 1.67l-.67 4.06C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27l.67 4.06c.16.96 1 1.67 1.98 1.67h4.61c.98 0 1.81-.71 1.97-1.67l.68-4.06C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>I want you to prepare breakfast for me</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M19.29 17.29L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.9 0 1.34-1.08.71-1.71zM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>Can I help you prepare breakfast?</Text>
              </View>

              <View style={[styles.selectionItem, {borderBottomWidth: 0}]}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M3 18c0 .55.45 1 1 1h5v-2H4c-.55 0-1 .45-1 1zM3 6c0 .55.45 1 1 1h9V5H4c-.55 0-1 .45-1 1zm10 14v-1h7c.55 0 1-.45 1-1s-.45-1-1-1h-7v-1c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1zM7 10v1H4c-.55 0-1 .45-1 1s.45 1 1 1h3v1c0 .55.45 1 1 1s1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1zm14 2c0-.55-.45-1-1-1h-9v2h9c.55 0 1-.45 1-1zm-5-3c.55 0 1-.45 1-1V7h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V4c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>I like eating breakfast</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M20 12c0-2.54-1.19-4.81-3.04-6.27l-.68-4.06C16.12.71 15.28 0 14.31 0H9.7c-.98 0-1.82.71-1.98 1.67l-.67 4.06C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27l.67 4.06c.16.96 1 1.67 1.98 1.67h4.61c.98 0 1.81-.71 1.97-1.67l.68-4.06C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>I want you to prepare breakfast for me</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M19.29 17.29L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.9 0 1.34-1.08.71-1.71zM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>Can I help you prepare breakfast?</Text>
              </View>

              <View style={[styles.selectionItem, {borderBottomWidth: 0}]}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M3 18c0 .55.45 1 1 1h5v-2H4c-.55 0-1 .45-1 1zM3 6c0 .55.45 1 1 1h9V5H4c-.55 0-1 .45-1 1zm10 14v-1h7c.55 0 1-.45 1-1s-.45-1-1-1h-7v-1c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1zM7 10v1H4c-.55 0-1 .45-1 1s.45 1 1 1h3v1c0 .55.45 1 1 1s1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1zm14 2c0-.55-.45-1-1-1h-9v2h9c.55 0 1-.45 1-1zm-5-3c.55 0 1-.45 1-1V7h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V4c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>I like eating breakfast</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M20 12c0-2.54-1.19-4.81-3.04-6.27l-.68-4.06C16.12.71 15.28 0 14.31 0H9.7c-.98 0-1.82.71-1.98 1.67l-.67 4.06C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27l.67 4.06c.16.96 1 1.67 1.98 1.67h4.61c.98 0 1.81-.71 1.97-1.67l.68-4.06C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>I want you to prepare breakfast for meyou to prepare breakfast for meyou to prepare breakfast for me</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M19.29 17.29L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.9 0 1.34-1.08.71-1.71zM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>Can I help you prepare breakfast?</Text>
              </View>

              <View style={[styles.selectionItem, {borderBottomWidth: 0}]}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M3 18c0 .55.45 1 1 1h5v-2H4c-.55 0-1 .45-1 1zM3 6c0 .55.45 1 1 1h9V5H4c-.55 0-1 .45-1 1zm10 14v-1h7c.55 0 1-.45 1-1s-.45-1-1-1h-7v-1c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1zM7 10v1H4c-.55 0-1 .45-1 1s.45 1 1 1h3v1c0 .55.45 1 1 1s1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1zm14 2c0-.55-.45-1-1-1h-9v2h9c.55 0 1-.45 1-1zm-5-3c.55 0 1-.45 1-1V7h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V4c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>I like eating breakfast</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M20 12c0-2.54-1.19-4.81-3.04-6.27l-.68-4.06C16.12.71 15.28 0 14.31 0H9.7c-.98 0-1.82.71-1.98 1.67l-.67 4.06C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27l.67 4.06c.16.96 1 1.67 1.98 1.67h4.61c.98 0 1.81-.71 1.97-1.67l.68-4.06C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>I want you to prepare breakfast for me</Text>
              </View>

              <View style={styles.selectionItem}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M19.29 17.29L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.9 0 1.34-1.08.71-1.71zM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>Can I help you prepare breakfast? I help you prepare breakfast?</Text>
              </View>

              <View style={[styles.selectionItem, {borderBottomWidth: 0}]}>
                <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon}>
                  <Path fill={"#666"} d="M3 18c0 .55.45 1 1 1h5v-2H4c-.55 0-1 .45-1 1zM3 6c0 .55.45 1 1 1h9V5H4c-.55 0-1 .45-1 1zm10 14v-1h7c.55 0 1-.45 1-1s-.45-1-1-1h-7v-1c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1zM7 10v1H4c-.55 0-1 .45-1 1s.45 1 1 1h3v1c0 .55.45 1 1 1s1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1zm14 2c0-.55-.45-1-1-1h-9v2h9c.55 0 1-.45 1-1zm-5-3c.55 0 1-.45 1-1V7h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V4c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1z"></Path>
                </Svg>
                <Text style={[API.styles.b, {fontSize: 15}]}>I like eating breakfast</Text>
              </View>
            </View>

          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#F7F9FB",
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5,
    paddingHorizontal: 30,
  },
  content: {
    backgroundColor: "#fff",
    position: "relative",
    padding: 10
  },
  cardHolder: {
    justifyContent: "space-around",
    flexDirection: "row",
    paddingTop: 10,
    alignItems: "center"
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
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#43B1D9",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.54,
    elevation: 3
  },
  selectionCarrier: {
    marginTop: 10
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
  userSettings: {
    marginHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: API.config.theme.mainBorderColor
  },
  appSettings: {
    marginHorizontal: 20,
  },
  cover: {
    width: "110%",
    height: "110%",
    backgroundColor: "rgba(255,255,255,0.3)",
    position: "absolute",
    top: -10,
    left: 0,
    zIndex: 99
  }
});
