import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import { Provider }
from "react-redux";

import store from "./redux/store";

import AppNavigator
from "./navigation/AppNavigator";

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;