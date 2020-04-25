import React from 'react';
import { StyleSheet, ScrollView, Text, View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import API from '../api';

import TopBar from '../components/TopBar'

export default class App extends React.Component {

  render() {
    this.link = this.props.navigation.getParam("link");
    return (
      <View style={{flex: 1, flexDirection: "column"}}>
        <TopBar backgroundColor={"#fff"} back={() => {
          this.props.navigation.pop();
        }}/>
        <WebView source={{uri: this.link}} style={{flex: 1}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    padding: 15,
  },
  head: {
    backgroundColor: "#DBEFEE",
    flexDirection: "row",
    padding: 10
  },
  tabs: {
    backgroundColor: "#DBEFEE",
    height: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  tabItem: {
    height: 50,
    justifyContent: "center",
    position: "relative"
  },
  tabText: {
    fontFamily: "rubik-semi",
    fontSize: 15,
    color: "#0A2549",
    opacity: 0.6
  },
  tabActive: {
    opacity: 0.8
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: "80%",
    left: "10%",
    height: 5,
    backgroundColor: "#43B1D9",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  imageCarrier: {
    flex: 1,
    marginLeft: 20,
    marginRight: 10,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  image: {
    opacity: 0.9,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.3)",
  }
});
