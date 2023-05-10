/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,TextInput,Alert,
  StatusBar,Button,Image,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerContent } from './screen/DrawerContent';

import SettingsScreen from './screen/setting';
const Stack = createStackNavigator();

const HomeScreen = ({navigation}) => {
const [data, setData] = React.useState({
  username: '',
  password: '',
  check_textInputChange: false,
  secureTextEntry: true,
  isValidUser: true,
  isValidPassword: true,
});

const textInputChange = (val) => {
  if( val.trim().length >= 4 ) {
      setData({
          ...data,
          username: val,
          check_textInputChange: true,
          isValidUser: true
      });
  } else {
      setData({
          ...data,
          username: val,
          check_textInputChange: false,
          isValidUser: false
      });
  }
}

const handlePasswordChange = (val) => {
  if( val.trim().length >= 8 ) {
      setData({
          ...data,
          password: val,
          isValidPassword: true
      });
  } else {
      setData({
          ...data,
          password: val,
          isValidPassword: false
      });
  }
}

  return (
    <View style={styles.container}>
            <Image style={styles.tinyLogo} source={require("./images/icon.png")} />
        <Text>Welcom Zeeshan</Text>

<View style={styles.button}>
<Button
        style={styles.button}
       title="View Pay SLip"
        // onPress={()=> navigation.navigate('Details')}
       />
</View>
<View style={styles.button}>  
       <Button
       title="Manage Anual Leave"
        // onPress={()=> navigation.navigate('Details')}
       />
       </View>
    </View>
  //   <View style={styles.container}>
        
  //           <Image style={styles.tinyLogo} source={require("./images/icon.png")} />

  //      <Text>Nomisma Employee</Text>

  //      <TextInput
  //         onChangeText={(val) => textInputChange(val)}
  //          style={styles.input}
  //         placeholder="User Name"
  //       />
  //       <TextInput
  //                style={styles.input}
  //               placeholder="Password"
  //               secureTextEntry={true}
  //               // onChangeText={e => this.setState({ password:e })}
  //               onChangeText={(val) => handlePasswordChange(val)}
  //             />
  //  <View>
  //   <Button
  //      title="Login"
  //      style={styles.login}
  //       onPress={()=> navigation.navigate(SettingsScreen)}
  //      />
  //      </View>
  //      <Button
  //      title="Forgot Password"
  //       onPress={()=> navigation.navigate('Details')}
  //      />
       
  //   </View>  
   );
};


const Drawer = createDrawerNavigator();

const App =() =>{
  return(
    <NavigationContainer>

    <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="SettinScreen" component={SettingsScreen} />
      </Drawer.Navigator>
     
     {/* <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Details" component={DetailsScreen} />
      </Drawer.Navigator> */}
    
     {/* <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>  */}
    </NavigationContainer>
  );
}


export default App;
const styles = StyleSheet.create({
  inputext: {
    width: 200,
    height: 44,
    padding: 10,
    textAlign:'center',
    fontWeight:'bold',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C3EBEB',
  },
  login:{
    margin: 2,
    paddingBottom:3 ,
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
  button:{
    width: 300,
    margin: 14
  }
});