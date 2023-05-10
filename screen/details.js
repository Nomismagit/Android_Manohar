import React from 'react';
import { View, Text,  StyleSheet,Image,TextInput,Alert,ActivityIndicator,ToastAndroid,AlertIOS,Platform} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Left, Body, Right, Button, Item, Input, Footer,FooterTab,Content,  Card, Title, Row } from 'native-base';
const Login = ({navigation}) => {
    const [data, setData] = React.useState({
      username: '',
      dataBase:'sandboxpre',
      isloading:false
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

    const dataBaseChange = (val) => {
      if( val.length >= 1 ) {
          setData({
              ...data,
              dataBase: val,
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
    

    const forgotPassword = () => {
          if ( data.username.length == 0  || data.dataBase.length ==0) {
              AlertMessage('Username  field cannot be empty.');
              // this.state.spinner =true;
              return;
          }else{
  
            let input =data.username;
            let fields = input.split('/');
            let prefix = fields[0].toLocaleLowerCase();
            let name = fields[1];

          var format = /[/]/;
          var charseT = input.match(format);
          if(charseT==null){
            prefix='live';
            name=input;
          }

           if(prefix=='sandbox4' || prefix=='dns' || prefix=='live' || prefix=='sandboxpre' || prefix=='sandbox' || prefix=='dnsgroup' && name){

            setData({
              ...data,
              isloading: true,
            
          });
                let url ="http://"+prefix+".nomismasolution.co.uk/AccountREST/AccountService.svc/"+prefix+"/ForgotPassword?LoginName="+name;  
                  fetch(url, {
                      method: 'GET',
                      //Request Type 
                  })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    setData({
                      ...data,
                      isloading: false,
                    
                  });
                      var SampleArray =responseJson ;
                      if(SampleArray.IsSuccess==true){
                             navigation.navigate('Login');
                            
                             AlertMessage(' A password reset link has been sent to the email address associated with your account');

                      }else{
                        setData({
                          ...data,
                          isloading: false,
                        
                      });
                         
                          AlertMessage(SampleArray.Description);
                      }
                  })
                  //If response is not in json then in error
                  .catch((error) => {
                      AlertMessage('Something went wront.');
                      console.error(error);
                  });
                }else{
                AlertMessage('Please enter a valid prefix and user name.');

                }
          } 
         
      }
      
    
      return (
        <Container>
        <View style={styles.contentcont}>
          
          <View style={{marginBottom:40,}}>
          <Image style={styles.tinyLogo} source={require("../images/icon.png")} />
           <Text style={{ fontSize:14, color:"#43a1a2"}}>Self-Assessment</Text>
           </View>

           <View>
                      <Text style={styles.body_text1}>Enter your username and we will send
you a link to create a new password</Text>
                  </View>
                  <Item style={{ borderColor: "#43a1a2",   borderBottomWidth: 2, }}>
                      <Icon name="envelope-o" size={25} color="#9E9E9E" style={{ marginLeft: 15, }} />
                      <Input style={{ marginLeft: 20, }} onChangeText={(val) => textInputChange(val)} placeholder='myname@myaccounts.com' />
                  </Item>
                  <Button onPress={()=> forgotPassword() } style={styles.btnfull} block>
                      <View>
                          <Text  style={styles.text}>SEND</Text>

                      </View>
                  </Button>



           {/* <TextInput
              onChangeText={(val) => textInputChange(val)}
               style={styles.input}
              placeholder="Enter Your User Name"
            /> */}
           
       

           {/* <Text
           style={styles.log_btn}
           onPress={()=> forgotPassword() }
           >Forgot Password</Text> */}
           
           <Text style={styles.teal_text}  onPress={()=> navigation.navigate('Login')}>Back to login</Text>

           
        </View>  
      </Container>
      );
    };
    
export default Login;

const styles = StyleSheet.create({
    inputext: {
      width:"80%",
      backgroundColor:'#eee',
      borderRadius:5,
      paddingLeft:10,
      marginVertical:10,
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
      marginVertical:10,
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
     width:80, height:80, alignSelf:"center"
    },

    button: {
      width:'80%',
      backgroundColor:'rgba(255, 255, 255, 0.3)',
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

    lefttext: {
      fontSize: 18,
      fontWeight: '600',
      color:'#ffffff',
     textAlignVertical:"center"
  
    },
   
    header: {
      backgroundColor: '#43a1a2',
    },
  
    footer: {
      backgroundColor: '#43a1a2',
    },


    contentcont:{
      margin:20,
      flex:1,
      justifyContent:"center",
      alignItems:'center',
    },
  
    card: {
      backgroundColor: '#43a1a2',
      padding:20,
      alignItems:'center',
    },
  
  text:{
    color:"#ffffff",
    fontSize:20,
    textAlignVertical:"center",
  },
  
  btnfull:{
    backgroundColor: '#43a1a2',
    marginTop:20,
    padding:20,
    borderRadius:5,
    color:"#ffffff",
  },
  
  text1:{
    color:"#ffffff",
    fontSize:40,
    lineHeight:60,
    fontStyle: 'italic',
    fontWeight: 'bold',
  
    
  },
  
  keyfig:{
    color:"#43a1a2",
    borderBottomColor: '#43a1a2',
    borderBottomWidth: 1,
    paddingBottom:5,
    fontSize:16,
    marginTop:20,
   
  },
  
  
  teal_text:{
    color:"#43a1a2",
    fontSize:16,
   textDecorationLine:"underline",
   marginTop:30,
  },
  
  body_text:{
    color:"#9E9E9E",
    fontSize:18,
    textAlign:"left"
  },
  
  
  body_text1:{
    color:"#616161",
    fontSize:18,
    textAlign:"center",
    marginBottom:30,
    
  },
  
  
  row_text:{
    flexDirection: 'row', flex:1, marginTop:20, justifyContent:"space-between",
  },
  row_text1:{
    flexDirection: 'row', flex:1, justifyContent:"space-between",
  }
   
  });