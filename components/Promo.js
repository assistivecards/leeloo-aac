import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, TextInput, KeyboardAvoidingView } from 'react-native';

import API from '../api'

export default class App extends React.Component {

  render(){
    return (
      <TouchableOpacity onPress={() => this.props.showPremium()} style={styles.promo}>
        <View style={{marginLeft: 20, position: "relative", zIndex: 9999}}>
          <Text style={{fontSize: 21, color: "#fff", fontWeight: "bold", marginBottom: 5}}>{API.t("premium_promo_title")}</Text>
          <Text style={{fontSize: 14, color: "#fff", marginBottom: 2}}>{API.t("premium_promo_desc1")}</Text>
          <Text style={{fontSize: 14, color: "#fff", marginBottom: 2}}>{API.t("premium_promo_desc2")}</Text>
        </View>
        <Image source={require("../assets/promo.png")} style={{width: 200, height: 150, position: "absolute", bottom: -39, right: -33}} resizeMode={"contain"} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  promo: {
    height: 130, backgroundColor: "#6989ff",
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    marginTop: 20
  }
});
