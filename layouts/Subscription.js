import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';

import API from '../api';
import TopBar from '../components/TopBar'
import Svg, { Path, Line, Circle, Polyline, Rect } from 'react-native-svg';

export default class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      premium: API.premium,
      plans: []
    }
  }

  async componentDidMount(){
    let plans = await API.getPlans();
    this.setState({plans});
    API.hit("Subscription");

    API.event.on("premium", this._listenPremiumChange.bind(this))
    API.event.on("premiumPurchase", this._listenPremiumPurchase.bind(this))
  }

  _listenPremiumChange = () => {
    this.setState({premium: API.premium});
  }

  _listenPremiumPurchase = (changedTo) => {
    console.log("Purchased: ", changedTo);
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

  redeem(){
    Alert.prompt(
      "Redeem Promo Code",
      "Enter the promo code we supplied to you, must be all capital.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: code => this.checkPromoCode(code)
        }
      ],
      "plain-text"
    );
  }

  async checkPromoCode(code){
    if(code){

      var formData = new FormData();
  		formData.append('promo', code);
      let resu = await fetch("https://leeloo.dreamoriented.org/code.php", { method: 'POST', body: formData })
	    .then(res => res.json());
      if(resu == "false"){
        alert("The promo code is not valid.");
      }else{
        this.save("gift");
      }
    }else{
      alert("Can't be empty!");
    }
  }

  renderSubscriptionPlan(plan){
    if(plan.productId == this.state.premium || (this.state.premium == "lifetime")){
      return (
        <View style={[styles.listItem, {opacity: 0.5}]}>
          <View>
            <Text style={[API.styles.h3, {marginVertical: 0}]}>{plan.title}</Text>
            <Text style={API.styles.p}>{plan.subscriptionPeriod == "P0D" ? "One-time payment" : "Recurring payment"}</Text>
          </View>
          <View><Text style={{marginRight: 30}}>{plan.price}</Text></View>
        </View>
      )
    }else{
      return (
        <TouchableOpacity key={plan.productId} onPress={() => API.purchasePremium(plan.productId, this.state.premium)} style={styles.listItem}>
          <View>
            <Text style={[API.styles.h3, {marginVertical: 0}]}>{plan.title}</Text>
            <Text style={API.styles.p}>{plan.subscriptionPeriod == "P0D" ? API.t("settings_subscriptions_oneTimePayment") : API.t("settings_subscriptions_recurringPayment")}</Text>
          </View>
          <View><Text style={{marginRight: 30}}>{plan.price}</Text></View>
        </TouchableOpacity>
      )
    }
  }

  render() {
    let plans = this.state.plans;
    if(API.user.premium == "gift"){

      return(
        <>
          <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"}/>
          <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
            <View style={[styles.head, {alignItems: API.user.isRTL ? "flex-end" : "flex-start"}]}>
              <Text style={API.styles.h1}>{API.t("settings_selection_subscriptions")}</Text>
              <Text style={API.styles.pHome}>{API.t("settings_subscriptions_description")}</Text>
            </View>
            <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
              <Text style={API.styles.p}>You have redeemed a promo code, this means using your account you can use and test this app's premium capabilities forever.</Text>
              <Text style={API.styles.p}>Also, we love you! ❤️</Text>
              <Text style={[API.styles.p, {opacity: 0.7}]}>Additionally if you are fluent in a language other than English, help us proofread your native language at "assistivecards.com/help"</Text>
              <View style={API.styles.iosBottomPadder}></View>
            </View>
          </ScrollView>
        </>
      )
    }else{

      return(
        <>
          <TopBar back={() => this.props.navigation.pop()} backgroundColor={"#6989FF"}/>
          <ScrollView style={{flex: 1, backgroundColor: "#6989FF"}}>
            <View style={[styles.head, {alignItems: API.user.isRTL ? "flex-end" : "flex-start"}]}>
              <Text style={API.styles.h1}>{API.t("settings_selection_subscriptions")}</Text>
              <Text style={API.styles.pHome}>{API.t("settings_subscriptions_description")}</Text>
            </View>
            <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 15}}>
              {plans[0] &&
                <>
                  {this.renderSubscriptionPlan(plans.filter(plan => plan.productId == "monthly")[0])}
                  {this.renderSubscriptionPlan(plans.filter(plan => plan.productId == "yearly")[0])}
                  {this.renderSubscriptionPlan(plans.filter(plan => plan.productId == "lifetime")[0])}
                </>
              }

              {!plans[0] &&
                <View style={{height: 150, justifyContent: "center", alignItems: "center"}}>
                  <ActivityIndicator/>
                </View>
              }
              {this.state.premium == "lifetime" && <Text style={API.styles.p}>{API.t("settings_subscriptions_downgrade_notice")}</Text>}
              <Text style={API.styles.p}>{API.t("settings_subscriptions_cancel_notice")}</Text>
              {Platform.OS == "ios" &&
                <TouchableOpacity onPress={() => this.redeem()}>
                  <View style={[[styles.selectionItem, {flexDirection: API.user.isRTL ? "row-reverse" : "row"}], {borderBottomWidth: 0, padding: 25, paddingHorizontal: 30}]}>
                    <Svg height={24} width={24} viewBox="0 0 24 24" style={styles.selectionIcon} strokeWidth="2" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <Path stroke="none" d="M0 0h24v24H0z"/>
                      <Line x1="9" y1="15" x2="15" y2="9" />
                      <Circle cx="9.5" cy="9.5" r=".5" fill="currentColor" />
                      <Circle cx="14.5" cy="14.5" r=".5" fill="currentColor" />
                      <Path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7a2.2 2.2 0 0 0 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1a2.2 2.2 0 0 0 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55 v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55 v-1" />
                    </Svg>
                    <Text style={[API.styles.b, {fontSize: 15, marginLeft: 10}]}>Redeem Promo Code</Text>
                  </View>
                </TouchableOpacity>
              }
              <View style={API.styles.iosBottomPadder}></View>
            </View>
          </ScrollView>
        </>
      )
    }
  }
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#6989FF",
    marginBottom: 10,
    paddingVertical: 10,
    paddingBottom: 5
  },
  preferenceItem: {
    marginBottom: 10
  },
  listItem: {
    borderBottomWidth: 1, borderColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  pointer: {
    width: 24, height: 24, borderRadius: 12,
    marginRight: 30
  }
});
