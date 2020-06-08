import React from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import API from '../api';
import titleCase from '../js/titleCase';
import { Image as CachedImage } from "react-native-expo-image-cache";
import * as ScreenOrientation from 'expo-screen-orientation';

import Search from '../components/Search'
import TopBar from '../components/TopBar'
import TouchableScale from '../components/touchable-scale'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cards: [],
      orientation: this.props.navigation.getParam("orientation")
    }
    this.pack = this.props.navigation.getParam("pack");
    this.packs = this.props.navigation.getParam("packs");
    this.packIndex = this.props.navigation.getParam("packIndex");

  }

  componentDidMount(){
    API.hit("Pack:"+this.pack.slug);
    this.fetchCards(this.pack.slug);
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
    ScreenOrientation.removeOrientationChangeListener(this.orientationSubscription);
  }

  async fetchCards(packSlug){
    try {
      let cards = await API.getCards(packSlug);
      this.setState({cards, packSlug})
    } catch(err){
      console.log(err);
    }
  }

  openCards(pack, packIndex){
    this.props.navigation.pop();
    setTimeout(() => {
      this.props.navigation.push("Cards", {pack, packs: this.packs, packIndex, orientation: this.state.orientation});
    }, 100);
  }

  speakTitle(localeTitle){
    API.speak(localeTitle);
    API.haptics("touch");
  }

  renderNavigation(){
    return (
      <View style={styles.navigation}>
        <View style={styles.navigationElement}>
          {this.packIndex != 0 &&
            <TouchableScale onPress={() => this.openCards(this.packs[this.packIndex - 1], this.packIndex - 1)} style={[styles.navigationCategory, {backgroundColor: this.packs[this.packIndex - 1].color, paddingRight: 15}]}>
              <Svg height={24} width={24} viewBox="0 0 24 24" style={{opacity: 0.8}}>
                <Path fill={"#000"} d="M14.71 15.88L10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42z"></Path>
              </Svg>
              <CachedImage uri = {`${API.assetEndpoint}cards/icon/${this.packs[this.packIndex - 1].slug}.png?v=${API.version}`} style={{width: 32, height: 32, margin: 5, marginRight: 8}}/>
              <Text style={styles.navigationCategoryText}>{titleCase(this.packs[this.packIndex - 1].locale)}</Text>
            </TouchableScale>
          }
          {this.packIndex != (this.packs.length - 1) &&
            <TouchableScale onPress={() => this.openCards(this.packs[this.packIndex + 1], this.packIndex + 1)} style={[styles.navigationCategory, {backgroundColor: this.packs[this.packIndex + 1].color, paddingLeft: 15}]}>
              <Text style={styles.navigationCategoryText}>{titleCase(this.packs[this.packIndex + 1].locale)}</Text>
              <CachedImage uri = {`${API.assetEndpoint}cards/icon/${this.packs[this.packIndex + 1].slug}.png?v=${API.version}`} style={{width: 32, height: 32, margin: 5, marginLeft: 8}}/>
              <Svg height={24} width={24} viewBox="0 0 24 24" style={{opacity: 0.8}}>
                <Path fill={"#000"} d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z"></Path>
              </Svg>
            </TouchableScale>
          }
        </View>
      </View>
    );
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={this.pack.color}/>
        <ScrollView style={{backgroundColor: this.pack.color}} contentInsetAdjustmentBehavior="automatic">
          <SafeAreaView>
            <TouchableScale style={[styles.head, {justifyContent: API.user.isRTL ? "flex-end" : "flex-start", flexDirection: "row", alignItems: "center"}]} onPress={() => this.speakTitle(this.pack.locale)}>
              <Text style={[API.styles.h1, {color: "#000", marginHorizontal: 0}]}>{titleCase(this.pack.locale)}</Text>
              <Svg width={26} height={26} viewBox="0 0 24 24" strokeLinecap="round" strokeWidth="2" stroke="#000" fill="none" style={{marginLeft: 5, opacity: 0.7}}>
                <Path stroke="none" d="M0 0h24v24H0z"/>
                <Path d="M0 0h24v24H0z" stroke="none"/>
                <Path d="M15 8a5 5 0 0 1 0 8"/>
                <Path d="M17.7 5a9 9 0 0 1 0 14"/>
                <Path d="M6 15 h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"/>
              </Svg>
            </TouchableScale>
            <View style={styles.board}>
              {this.state.cards.map((card, i) => {
                return (
                  <TouchableScale key={i} onPress={() => this.props.navigation.push("Announcer", {card, pack: this.pack, orientation: this.state.orientation})}
                    style={[this.state.orientation == "portrait" ? styles.cardItem : styles.cardItemLandscape, {height: API.isTablet ? 200 : 130}]}>
                    <View style={styles.cardItemInner}>
                      <CachedImage uri={`${API.assetEndpoint}cards/${this.pack.slug}/${card.slug}.png?v=${API.version}`} style={{width: API.isTablet ? 110 : 70, height: API.isTablet ? 110 : 70, margin: 10, marginBottom: 5}}/>
                      <Text style={[styles.cardItemText, {fontSize: API.isTablet ? 21 : 14}]}>{titleCase(card.title)}</Text>
                    </View>
                  </TouchableScale>
                )
              })}
            </View>
            {this.renderNavigation()}

            <View style={{backgroundColor: "#fff"}}><View style={API.styles.iosBottomPadderSmall}></View></View>
            <View style={API.styles.iosBottomExtraScrollBlocker}></View>
          </SafeAreaView>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  head: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginHorizontal: 30,
    marginVertical: 20,
    marginTop: 10
  },
  board: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  },
  cardItem: {
    width: "33.3%"
  },
  cardItemLandscape: {
    width: "20%"
  },
  cardItemInner: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1, borderRadius: 25,
    margin: 5,
    backgroundColor: "#F7F7F7"
  },
  cardItemText:{
    fontWeight: "normal",
    marginBottom: 10,
    marginTop: 3,
    marginHorizontal: 10,
    textAlign: "center",
    opacity: 0.8
  },
  navigation: {
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
  },
  navigationElement: {
    height: 100,
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  navigationCategory: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 10,
    margin: 7,
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  navigationCategoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.8)"
  }
});
