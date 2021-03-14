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

    this.pack = {
      slug: "favorites",
      locale: API.t("favorites"),
      color: "#e3fff0"
    }
  }

  componentDidMount(){
    API.hit("Favorites");
    API.getFavorites().then(cards => {
      this.setState({cards});
    })

    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      API.getFavorites().then(cards => {
        this.setState({cards});
      })
    });

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
    this.focusListener.remove();
  }

  speakTitle(localeTitle){
    API.speak(localeTitle);
    API.haptics("touch");
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={this.pack.color}/>
        <ScrollView style={{backgroundColor: this.pack.color}} contentInsetAdjustmentBehavior="automatic">
          <SafeAreaView>
            <TouchableScale style={[styles.head, {justifyContent: API.isRTL() ? "flex-end" : "flex-start", flexDirection: "row", alignItems: "center"}]} onPress={() => this.speakTitle(this.pack.locale)}>
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
              {(this.state.cards.length == 0) &&
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <Svg width={40} height={40} viewBox="0 0 24 24" strokeLinecap="round" strokeWidth="2" stroke="#000" fill="none" style={{margin: 10}}>
                    <Path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z"/>
                  </Svg>
                  <Text style={[API.styles.h2, { textAlign: "center" }]}>{API.t("no_favorites_title")}</Text>
                  <Text style={[API.styles.p, { textAlign: "center" }]}>{API.t("no_favorites_desc1")}</Text>
                  <Text style={[API.styles.p, { textAlign: "center" }]}>{API.t("no_favorites_desc2")}</Text>
                </View>
              }
              {this.state.cards.map((card, i) => {
                return (
                  <TouchableScale key={i} onPress={() => this.props.navigation.push("Announcer", {card, pack: {slug: card.packSlug}, orientation: this.state.orientation})}
                    style={[this.state.orientation == "portrait" ? styles.cardItem : styles.cardItemLandscape, {height: API.isTablet ? 200 : 130}]}>
                    <View style={styles.cardItemInner}>
                      <CachedImage uri={`${API.assetEndpoint}cards/${card.packSlug}/${card.slug}.png?v=${API.version}`} style={{width: API.isTablet ? 110 : 70, height: API.isTablet ? 110 : 70, margin: 10, marginBottom: 5}}/>
                      <Text style={[styles.cardItemText, {fontSize: API.isTablet ? 21 : 14}]}>{titleCase(card.title)}</Text>
                    </View>
                  </TouchableScale>
                )
              })}
            </View>
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
    color: "#000",
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
