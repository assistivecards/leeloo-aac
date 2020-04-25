import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import { Easing, Animated } from 'react-native';

import Cards from './layouts/Cards'
import Drawer from './layouts/Drawer'
import Profile from './layouts/Profile'
import Announcer from './layouts/Announcer'

import Account from './layouts/Account'
import Language from './layouts/Language'
import Voice from './layouts/Voice'
import Notification from './layouts/Notification'
import Browser from './layouts/Browser'

const AppNavigator = createStackNavigator({
    Cards: { screen: Cards },
    Drawer: { screen: Drawer },
    Profile: { screen: Profile },
    Account: { screen: Account },
    Browser: { screen: Browser },
    Language: { screen: Language },
    Voice: { screen: Voice },
    Notification: { screen: Notification },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
);
function forVertical(props) {
  const { layout, position, scene } = props;

  const index = scene.index;
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: ([index - 1, index, index + 1]: Array<number>),
    outputRange: ([height, 0, 0]: Array<number>)
  });

  return {
    transform: [{ translateX }, { translateY }]
  };
}
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
    },
    transitionConfig: () => ({ screenInterpolator: forVertical })

  }
);

export default createAppContainer(ModelNavigator);
