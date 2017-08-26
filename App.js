import React from 'react';
import { StackNavigator } from 'react-navigation';

import EditScreen from './screens/EditScreen'
import HomeScreen from './screens/HomeScreen'
import RecordVideoScreen from './screens/RecordVideoScreen'

const App = StackNavigator({
  Home:{screen:HomeScreen},
  Edit:{screen:EditScreen},
  Record:{screen:RecordVideoScreen},
});

export default App;