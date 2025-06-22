import { registerRootComponent } from 'expo';

import App from './App';

// Export the EpubReader component for use as a library
export { default as EpubReader } from './src/components/EpubReader';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
