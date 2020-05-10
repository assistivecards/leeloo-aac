import { StyleSheet } from 'react-native';

import themes from './themes'

const styles = StyleSheet.create({
  p: {
    marginTop: 5,
    marginBottom: 10,
    color: "#444",
    fontSize: 16,
    lineHeight: 25,
    marginHorizontal: 30
  },
  pHome: {
    marginTop: 5,
    marginBottom: 10,
    color: "#fff",
    fontSize: 16,
    lineHeight: 25,
    marginHorizontal: 30
  },
  b: {
    color: themes.light.pFontColor,
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 21
  },
  bBig: {
    color: themes.light.pFontColor,
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 21,
    flexWrap: "wrap",
    flexGrow: 1,
    flex: 1
  },
  h1: {
    color: "#fff",
    letterSpacing: -1,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 30
  },
  h2: {
    marginHorizontal: 30,
    marginVertical: 10,
    letterSpacing: -0.7,
    marginTop: 20,
    color: "#333",
    fontSize: 21,
    fontWeight: "bold"
  },
  h3: {
    marginHorizontal: 30,
    marginVertical: 10,
    letterSpacing: -0.5,
    marginTop: 15,
    color: "#333",
    fontSize: 17,
    fontWeight: "bold"
  },
  h4: {
    color: "#333",
    fontSize: 16,
    letterSpacing: -0.4,
    fontWeight: "bold"
  },
  sub: {
    color: themes.light.hFontColor,
    fontWeight: "200",
    opacity: 0.8,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 10,
    marginHorizontal: 30,
    letterSpacing: -0.4,
  },
  subSmall: {
    color: "#81869F",
    opacity: 1,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 10,
    marginHorizontal: 30,
    letterSpacing: -0.3,
  },
  subUp: {
    fontSize: 14,
    color: themes.light.hFontColor,
    opacity: 0.6,
    lineHeight: 20,
    marginHorizontal: 20,
  },
  sub15: {
    fontSize: 15,
    color: themes.light.hFontColor,
    opacity: 0.6,
    lineHeight: 23,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  hr: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 1,
    borderBottomColor: themes.light.mainBorderColor
  },
  br: {
    marginVertical: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    color: "#555",
    height: 46,
    padding: 8,
    fontSize: 18,
    marginHorizontal: 20,
    borderRadius: 23,
    paddingLeft: 20
  },
  iosBottomPadder: {
    backgroundColor: "#fff",
    height: 250,
    position: "relative",
    top: 250
  }
});

export default styles;
