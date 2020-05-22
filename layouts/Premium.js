import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';

import API from '../api';
import TopBar from '../components/TopBar'
import Svg, { Path, Ellipse, G } from 'react-native-svg';
import { Image as CachedImage } from "react-native-expo-image-cache";

function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      premium: API.premium,
      cards: []
    }

  }

  async componentDidMount(){
    API.event.on("premium", this._listenPremiumChange.bind(this))
    API.event.on("premiumPurchase", this._listenPremiumPurchase.bind(this))
    let cards = await API.getPacks();
    this.setState({cards: cards.filter(res => res.premium == 1)});
  }

  _listenPremiumChange = () => {
    this.setState({premium: API.premium});
  }

  _listenPremiumPurchase = (changedTo) => {
    console.log("asdasdasdasd", changedTo);
    this.setState({premium: changedTo});
    this.save(changedTo);
  }

  componentWillUnmount(){
    API.event.removeListener("premium", this._listenPremiumChange);
    API.event.removeListener("premiumPurchase", this._listenPremiumPurchase)
  }

  async save(toPremiumValue){
    API.haptics("touch");
    let { premium } = this.state;
    let changedFields = [];
    let changedValues = [];
    if(toPremiumValue){
      premium = toPremiumValue;
    }
    changedFields.push("premium");
    changedValues.push(premium);

    let updateRes = await API.update(changedFields, changedValues);
    this.props.navigation.pop();
    API.haptics("impact");
  }

  renderSubscriptionPlan(plan, compare){
    console.log(plan);
    if(plan.productId == "monthly"){
       return (
         <TouchableOpacity key={plan.productId} onPress={() => API.purchasePremium(plan.productId, this.state.premium)} style={styles.listItem}>
           <View>
             <Text style={[API.styles.h3, {marginHorizontal: 0, marginVertical: 0, marginTop: 0}]}>{API.t("premium_monthly")}</Text>
           </View>
           <View><Text style={styles.price}>{API.t("premium_monthly_priceShow", plan.price)}</Text></View>
         </TouchableOpacity>
       )
    }else if(plan.productId == "yearly"){
      let monthlyPrice = toFixed((plan.priceAmountMicros / 1000000) / 12, 2);
      let yearlyToMonthlyPrice = plan.price.replace(toFixed((plan.priceAmountMicros / 1000000), 2), toFixed((plan.priceAmountMicros / 1000000) / 12, 2))
      let comparePercent = 0;
      if(compare){
        comparePercent = Math.ceil(((compare.priceAmountMicros / (plan.priceAmountMicros / 12)) - 1) * 100);
      }
       return (
         <TouchableOpacity key={plan.productId} onPress={() => API.purchasePremium(plan.productId, this.state.premium)} style={[styles.listItem, {borderColor: "#a2ddfd"}]}>
           <View>
              <Text style={[API.styles.h3, {marginHorizontal: 0, marginVertical: 0, marginTop: 0, marginBottom: 5, fontSize: 16}]}>{API.t("premium_yearly")}</Text>
             <Text style={[API.styles.h3, {marginHorizontal: 0, marginVertical: 0, marginTop: 0, fontSize: 16}]}>{API.t("premium_then_info", plan.price)}</Text>
           </View>
           <View style={{alignItems: "flex-end"}}>
            <Text style={styles.price}>{API.t("premium_monthly_priceShow", yearlyToMonthlyPrice)}</Text>
            <View style={{padding: 3, paddingHorizontal: 10, borderRadius: 15, backgroundColor: "#a2ddfd"}}>
              <Text style={{color: "#3e445a", fontWeight: "600"}}>{API.t("premium_save_percent", comparePercent)}</Text>
            </View>
           </View>
         </TouchableOpacity>
       )
    }else if(plan.productId == "lifetime"){
       return (
         <TouchableOpacity key={plan.productId} onPress={() => API.purchasePremium(plan.productId, this.state.premium)} style={styles.listItem}>
           <View>
             <Text style={[API.styles.h3, {marginHorizontal: 0, marginVertical: 0, marginTop: 0}]}>{API.t("premium_lifetime")}</Text>
             <Text style={[API.styles.p, {marginHorizontal: 0, marginVertical: 0, marginTop: 0, padding: 0, paddingBottom: 0, marginBottom: 0}]}>{API.t("premium_lifetime_oneTime")}</Text>
           </View>
           <View><Text style={styles.price}>{plan.price}</Text></View>
         </TouchableOpacity>
       )
    }
  }


  renderLeeloo(){
    return (
      <Svg
        width="252"
        height="132.059"
        viewBox="0 0 252 132.059"
      >
        <G
          id="Group_1472"
          data-name="Group 1472"
          transform="translate(-214 -201.941)"
        >
          <G
            id="Group_1466"
            data-name="Group 1466"
            transform="translate(0 -58)"
          >
            <G
              id="Group_1443"
              data-name="Group 1443"
              transform="rotate(-9 -1455.979 934.989)"
            >
              <G
                id="Group_1357"
                data-name="Group 1357"
                transform="translate(351.842 546)"
              >
                <G id="Group_1427" data-name="Group 1427">
                  <G id="Group_1353" data-name="Group 1353">
                    <Path
                      id="Path_2648"
                      fill="#f5f5f5"
                      d="M298.1 117.272a11.1 11.1 0 0021.593 4.5l.211-.65c4.378-13.31 17.765-22.014 30.563-27.718a16.781 16.781 0 10-16.656-28.932c-1.922 2.038-32.79 21.128-35.711 52.8z"
                      data-name="Path 2648"
                      transform="translate(-228.65 -44.596)"
                    ></Path>
                    <Path
                      id="Path_2649"
                      fill="#ebebeb"
                      d="M319.835 105.066c-9.3 9.05-20.068 23.026-21.735 41.1a11.1 11.1 0 0021.593 4.5l.211-.65c3.633-11.045 13.471-18.916 24.028-24.536a70.029 70.029 0 00-24.1-20.409z"
                      data-name="Path 2649"
                      transform="translate(-228.651 -73.491)"
                    ></Path>
                    <Path
                      id="Path_2650"
                      fill="#f5f5f5"
                      d="M150.345 81.367a11.1 11.1 0 01-21.828-3.161l.024-.683c.438-14-9.165-26.762-19.24-36.5a16.781 16.781 0 1125.547-21.491c1.107 2.578 23.583 31.079 15.497 61.835z"
                      data-name="Path 2650"
                      transform="translate(-100.685 -12.181)"
                    ></Path>
                    <Path
                      id="Path_2651"
                      fill="#ebebeb"
                      d="M163.741 80.284A70.412 70.412 0 00134.109 91.2c8 8.89 14.549 19.651 14.185 31.272l-.024.683a11.1 11.1 0 0021.828 3.161c4.613-17.541-.719-34.349-6.357-46.032z"
                      data-name="Path 2651"
                      transform="translate(-120.438 -57.133)"
                    ></Path>
                    <Path
                      id="Path_2652"
                      fill="#fff"
                      d="M208.987 166.958c-4.542 25.76-32.9 36.685-64.525 31.109s-54.536-25.542-49.994-51.3 33.86-42.122 65.484-36.546 53.577 30.979 49.035 56.737z"
                      data-name="Path 2652"
                      transform="translate(-93.893 -76.173)"
                    ></Path>
                  </G>
                </G>
              </G>
              <Path
                id="Intersection_10"
                fill="#f5f5f5"
                d="M50.569 81.856C18.945 76.28-3.968 56.314.575 30.554 2.907 17.325 11.777 6.574 24.134 0c.721.285 1.138.454 1.138.454s-43.312 73.332 63.85 78.29c.687.032 1.36.064 2.024.1a66.262 66.262 0 01-24.795 4.437 91.043 91.043 0 01-15.782-1.425z"
                data-name="Intersection 10"
                transform="translate(350.792 586.039)"
              ></Path>
              <G
                id="Group_1426"
                data-name="Group 1426"
                transform="translate(359.42 609.854)"
              >
                <G
                  id="Group_1350"
                  fill="#a2ddfd"
                  data-name="Group 1350"
                  transform="translate(0 4.637)"
                >
                  <Ellipse
                    id="Ellipse_342"
                    cx="10.33"
                    cy="12.972"
                    data-name="Ellipse 342"
                    rx="10.33"
                    ry="12.972"
                    transform="matrix(.174 -.985 .985 .174 0 20.351)"
                  ></Ellipse>
                  <Ellipse
                    id="Ellipse_343"
                    cx="10.33"
                    cy="12.972"
                    data-name="Ellipse 343"
                    rx="10.33"
                    ry="12.972"
                    transform="rotate(-79.98 54.026 -25.008)"
                  ></Ellipse>
                </G>
                <G
                  id="Group_1351"
                  fill="#3e455b"
                  data-name="Group 1351"
                  transform="translate(14.289)"
                >
                  <Path
                    id="Path_2654"
                    d="M248.2 237.423a12.188 12.188 0 01-10.446-5.908 2.549 2.549 0 114.367-2.632 7.093 7.093 0 0010.545 1.859 2.55 2.55 0 113.2 3.967 12.206 12.206 0 01-7.666 2.714z"
                    data-name="Path 2654"
                    transform="translate(-210.475 -218.258)"
                  ></Path>
                  <Path
                    id="Path_2655"
                    d="M338.419 240.4a2.592 2.592 0 01-.446-.039 2.55 2.55 0 01-2.068-2.954 3.3 3.3 0 10-6.5-1.147 2.55 2.55 0 01-5.022-.886 8.4 8.4 0 1116.545 2.918 2.55 2.55 0 01-2.508 2.107z"
                    data-name="Path 2655"
                    transform="translate(-267.871 -218.772)"
                  ></Path>
                  <Path
                    id="Path_2679"
                    d="M338.419 240.4a2.592 2.592 0 01-.446-.039 2.55 2.55 0 01-2.068-2.954 3.3 3.3 0 10-6.5-1.147 2.55 2.55 0 01-5.022-.886 8.4 8.4 0 1116.545 2.918 2.55 2.55 0 01-2.508 2.107z"
                    data-name="Path 2679"
                    transform="translate(-324.343 -228.429)"
                  ></Path>
                </G>
              </G>
            </G>
            <G
              id="Group_1449"
              data-name="Group 1449"
              transform="translate(159 215)"
            >
              <Path
                id="Path_2963"
                fill="#f5f5f5"
                d="M324.832 250.637a12.109 12.109 0 01-.771-24.192c18.55-1.2 35.9-21.73 41.789-35.226a12.108 12.108 0 1122.2 9.683c-13.458 30.851-41.588 48.359-62.42 49.709-.27.017-.53.026-.798.026z"
                data-name="Path 2963"
                transform="translate(-115.89 -74)"
              ></Path>
              <Path
                id="Path_2964"
                fill="#ebebeb"
                d="M369.894 188.476a12.047 12.047 0 00-4.044 5c-5.887 13.5-23.239 34.023-41.789 35.226a12.109 12.109 0 00.771 24.192q.395 0 .795-.026a49.052 49.052 0 008.934-1.472q3.222-1.811 6.2-3.84c18.935-12.94 29.363-31.951 29.363-53.532 0-1.862-.081-3.711-.23-5.548z"
                data-name="Path 2964"
                transform="translate(-115.891 -76.257)"
              ></Path>
            </G>
            <Path
              id="Rectangle_322"
              fill="#fff"
              d="M0 0H252V26H0z"
              data-name="Rectangle 322"
              transform="translate(214 366)"
            ></Path>
            <Path
              id="Path_2989"
              fill="#ebebeb"
              d="M77.933 277.681a49.283 49.283 0 01-7.726-12.93 14.987 14.987 0 0127.4-12.147 24.058 24.058 0 002.858 5.313 14.986 14.986 0 01-22.533 19.764z"
              data-name="Path 2989"
              transform="translate(192.082 109)"
            ></Path>
          </G>
        </G>
      </Svg>
    )
  }

  render() {
    return(
      <>
        <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}} contentInsetAdjustmentBehavior="automatic">

          <SafeAreaView style={{backgroundColor: "#6989FF", alignItems: "flex-end"}}>
            <TouchableOpacity onPress={() => this.props.navigation.pop()} style={{justifyContent: "center", alignItems: "center", margin: 5, marginBottom: 0, marginHorizontal: 15, backgroundColor: "#fff", width: 45, height: 45, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 25}}>
              <Svg width={25} height={25} viewBox="0 0 25 25">
                <Path fill={"rgba(255,255,255,0.7)"} d={"M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"}></Path>
              </Svg>
            </TouchableOpacity>
          </SafeAreaView>

          <View style={[styles.head, {position: "relative", zIndex: 999, justifyContent: "center", alignItems: "center"}]}>
            <View style={{position: "relative", zIndex: 999, top: 31}}>
              {this.renderLeeloo()}
            </View>
          </View>
          <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
            <Text style={[API.styles.h2, {textAlign: "center"}]}>{API.t("premium_title")}</Text>
            <Text style={[API.styles.p, {textAlign: "center", marginBottom: 30}]}>{API.t("premium_description")}</Text>
            {API.premiumPlans[0] &&
              <>
                {this.renderSubscriptionPlan(API.premiumPlans.filter(plan => plan.productId == "monthly")[0])}
                {this.renderSubscriptionPlan(API.premiumPlans.filter(plan => plan.productId == "yearly")[0], API.premiumPlans.filter(plan => plan.productId == "monthly")[0])}
                {this.renderSubscriptionPlan(API.premiumPlans.filter(plan => plan.productId == "lifetime")[0])}
              </>
            }

            <View style={{paddingTop: 8}}>
              <Text style={API.styles.h3}>{API.t("premium_see_title")}</Text>
              <Text style={API.styles.p}>{API.t("premium_see_description")}</Text>
              <ScrollView style={{height: 140, width: "100%"}} horizontal={true}>
                <View style={{width: 25}}></View>
                {this.state.cards.map((pack, i) => {
                  console.log(pack);
                  return (
                    <View key={i} style={[styles.card, {backgroundColor: pack.color}]}>
                      <CachedImage uri={`${API.assetEndpoint}cards/icon/${pack.slug}.png?v=${API.version}`} style={{width: 50, height: 50, margin: 5}}/>
                      <Text style={{fontWeight: "500", color: "rgba(0,0,0,0.8)", paddingVertical: 3}}>{pack.locale}</Text>
                      <Text style={{fontSize: 12, color: "rgba(0,0,0,0.6)"}}>{API.t("premium_card_count", pack.count)}</Text>
                      <Text style={{fontSize: 10, color: "rgba(0,0,0,0.6)"}}>{API.t("premium_phrase_count", pack.count * 3)}</Text>
                    </View>
                  )
                })}
                <View style={{width: 25}}></View>
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => API.purchasePremium("yearly", this.state.premium)}>
              <Text style={[API.styles.h3, {color: "#3e445a", marginBottom: 0, marginTop: 0}]}>{API.t("premium_trial_title")}</Text>
              <Text style={[API.styles.h4, {color: "#3e445a", fontWeight: "normal", paddingTop: 3, opacity: 0.8}]}>{API.t("premium_trial_description")}</Text>
            </TouchableOpacity>
            <View>
              <Text style={[API.styles.p, {textAlign: "center", marginHorizontal: 40}]}>{API.t("premium_details1")}</Text>
              <View style={{borderBottomWidth: 1, borderBottomColor: "#eee", marginTop: 5, marginBottom: 15}}></View>
              <Text style={API.styles.sub}>{API.t("premium_details2")}</Text>
              <Text style={API.styles.sub}>{API.t("premium_details3")}</Text>
              <Text style={API.styles.sub}>{API.t("premium_details4")}</Text>
              <Text style={API.styles.sub}>{API.t("premium_details5")}</Text>
              <TouchableOpacity onPress={() => this.props.navigation.push("Browser", {link: "https://dreamoriented.org/termsofuse/"})}><Text style={API.styles.sub}>By continuing you accept our Terms of Use and Privacy Policy. (Touch to see in English)</Text></TouchableOpacity>
            </View>
            <View style={API.styles.iosBottomPadder}></View>
          </View>
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#6989FF",
    marginBottom: 0,
    paddingBottom: 5
  },
  listItem: {
    marginHorizontal: 25,
    borderRadius: 15,
    borderWidth: 2, borderColor: "#f5f5f7",
    backgroundColor: "#f5f5f7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 85,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  pointer: {
    width: 24, height: 24, borderRadius: 12,
    marginRight: 30
  },
  price: {
    fontWeight: "600",
    fontSize: 18,
    paddingVertical: 5
  },
  button: {
    backgroundColor: "#a2ddfd",
    height: 70,
    margin: 30,
    marginVertical: 10,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    padding: 5,
    paddingHorizontal: 15,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10
  }
});
