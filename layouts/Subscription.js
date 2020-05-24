import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text, ScrollView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';

import API from '../api';
import TopBar from '../components/TopBar'

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
