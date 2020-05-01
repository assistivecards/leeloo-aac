import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import { Image as CachedImage } from "react-native-expo-image-cache";

import API from '../api';
import TopBar from '../components/TopBar'
import Svg, { Path } from 'react-native-svg';

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.packs = this.props.navigation.getParam("packs");
    this.add = this.props.navigation.getParam("add");
    this.state = {
      data: [],
      changed: false
    }
  }

  async componentDidMount(){
    let data = await this.getDraggableData(this.packs);
    this.setState({data});
  }

  async getDraggableData(packs){
    let allPacks = await API.getPacks();

    return allPacks;
  }

  async addAction(packName){
    await this.add(packName);
    this.props.navigation.pop();
  }

  renderItem = (item) => {

    return (
      <View activeOpacity={0.9} key={item.name} style={styles.packItem}>
        <View style={styles.pack}>
          <CachedImage uri={`https://leeloo.dreamoriented.org/cdn/icon/${item.name}.png`} style={styles.packImage} />
        </View>
        <View>
          <Text style={API.styles.h4}>{item.name[0].toUpperCase() + item.name.substr(1)}</Text>
          <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 0}]}>{API.t("settings_cards", item.count)}</Text>
        </View>
        <View style={{flex: 1, justifyContent: "flex-end", alignItems: "flex-end", flexDirection: "row", alignItems: "center"}}>
          {false &&
            <View style={styles.premium}><Text style={{fontWeight: "600", fontSize: 12, color: "#fff"}}>Premium</Text></View>
          }
          <TouchableOpacity onPress={() => this.addAction(item.name)} style={styles.button}>
            <Text style={{color: "#fff", fontWeight: "bold"}}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#F7F9FB"}/>
        <ScrollView style={{flex: 1, backgroundColor: "#F7F9FB"}}>
          <View style={styles.head}>
            <Text style={API.styles.h1}>Add Packs</Text>
            <Text style={API.styles.p}>Choose a pack that you want to enable for this profile.</Text>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 30, backgroundColor: "#fff"}}>
           {this.state.data.map(pack => this.renderItem(pack))}
          </View>
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#F7F9FB",
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5
  },
  addNew: {
    height: 50,
    borderRadius: 8,
    padding: 5,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15
  },
  packImage: {
    width: 45,
    height: 45
  },
  packItem: {
    flexDirection: "row",
    paddingBottom: 10,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)"
  },
  premium: {
    backgroundColor: "#4e88c5",
    height: 24,
    width: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  pack: {
    width: 55,
    height: 55,
    borderRadius: 8,
    padding: 5, backgroundColor: "#fff",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  button: {
    backgroundColor: "#4e88c5",
    height: 30,
    width: 60,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  }
});
