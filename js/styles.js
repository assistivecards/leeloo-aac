import { StyleSheet } from 'react-native';

import themes from './themes'

const styles = StyleSheet.create({
  p: {
    marginHorizontal: 30,
    marginTop: 5,
    marginBottom: 10,
    color: themes.light.pFontColor,
    fontSize: 16,
    lineHeight: 25
  },
  b: {
    color: themes.light.pFontColor,
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 21
  },
  h1: {
    marginHorizontal: 30,
    color: themes.light.hFontColor,
    letterSpacing: -1,
    fontSize: 30,
    fontWeight: "bold"
  },
  h2: {
    marginHorizontal: 30,
    marginVertical: 10,
    letterSpacing: -0.7,
    marginTop: 20,
    color: themes.light.hFontColor,
    fontSize: 21,
    fontWeight: "bold"
  },
  h3: {
    marginHorizontal: 30,
    marginVertical: 10,
    letterSpacing: -0.5,
    marginTop: 15,
    color: themes.light.hFontColor,
    fontSize: 17,
    fontWeight: "bold"
  },
  h4: {
    color: themes.light.hFontColor,
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
    color: themes.light.hFontColor,
    fontWeight: "200",
    opacity: 0.8,
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
  }
});

export default styles;
