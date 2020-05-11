import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, SafeAreaView } from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import { Image as CachedImage } from "react-native-expo-image-cache";

import API from '../api';
import titleCase from '../js/titleCase';
import TopBar from '../components/TopBar'
import Svg, { Path, Line } from 'react-native-svg';

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.profile = this.props.navigation.getParam("profile");
    this.state = {
      name: this.profile.name,
      data: [],
      avatar: this.profile.avatar,
      changed: false
    }
  }

  componentDidMount(){
    API.hit("Profile");
  }

  async componentDidMount(){
    let data = await this.getDraggableData(this.profile.packs);
    this.setState({data});
  }

  async getDraggableData(packs){
    let allPacks = await API.getPacks();

    return packs.map(pack => {
      let filter = allPacks.filter(allpack => allpack.slug == pack);
      if(filter.length){
        let filtered = filter[0];
        filtered.enabled = true;
        return filtered;
      }
    }).filter(data => typeof data != "undefined");
  }

  save(){
    let { name, data, avatar } = this.state;
    let changedFields = [];
    let changedValues = [];

    if(name != null && name != this.profile.name){
      changedFields.push("name");
      changedValues.push(name);
    }

    if(avatar != this.profile.avatar){
      changedFields.push("avatar");
      changedValues.push(avatar);
    }

    if(this.state.changed){
      changedFields.push("packs");
      let packs = this.state.data.map(pack => pack.slug);
      changedValues.push(JSON.stringify(packs));
    }

    API.updateProfile(this.profile.id, changedFields, changedValues).then(res => {
      this.props.navigation.pop();
    })
  }

  remove(){
    Alert.alert(
      API.t("alert_profile_remove_title"),
      API.t("alert_profile_remove_description"),
      [
        {
          text: API.t("alert_cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: API.t("alert_ok"), onPress: () => {
          API.removeProfile(this.profile.id).then(res => {
            this.props.navigation.pop();
          })
				} }
      ],
      { cancelable: true }
    );
  }

  setCurrent(){
    API.setCurrentProfile(this.profile.id).then(res => {
      this.props.navigation.pop();
    });
  }

  didChange(){
    return this.state.name != this.profile.name || this.state.changed || this.state.avatar != this.profile.avatar;
  }

  async addPack(packName){
    let packs = this.state.data.map(pack => pack.slug);
    packs.unshift(packName);

    let data = await this.getDraggableData(packs);
    this.setState({data, changed: true});
  }

  async changeAvatar(avatar){
    console.log(avatar);
    this.setState({avatar})
  }

  removePack(packName){
    let data = this.state.data.filter(d => d.slug != packName);
    this.setState({data, changed: true});
  }


  renderItem = ({ item, index, drag, isActive }) => {

    return (
      <TouchableOpacity activeOpacity={0.9} style={[styles.packItem, {transform: [{scale: isActive ? 1.1 : 1}]}]} onLongPress={() => { API.haptics("impact"); drag(); }}>


        <Svg height={20} width={20} viewBox="0 0 24 24">
          <Path fill={"#8A8E9C"} d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></Path>
        </Svg>
        <View style={[styles.pack, {backgroundColor: item.color ? item.color : "#F5F5F7"}]}>
          <CachedImage uri={`https://leeloo.dreamoriented.org/cdn/icon/${item.slug}.png?v=${API.version}`} style={styles.packImage} />
        </View>
        <View>
          <Text style={[API.styles.h3, {marginLeft: 0, marginBottom: 3, marginTop: 0}]}>{titleCase(item.locale)}</Text>
          <Text style={[API.styles.sub, {marginHorizontal: 0, marginBottom: 0}]}>{API.t("settings_cards", item.count)}</Text>
        </View>
        <View style={{flex: 1, justifyContent: "flex-end", alignItems: "flex-end", flexDirection: "row", alignItems: "center"}}>
          {false &&
            <View style={styles.premium}><Text style={{fontWeight: "600", fontSize: 12, color: "#fff"}}>Premium</Text></View>
          }
          <TouchableOpacity onPress={() => this.removePack(item.slug)} style={{padding: 5, width: 34, height: 34, marginRight: 20}}>
            <Svg height={24} width={24} viewBox="0 0 24 24" style={{opacity: 0.5}}>
              <Path fill={"#c40606"} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11H8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z"></Path>
            </Svg>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <>
        <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"} rightButtonRender={true} rightButtonActive={this.didChange()} rightButtonPress={() => this.save()}/>
          <View style={{flex: 1, backgroundColor: "#6989FF"}}>
            <View style={styles.head}>
              <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center"}}>

                <TouchableOpacity style={styles.childAvatar} onPress={() => this.props.navigation.push("Avatar", {avatar: this.changeAvatar.bind(this)})}>
                  <CachedImage uri={`https://leeloo.dreamoriented.org/cdn/avatar/${this.state.avatar}.png?v=${API.version}`} resizeMode="contain" style={styles.childImage} />
                </TouchableOpacity>
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 5}}>
                  <TextInput style={[API.styles.h1, {marginRight: 0, marginLeft: 10}]} defaultValue={this.profile.name} onChangeText={(text) => this.setState({name: text})}/>
                  <Svg width="24" height="24" viewBox="0 0 24 24" style={{marginLeft: 3}}>
                    <Path d="M0,0H24V24H0Z" fill="none"/>
                    <Path d="M4,20H8L18.5,9.5a2.828,2.828,0,0,0-4-4L4,16v4" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    <Line x2="4" y2="4" transform="translate(13.5 6.5)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                  </Svg>
                </View>
                <View style={{marginHorizontal: 30, flexDirection: "row"}}>
                  {this.profile.id != API.user.active_profile.id &&
                    <TouchableOpacity onPress={() => this.setCurrent()} style={styles.smallButton}>
                      <Svg height={24} width={24} viewBox="0 0 24 24" style={{marginLeft: 10}}>
                        <Path fill={"#fff"} d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"></Path>
                      </Svg>
                      <Text style={[styles.smallButtonText, {marginRight: 15, marginLeft: 5}]}>USE</Text>
                    </TouchableOpacity>
                  }

                  {this.profile.id == API.user.active_profile.id &&
                    <View style={[styles.smallButton, {backgroundColor: "#ddd"}]}>
                      <Svg height={24} width={24} viewBox="0 0 24 24" style={{marginLeft: 10}}>
                        <Path fill={"#777"} d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"></Path>
                      </Svg>
                      <Text style={[styles.smallButtonText, {marginRight: 15, marginLeft: 5, color: "#777"}]}>USING</Text>
                    </View>
                  }

                  {this.profile.id != API.user.active_profile.id &&
                    <TouchableOpacity onPress={() => this.remove()} style={[styles.smallButton, {backgroundColor: "#c40606", width: 30, opacity: 1}]}>
                      <Svg height={24} width={24} viewBox="0 0 24 24">
                        <Path fill={"#fff"} d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></Path>
                      </Svg>
                    </TouchableOpacity>
                  }
                </View>

              </View>
            </View>


            <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15, paddingLeft: 20}}>

              <TouchableOpacity style={styles.addNew} onPress={() => this.props.navigation.push("Packs", { packsInUse: this.state.data.map(pack => pack.slug), add: this.addPack.bind(this)})}>
                <Svg height={30} width={30} viewBox="0 0 24 24" style={{margin: 10, opacity: 0.5}}>
                  <Path fill={"#395A85"} d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"></Path>
                </Svg>
              </TouchableOpacity>

              {this.state.data &&
                <DraggableFlatList
                  data={this.state.data}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => `draggable-item-${item.id}`}
                  onDragEnd={({ data }) => { this.setState({ data, changed: true }); API.haptics("touch"); }}
                />
              }


              <SafeAreaView></SafeAreaView>
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
  addNew: {
    height: 50,
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
    marginRight: 20
  },
  childAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F5F5F7",
    borderWidth: 9,
    borderColor: "#ffffff",
    overflow: "hidden"
  },
  childImage: {
    width: 60,
    height: 60,
    position: "relative",
    top: 6,
    margin: 6
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
  smallButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#60c54e",
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5
  },
  smallButtonText: {
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "bold"
  }
});
