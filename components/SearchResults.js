import React from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';

import API from '../api'
import SearchItem from './SearchItem'
import TTSItem from './TTSItem'

export default class App extends React.Component {

  render(){
    const results = API.search(this.props.term);
    let isExactSearch = results.filter(res => res.title.toLocaleLowerCase() == this.props.term.trim().toLocaleLowerCase()).length != 0;
    return (
      <SafeAreaView>
        <View style={styles.searchCarrier}>
          {!isExactSearch && <TTSItem term={this.props.term} width={this.props.orientation == "portrait" ? "100%" : "50%"}/>}
          {
            results.map((result, i) => {
              return (<SearchItem key={i} result={result} width={this.props.orientation == "portrait" ? "100%" : "50%"}/>);
            })
          }
          <View style={{width: "100%", height: 25}}></View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  searchCarrier: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 2
  }
});
