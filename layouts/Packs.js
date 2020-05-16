import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import { Image as CachedImage } from "react-native-expo-image-cache";

import API from '../api';
import titleCase from '../js/titleCase';
import TopBar from '../components/TopBar'
import Svg, { Path } from 'react-native-svg';

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.packsInUse = this.props.navigation.getParam("packsInUse");
    this.add = this.props.navigation.getParam("add");
    this.state = {
      data: [],
      changed: false
    }
  }

  componentDidMount(){
    API.hit("AddPacks");
  }

  async componentDidMount(){
    let data = await this.getPacks();
    this.setState({data});
  }

  async getPacks(){
    let allPacks = await API.getPacks(true);
    return allPacks.filter(pack => !this.packsInUse.includes(pack.slug));
  }

  async addAction(packSlug){
    await this.add(packSlug);
    this.props.navigation.pop();
  }

  renderItem = (item) => {

    return (
      <View key={item.slug} style={styles.packItem}>
        <View style={[styles.pack, {backgroundColor: item.color ? item.color : "#F5F5F7"}]}>
          <CachedImage uri={`${API.assetEndpoint}cards/icon/${item.slug}.png?v=${API.version}`} style={styles.packImage} />
        </View>
        <View>
          <Text style={[API.styles.h3, {marginLeft: 0, marginBottom: 3, marginTop: 0}]}>{titleCase(item.locale)}</Text>
          <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 0}]}>{API.t("settings_cards", item.count)}</Text>
        </View>
        <View style={{flex: 1, justifyContent: "flex-end", alignItems: "flex-end", flexDirection: "row", alignItems: "center"}}>
          {false &&
            <View style={styles.premium}><Text style={{fontWeight: "600", fontSize: 12, color: "#fff"}}>Premium</Text></View>
          }
          <TouchableOpacity onPress={() => this.addAction(item.slug)} style={styles.button}>
            <Text style={{color: "#fff", fontWeight: "bold"}}>{API.t("button_add")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"}/>
        <View style={{flex: 1, backgroundColor: "#6989FF"}}>
          <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
            <FlatList
               style={{flex: 1,  paddingTop: 20, paddingHorizontal: 25}}
               data={this.state.data}
               renderItem={({ item }) => this.renderItem(item)}
               keyExtractor={item => "pack-"+item.id}
               ListFooterComponent={(<View style={{height: 100}}></View>)}
             />
          </View>
        </View>
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
