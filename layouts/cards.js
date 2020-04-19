import React from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity } from 'react-native';

import API from '../api';

import Search from '../components/Search'

const set = require("../data/set.json");

export default class Setting extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <SafeAreaView style={styles.header}>
          <Search/>
          <TouchableOpacity style={styles.avatar} onPress={() => this.props.navigation.navigate("Profile")}>
            <Image source={{uri: "https://www.pngrepo.com/png/132875/180/boy.png"}}
              style={{width: 40, height: 40, position: "relative", top: 4}}
              />
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.categories}></View>
        <ScrollView>
        {set.map(setItem => {
          return <TouchableOpacity key={setItem.id} onPress={() => this.props.navigation.push("Announcer", {card: setItem})}>
            <Image source={{uri: `https://www.pngrepo.com/png/${setItem.id}/180/${setItem.slug}.png`}} style={{width: 100, height: 100}}/>
            <Text>{setItem.title}</Text>
          </TouchableOpacity>
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
