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
    this.packsInUse = this.props.navigation.getParam("packsInUse");
    this.add = this.props.navigation.getParam("add");
    this.state = {
      data: [],
      changed: false
    }
  }

  componentDidMount(){
    API.hit("Packs");
  }

  async componentDidMount(){
    let data = await this.getDraggableData(this.packs);
    this.setState({data});
  }

  async getDraggableData(packs){
    let allPacks = await API.getPacks();
    return allPacks.filter(pack => !this.packsInUse.includes(pack.name));
  }

  async addAction(packName){
    await this.add(packName);
    this.props.navigation.pop();
  }

  renderItem = (item) => {

    return (
      <View key={item.name} style={styles.packItem}>
        <View style={[styles.pack, {backgroundColor: item.color ? item.color : "#F5F5F7"}]}>
          <CachedImage uri={`https://leeloo.dreamoriented.org/cdn/icon/${item.name}.png?v=${API.version}`} style={styles.packImage} />
        </View>
        <View>
          <Text style={[API.styles.h3, {marginLeft: 0, marginBottom: 3, marginTop: 0}]}>{item.name[0].toUpperCase() + item.name.substr(1)}</Text>
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
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"}/>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
          <View style={styles.head}>
            <Text style={API.styles.h1}>Add Packs</Text>
            <Text style={API.styles.pHome}>Choose a pack that you want to enable for this profile.</Text>
          </View>

          <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15, paddingHorizontal: 25}}>
           {this.state.data.map(pack => this.renderItem(pack))}
          </View>
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#6989FF",
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5
  },
  packItem: {
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)"
  },
  pack: {
    width: 70,
    height: 70,
    borderRadius: 15,
    padding: 5, backgroundColor: "#F5F5F7",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  packImage: {
    width: 50,
    height: 50,
  },
  premium: {
    backgroundColor: "#6989FF",
    height: 24,
    width: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    backgroundColor: "#6989FF",
    height: 30,
    width: 60,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  }
});
