import React from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity } from 'react-native';

import API from '../api';
import titleCase from '../js/titleCase';
import { Image as CachedImage } from "react-native-expo-image-cache";
import * as ScreenOrientation from 'expo-screen-orientation';


import Search from '../components/Search'
import SearchResults from '../components/SearchResults'
import TouchableScale from '../components/touchable-scale'

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      categories: [],
      search: false,
      searchToggleAnim: new Animated.Value(0),
      term: "",
      orientation: "portrait"
    }

    ScreenOrientation.getOrientationAsync().then(orientation => {
      if(orientation == 3 || orientation == 4){
        this.setState({orientation: "landscape"});
      }
    })
  }

  componentDidMount(){
    API.hit("Home");
    API.speak(`Hello ${API.user.active_profile.name}`);
    API.event.on("refresh", this._refreshHandler)
    this.getPacks(API.user.active_profile.packs);
    this.orientationSubscription = ScreenOrientation.addOrientationChangeListener(this._orientationChanged.bind(this));
  }

  _orientationChanged(orientation){
    let newOrientation = orientation.orientationInfo.horizontalSizeClass == "1"? "portrait" : "landscape";
    this.setState({orientation: newOrientation});
  }

  componentWillUnmount(){
    ScreenOrientation.removeOrientationChangeListener(this.orientationSubscription);
  }

  _refreshHandler = () => {
    this.forceUpdate();
    this.getPacks(API.user.active_profile.packs, true);
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


  async getPacks(packs, force){
    let allPacks = await API.getPacks(force);

    let categories = packs.map(pack => {
      let filter = allPacks.filter(allpack => allpack.slug == pack);
      if(filter.length){
        let filtered = filter[0];
        filtered.enabled = true;
        return filtered;
      }
    }).filter(data => typeof data != "undefined");
    this.setState({categories});

  }

  openCards(pack){
    this.props.navigation.push("Cards", {pack, orientation: this.state.orientation});
  }

  toggleSearch(status){
    this.setState({search: status});

    Animated.timing(this.state.searchToggleAnim, {
      toValue: status ? 1:0,
      duration: 300
    }).start();

  }

  onBlur(){
    if(!this.state.term){
      this.toggleSearch(false);
    }
  }

  onSearch(term){
    this.setState({term});
  }


  render() {
    let headerHeight = this.state.searchToggleAnim.interpolate({
    	inputRange: [0, 1],
    	outputRange: [60, 0]
    });

    let headerOpacity = this.state.searchToggleAnim.interpolate({
    	inputRange: [0, 1],
    	outputRange: [1, 0]
    });

    let boardOpacity = this.state.searchToggleAnim.interpolate({
    	inputRange: [0, 1],
    	outputRange: [1, 0]
    });

    let boardTranslate = this.state.searchToggleAnim.interpolate({
    	inputRange: [0, 1],
    	outputRange: [0, 400]
    });

    return(
      <View style={{flex: 1}}>
        <SafeAreaView></SafeAreaView>
        <ScrollView stickyHeaderIndices={[1]} contentInsetAdjustmentBehavior="automatic">
          <SafeAreaView>
            <Animated.View style={{height: headerHeight, opacity: headerOpacity}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60}}>
                  <Text style={[API.styles.h2, {padding: 0, margin: 0, color: "#000"}]}>Hello {API.user.active_profile.name}</Text>
                  <TouchableOpacity style={styles.avatar} onPress={() => this.openSettings()}>
                    <Image source={{uri: `https://leeloo.dreamoriented.org/cdn/avatar/${API.user.active_profile.avatar}.png`}}
                      style={{width: 40, height: 40, position: "relative", top: 4}}
                      resizeMode={"contain"}
                      />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </SafeAreaView>
          <SafeAreaView>
            <Search onFocus={() => this.toggleSearch(true)} onBlur={() => this.onBlur(false)} onChangeText={this.onSearch.bind(this)}/>
          </SafeAreaView>

          <View>
            {(this.state.search && this.state.term != "") &&
              <SearchResults term={this.state.term}/>
            }
          </View>

          {!this.state.term &&
            <SafeAreaView>
              <Animated.View style={[styles.board, {opacity: boardOpacity, transform: [{translateY: boardTranslate}]}]}>
                {
                  API.user.active_profile && this.state.categories.map((pack, i) => {
                    return (
                      <TouchableScale key={i} style={this.state.orientation == "portrait" ? styles.categoryItem : styles.categoryItemLandscape} onPress={() => this.openCards(pack)}>
                        <View style={[styles.categoryItemInner, { backgroundColor: pack.color }]}>
                          <Image source={{uri: `https://leeloo.dreamoriented.org/cdn/icon/${pack.slug}.png`}} style={{width: 90, height: 90, margin: 15, marginBottom: 10}}/>
                          <Text style={styles.categoryItemText}>{titleCase(pack.locale)}</Text>
                        </View>
                      </TouchableScale>
                    )
                  })
                }
              </Animated.View>
            </SafeAreaView>
          }
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
  header: {
    backgroundColor: "#6989FF"
  },
  categories: {
    backgroundColor: "#6989FF",
    height: 10
  },
  avatar: {
    marginRight: 30, padding: 2, backgroundColor: "#a5d5ff", borderRadius: 40, overflow: "hidden",
    width: 45,
    height: 45,
    marginTop: 5,
  },
  categoryItem: {
    width: "50%",
    height: 160
  },
  categoryItemLandscape: {
    width: "33.3%",
    height: 160
  },
  board: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15
  },
  categoryItemInner: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1, borderRadius: 25,
    margin: 5
  },
  categoryItemText:{
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    opacity: 0.75
  }
});
