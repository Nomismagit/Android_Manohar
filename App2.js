import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,createAppContainer } from '@react-navigation/stack';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login from './login';

import HomePage from './home';
import CompanyList from './companyList';

const AppNavigator = StackNavigator({
  SettingScreen: { screen: CompanyList },
  HomeScreen: { screen: HomePage }
});

export default class App extends Component {
  render() {
    return (  
      <AppNavigator />
    );
  }
  
}