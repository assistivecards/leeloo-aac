import React from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity } from 'react-native';

import API from '../api';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image as CachedImage } from "react-native-expo-image-cache";

import Search from '../components/Search'

const set = require("../data/packs/animals.json")

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      packSlug: API.user.active_profile ? API.user.active_profile.packs[0] : "animals",
      cards: []
    }
  }

  componentDidMount(){
    API.hit("Home");
    this.fetchCards(this.state.packSlug);
    API.event.on("refresh", this._refreshHandler)
  }

  async fetchCards(packSlug){
    let cards = await fetch("https://leeloo.dreamoriented.org/json/"+packSlug+".json").then(res => res.json());
    this.setState({cards, packSlug})
  }

  _refreshHandler = () => {
    this.forceUpdate();
  };

  componentWillUnmount(){
    API.event.removeListener("refresh", this._refreshHandler)
  }


  openSettings(){
    if(API.isOnline){
      this.props.navigation.navigate("Settings");
    }else{
      alert("You are offline!");
    }
  }


  changePack(packSlug){
    this.fetchCards(packSlug);
  }


  render() {
    return(
      <View style={{flex: 1}}>
        <SafeAreaView style={styles.header}>
          <Search/>
          <TouchableOpacity style={styles.avatar} onPress={() => this.openSettings()}>
            <Image source={{uri: "https://www.pngrepo.com/png/132875/180/boy.png"}}
              style={{width: 40, height: 40, position: "relative", top: 4}}
              />
          </TouchableOpacity>
        </SafeAreaView>

        {
          API.user.active_profile && API.user.active_profile.packs.map((packSlug, i) => {
            return <TouchableOpacity key={i} onPress={() => this.changePack(packSlug)}><Text>{packSlug}</Text></TouchableOpacity>
          })
        }
        <ScrollView>
        {this.state.cards.map((card, i) => {
          return (
            <TouchableOpacity key={i} onPress={() => this.props.navigation.push("Announcer", {card, pack: this.state.packSlug})}>
              <CachedImage uri = {`https://leeloo.dreamoriented.org/cdn/${this.state.packSlug}/${card.slug}.png`} style={{width: 100, height: 100}}/>
              <Text>{card.title}</Text>
            </TouchableOpacity>
          )
        })}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  carrier: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%"
  },
  carrierSV: {
    width: "100%",
    height: Dimensions.get("window").height - 50
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FB"
  },
  categories: {
    backgroundColor: "#F7F9FB",
    height: 10
  },
  avatar: {
    marginRight: 20, padding: 2, backgroundColor: "#a5d5ff", borderRadius: 40, overflow: "hidden"
  }
});
