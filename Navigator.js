import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import { Easing, Animated } from 'react-native';

import Cards from './layouts/Cards'
import Profile from './layouts/Profile'
import Settings from './layouts/Settings'
import Browser from './layouts/Browser'
import Announcer from './layouts/Announcer'

const AppNavigator = createStackNavigator({
    Cards: { screen: Cards },
    Settings: { screen: Settings },
    Browser: { screen: Browser },
    Profile: { screen: Profile }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
);

const RootNavigator = createAppContainer(AppNavigator);
const ModelNavigator = createStackNavigator({
    Root: { screen: RootNavigator },
    Announcer: {screen: Announcer }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    transparentCard: true,
    cardStyle: {
      backgroundColor: "rgba(0,0,0,0)",
      shadowColor: "#000",
      shadowOffset: {
      	width: 0,
      	height: 12,
      },
      shadowOpacity: 0.60,
      shadowRadius: 20.00,

      elevation: 24,
    }
  }
);

export default createAppContainer(ModelNavigator);
