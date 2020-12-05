import { registerRootComponent } from 'expo';
var Sound = require('react-native-sound');
Sound.setCategory('Playback'); // this will enable sound on silent mode

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
