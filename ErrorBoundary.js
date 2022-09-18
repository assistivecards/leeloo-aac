import React from 'react';
import { Text, View } from 'react-native';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "", errorDetail: {componentStack: ""} };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //console.log("#####", String(error));
    //console.log(Object.keys(errorInfo));
    this.setState({errorMessage: String(error), errorDetail: error})
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View style={{margin: 50}}>
          <Text style={{color: "red", fontWeight: "bold", marginBottom: 20}}>Leeloo, crash catcher!</Text>
          <Text style={{color: "red", paddingBottom: 10}}>An internal issue occured, please restart your game!</Text>
          <Text style={{color: "red", fontWeight: "bold"}}>{this.state.errorMessage}</Text>
          <Text style={{color: "red"}}>{this.state.errorDetail.componentStack}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
