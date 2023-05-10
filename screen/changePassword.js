import { View, Text, StyleSheet,Image,TextInput,Alert,ToastAndroid,AlertIOS,Platform } from 'react-native';
import React, { useEffect, useState } from 'react';

import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AsyncStorage } from 'react-native';
import { Container, Header,Title, Body,Button} from 'native-base';

// export default App = ({route,navigation}) => {

  export default App = ({navigation}) => {

  const [userName, setUserName] = React.useState([]);
    const [data, setData] = React.useState({
      username: AsyncStorage.getItem('userDetails'),
      dataBase:AsyncStorage.getItem('urlPrefix'),
      password:'',
      NewPassword:'',
      ConfirmPassword:''

    });


    useEffect(() => {
      AsyncStorage.getItem('userDetails').then(res => {
        console.log("User st============================== ",JSON.parse(res));
        setUserName(JSON.parse(res));
      })
      
    })

    const validatePassword = () => {
      var passwodRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/
      var check =passwodRegex.test(data.ConfirmPassword);
      var check2 =passwodRegex.test(data.NewPassword);
      console.log("password=========== ",check);
      if(check && check2){
          return true
      }else{
         return false
    
      }

    }

    const AlertMessage = (message) => {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravityAndOffset(
          message,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
        return null;
      } else {
        AlertIOS.alert(Message);
      }
  }

    
    const forgotPassword = () => {
       
          if (  data.password.length ==0 || data.NewPassword.length==0 || data.ConfirmPassword.length==0 || !validatePassword()) {
      
              AlertMessage('8 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter')
              return;
          } else if(data.NewPassword !=data.ConfirmPassword){
               AlertMessage('New password & Confirm password are not match.')
          }

          
          
          else{
            
            AsyncStorage.getItem('urlPrefix').then(ress => {
              AsyncStorage.getItem('userDetails').then(res => {
                var result = new Array();
                result =JSON.parse(res);
                // let url ="http://"+ress+".nomismasolution.co.uk/AccountREST/selfAssessment.svc/"+ress+"/"+result.AuthToken+"/ChangePassword";  
                let url ="http://"+ress+".nomismasolution.co.uk/AccountREST/selfAssessment.svc/"+ress+"/ChangePassword";  

                fetch(url, {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        AuthToken:result.AuthToken

                      },
                      body: JSON.stringify({
                        LoginName: result.LoginName,
                        Password:data.password,
                        NewPassword:data.NewPassword,
                        ConfirmPassword:data.ConfirmPassword
                      })
                  })
                  .then((response) =>  response.json())
                  .then((responseJson) => {
                      var SampleArray =responseJson ;
                      if(SampleArray.IsSuccess==true){
                             navigation.navigate('HomePage');
                             AlertMessage( SampleArray.Description)

                      }else{

                        if(SampleArray.ErrorCode ==4004){
                          // navigation.navigate('Login');
                          AlertMessage( SampleArray.Description)

                        }else{
                          navigation.navigate('Login');
                          AlertMessage( SampleArray.Description)

                        }
                      }
                  })
                  //If response is not in json then in error
                  .catch((error) => {
                    console.error("Error ===== ",JSON.parse(error));
                      Alert.alert('Wrong Input!', JSON.parse(error), [
                          {text: 'Okay'}
                      ]);
                      
                  });
                });
                });
          } 
         
      }
      
    
      return (
    
        <Container>
        <Header style={styles.Header}>

        <Button  onPress={()=> navigation.goBack(null)} transparent>
          <Text onPress={()=> navigation.go}><Icon  onPress={()=> navigation.goBack(null)} name="angle-left" size={18} color="#fff" /></Text>
          </Button>
         <Body  style={{alignItems:"center"}}>
          <Title>Change Password</Title>

          </Body> 
          
        </Header>
        <View style={styles.container}>
          <Image style={styles.tinyLogo} source={require("../images/icon.png")} />
           <Text style={{marginBottom:30, fontSize:16, color:"#43a1a2"}}>{userName.LoginName}</Text>

           <TextInput
                style={styles.input}
                placeholder="Old Password"
                secureTextEntry={true}
                onChangeText={e => {data.password =e}}
            />
           
           <TextInput
                     style={styles.input}
                    placeholder="New Password"
                    secureTextEntry={true}
                    onChangeText={e => {data.NewPassword=e}}
            />
            <TextInput
                     style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={e => {data.ConfirmPassword=e}}
                   
            />
       <View>
      
           </View>
           <Text
           style={styles.log_btn}
           onPress={()=> forgotPassword() }
           >Change Password</Text>
           
        </View>  
        </Container>
      );
    };
    
// export default Login;

const styles = StyleSheet.create({ 
  Header:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#43a1a2',
    color:'#ffffff'

  },
  inputext: {
    width:"80%",
    backgroundColor:'#eee',
    borderRadius:5,
    paddingLeft:10,
    marginVertical:5,
    fontSize:16,
    color:'#000',
    height:40,
    alignItems:'stretch',
  },
  input: {
    width:"80%",
    backgroundColor:'#eee',
    borderRadius:5,
    paddingLeft:10,
    marginVertical:5,
    fontSize:16,
    color:'#000',
    height:40,
    alignItems:'stretch',
  },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    login:{
      margin: 2,
      paddingBottom:3 ,
    },
    tinyLogo: {
      width: 100,
      height: 100,
    },
    button: {
      width:'80%',
      backgroundColor:'rgba(255, 255, 255, 0.3)',
      marginVertical:15,
    },

    log_btn:{
      width:"80%",
      backgroundColor:"#43a1a2",
      borderRadius:5,
      paddingVertical:7,
      marginVertical:10,
      fontSize:16,
      height:40,
      margin: 5,
      textAlign:'center',
      color:'#ffffff',
     
    
    },
  });