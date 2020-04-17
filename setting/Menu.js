import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';

export default class App extends React.Component {
  render() {
    const { routes, index } = this.props.navigation.state;

    return (
      <SafeAreaView>
        <TouchableOpacity onPress={() => this.props.navigation.navigate("One")}><Text>one</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate("Two")}><Text>two</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }
}
