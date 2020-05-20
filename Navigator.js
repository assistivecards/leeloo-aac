import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import { Easing, Animated } from 'react-native';

import Home from './layouts/Home'
import Cards from './layouts/Cards'
import Settings from './layouts/Settings'
import Profile from './layouts/Profile'
import New from './layouts/New'
import Announcer from './layouts/Announcer'

import Account from './layouts/Account'
import Language from './layouts/Language'
import Voice from './layouts/Voice'
import Notification from './layouts/Notification'
import Browser from './layouts/Browser'
import Remove from './layouts/Remove'
import Packs from './layouts/Packs'
import Avatar from './layouts/Avatar'
import Subscription from './layouts/Subscription'

const AppNavigator = createStackNavigator({
    Home:         { screen: Home          },
    Cards:        { screen: Cards         },
    Settings:     { screen: Settings      },
    Profile:      { screen: Profile       },
    New:          { screen: New           },
    Account:      { screen: Account       },
    Browser:      { screen: Browser       },
    Language:     { screen: Language      },
    Voice:        { screen: Voice         },
    Notification: { screen: Notification  },
    Remove:       { screen: Remove        },
    Packs:        { screen: Packs         },
    Avatar:       { screen: Avatar        },
    Subscription: { screen: Subscription  },
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
  const opacity = position.interpolate({
    inputRange: ([index - 1, index, index + 1]: Array<number>),
    outputRange: [0, 1, 0]
  });

  return {
    transform: [{ translateX }, { translateX }],
    opacity
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
    defaultNavigationOptions: {
      headerVisible: false,
      gesturesEnabled: false,
    },
    cardStyle: {
      backgroundColor: 'transparent',
      opacity: 1,
    },
    transparentCard: true,
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
      },
      containerStyle: {
        backgroundColor: 'transparent',
      }
    })
  }
);

export default createAppContainer(ModelNavigator);
