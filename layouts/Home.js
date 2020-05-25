import React from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';

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
      packs: [],
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
    API.speak(API.t("hello_you", API.user.active_profile.name));
    API.event.on("refresh", this._refreshHandler)
    this.getPacks(API.user.active_profile.packs);
    this.orientationSubscription = ScreenOrientation.addOrientationChangeListener(this._orientationChanged.bind(this));

    API.event.on("announce", this._announcer.bind(this))
  }

  _orientationChanged(orientation){
    let newOrientation = "portrait";
    if(orientation.orientationInfo.orientation == 3 || orientation.orientationInfo.orientation == 4){
      newOrientation = "landscape";
    }
    this.setState({orientation: newOrientation});
  }

  _refreshHandler = () => {
    this.forceUpdate();
    this.getPacks(API.user.active_profile.packs, true);
  };

  _announcer = (card) => {
    this.props.navigation.push("Announcer", {
      card: API.getCardData(card.slug, card.pack),
      pack: this.state.packs.filter(pack => pack.slug == card.pack)[0],
      orientation: this.state.orientation
    });
  };

  componentWillUnmount(){
    ScreenOrientation.removeOrientationChangeListener(this.orientationSubscription);
    API.event.removeListener("refresh", this._refreshHandler);
    API.event.removeListener("announce", this._announcer);
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

    let filteredPacks = packs.map(pack => {
      let filter = allPacks.filter(allpack => allpack.slug == pack);
      if(filter.length){
        let filtered = filter[0];
        filtered.enabled = true;
        if(filtered.premium){
          if(API.isPremium()){
            return filtered;
          }
        }else{
          return filtered;
        }
      }
    }).filter(data => typeof data != "undefined");
    this.setState({packs: filteredPacks});

    API.ramCards(packs, force);
  }

  openCards(pack, packIndex){
    this.props.navigation.push("Cards", {pack, packs: this.state.packs, packIndex, orientation: this.state.orientation});
  }

  toggleSearch(status){
    if(this.state.search != status){
      this.setState({search: status});

      Animated.timing(this.state.searchToggleAnim, {
        toValue: status ? 1:0,
        duration: 300
      }).start();
    }
  }

  onBlur(){
    if(!this.state.term){
      this.toggleSearch(false);
    }
  }

  dismissSearch(){
    this.setState({term: ""});
    this.toggleSearch(false);
  }

  onSearch(term){
    if(term != this.state.term){
      this.setState({term});
    }
  }

  renderPacks(){
    if(this.state.packs.length){
      return(
        this.state.packs.map((pack, i) => {
          return (
            <TouchableScale key={i} style={[this.state.orientation == "portrait" ? styles.categoryItem : styles.categoryItemLandscape, {height: API.isTablet ? 230 : 160}]} onPress={() => this.openCards(pack, i)}>
              <View style={[styles.categoryItemInner, { backgroundColor: pack.color }]}>
                <CachedImage uri={`${API.assetEndpoint}cards/icon/${pack.slug}.png?v=${API.version}`} style={{width: API.isTablet ? 130 : 90, height: API.isTablet ? 130 : 90, margin: 15, marginBottom: 10}}/>
                <Text style={[styles.categoryItemText, {fontSize: API.isTablet ? 23 : 16}]}>{titleCase(pack.locale)}</Text>
              </View>
            </TouchableScale>
          )
        })
      );
    }else{
      return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", height: 300}}>
          <ActivityIndicator color={"#6989FF"}/>
        </View>
      )
    }
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
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <ScrollView stickyHeaderIndices={[1]} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" keyboardDismissMode={"on-drag"}>
          <SafeAreaView>
            <Animated.View style={{height: headerHeight, opacity: headerOpacity}}>
                <View style={{flexDirection: API.user.isRTL ? "row-reverse" : "row", justifyContent: "space-between", alignItems: "center", height: 60}}>
                  <View style={{flex: 1}}>
                    <Text style={[API.styles.h2, {padding: 0, margin: 0, color: "#000"}]}>{API.t("hello_you", API.user.active_profile.name)}</Text>
                  </View>
                  <TouchableOpacity style={styles.avatar} onPress={() => this.openSettings()}>
                    <CachedImage uri={`${API.assetEndpoint}cards/avatar/${API.user.active_profile.avatar}.png?v=${API.version}`}
                      style={{width: 40, height: 40, position: "relative", top: 4}}
                      resizeMode={"contain"}
                      />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </SafeAreaView>
          <SafeAreaView>
            <Search onFocus={() => this.toggleSearch(true)} term={this.state.term} onBlur={() => this.onBlur(false)} onChangeText={this.onSearch.bind(this)} dismiss={this.dismissSearch.bind(this)}/>
          </SafeAreaView>
          <View>
            {(this.state.search && this.state.term != "") &&
              <SearchResults term={this.state.term} orientation={this.state.orientation}/>
            }
          </View>

          {!this.state.term &&
            <SafeAreaView>
              <Animated.View style={[styles.board, {opacity: boardOpacity, transform: [{translateY: boardTranslate}]}]}>
                {API.user.active_profile && this.renderPacks()}
              </Animated.View>
            </SafeAreaView>
          }
        </ScrollView>
        </KeyboardAvoidingView>
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
  avatar: {
    marginHorizontal: 30, padding: 2, backgroundColor: "#a5d5ff", borderRadius: 40, overflow: "hidden",
    width: 45,
    height: 45,
    marginTop: 5,
  },
  categoryItem: {
    width: "50%"
  },
  categoryItemLandscape: {
    width: "33.3%"
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
    fontWeight: "bold",
    marginBottom: 10,
    color: "rgba(0,0,0,0.75)"
  }
});
