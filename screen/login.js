import React,{useEffect} from 'react';
import { View, Text, Button,Touchable, StyleSheet,Image,TextInput,Alert,AsyncStorage,Linking, TouchableOpacity,ActivityIndicator,Route,ToastAndroid,AlertIOS,Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,createAppContainer } from '@react-navigation/stack';
import forgotPassword from './details';
import HomePage from './home';
import profile2 from './profile2';
import setting from './setting';
import companies from './companies';
import signaturepad from './signaturepad';
import browser from './browser';
import reviewtax from './reviewtax';
import viewtax from './viewtax';
import newsignaturepad from './oldsignaturepad';
import changePassword from './changePassword';
// import videoPdf from './viewPdf';
import DropDownPicker from 'react-native-dropdown-picker';
import OneSignal from 'react-native-onesignal'; 
// import Icon from 'react-native-vector-icons/Feather';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import viewPdf from './viewPdf';
// import viewtax from './viewtax';
const Stack = createStackNavigator();
const MainScreen = ({navigation}) => {

  useEffect(() => {
    console.log("USE Effect ================ Run");
    // OneSignal.init("0403edb6-4c19-4de9-83d6-abd337e12357",{kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
    OneSignal.init("f738cdff-3888-4896-b78e-baffd4bc45f0",{kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
    OneSignal.enableSound(true);
    OneSignal.inFocusDisplaying(2);
    OneSignal.enableVibrate(true);
    OneSignal.addEventListener('ids',onOpened);
    OneSignal.configure();
    AsyncStorage.getItem('userDetails').then(res => {
        var result = new Array();
        result =JSON.parse(res);
        if(result){
          navigation.navigate('HomePage');
        }else{
        console.log("You Don't have login");
        }
  })

  }, [onOpened]);

  const onOpened = (openResult) => {
    console.log("ID===================== ",openResult.userId);
    AsyncStorage.setItem('deviceid',openResult.userId);
  }


  let load=true;
    const [data, setData] = React.useState({
      username: '',   
      password: '',
      check_textInputChange: false,
      secureTextEntry: true,
      isValidUser: true,
      isValidPassword: true,
      dataBase:'sandboxpre',
      icon:'eye-slash',
      isloading:false
    });
    

    const [loading, setLoading] = React.useState();
   
    const textInputChange = (val) => {
      if( val.trim().length >= 1 ) {
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
    
    const handlePasswordChange = (val) => {
      if( val.trim().length >= 1 ) {
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
    
    const updateSecureTextEntry = () => {

          setData({
              ...data,
              secureTextEntry: !data.secureTextEntry     
          });

          if(data.secureTextEntry ==true){
            data.icon ='eye'
          }else{
            data.icon ='eye-slash'
          }
    }

    const stop=()=>{
         
      setData({
        ...data,
        isloading: false, 
    });

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

  
    const loginHandle = (userName,Password) => {
        if ( data.username.length == 0 || data.password.length == 0 || data.dataBase.length ==0) {
          AlertMessage('Username or password field cannot be empty.');
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
         if(prefix=='sandbox4' || prefix=='sandbox2' || prefix=='dns' || prefix=='live' || prefix=='sandboxpre' || prefix=='sandbox' || prefix=='dnsgroup'  && name){
          setData({
            ...data,
            isloading: true,
          
        });
              
        AsyncStorage.getItem('deviceid').then(id => {
          console.log("Device ID   ==== ",id," Platform.OS   ",Platform.OS);
              // let url ="http://"+prefix+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+prefix+"/AuthoriseSA?LoginName="+name+"&Password="+data.password;  
              let url ="http://"+prefix+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+prefix+"/AuthoriseSA";  
              console.log("URL ==== ",url);
              // return
              if(id){
              fetch(url, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',  
                  },
          
                  body: JSON.stringify({
                    LoginName:name,
                    Password: data.password,
                    playerid:id,
                    platform:Platform.OS
                  })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                  console.log("Resonse  === ",responseJson);
                  setData({
                    ...data,
                    isloading: false,
                  
                });
                    var SampleArray =responseJson ;
                    if(SampleArray.IsSuccess==true){
                        AsyncStorage.setItem('userDetails',JSON.stringify(SampleArray.ResultInfo));
                         AsyncStorage.setItem('urlPrefix',prefix);
                         AsyncStorage.setItem('year','');
                         navigation.navigate('HomePage'); 
                    }else{
                      
                      console.log("Eroor MSG ======",SampleArray.Description);
                        AlertMessage(SampleArray.Description);

                    }
                })
                //If response is not in json then in error
                .catch((error) => {
                  console.log("Error ==== ",error);
                  setData({
                    ...data,
                    isloading: false,
                  
                });
                    
                    AlertMessage('Something went wrong.');

                    // console.error(error);
                });

              }else{
                console.log("No Device ID ")
              }

              })
              }else{
              //   Alert.alert('Try Again!', 'Please enter a valid prefix and user name.', [
              //     {text: 'Okay'}
              // ]);

              AlertMessage('Please enter a valid prefix and user name.');


              }

        } 
       
    }
    
      return (
        // My Code
        
            <View style={styles.container}>
                <Image style={styles.tinyLogo} source={require("../images/icon.png")} />
               <Text style={{ fontSize:16, color:"#43a1a2"}}>Self Assessment</Text>
      
              <View all={0}>
                 <ActivityIndicator animating={data.isloading} color="#43a1a2"   size="large" />
             </View>
      
      
        
           <TextInput
              onChangeText={(val) => textInputChange(val)}
               style={styles.input}
              placeholder="User Name"
            />
           
           <View style={styles.textBoxcontainer}>
            <TextInput
                     style={styles.input}
                    placeholder="Password"
                    secureTextEntry={data.secureTextEntry ?true : false}
                    onChangeText={(val) => handlePasswordChange(val)}
                  />

                  <TouchableOpacity  style={styles.thouchablebtn}
                    onPress={updateSecureTextEntry}
                  >
                    {data.secureTextEntry ?
              <Icon name='eye-slash' size={18} color="#a1a1a1" />
              // <FontAwesome icon={SolidIcons.smile} />
                     :
                     <Icon name='eye'  size={18} color="#a1a1a1" />
                    // <FontAwesome icon={SolidIcons.smile} />

                    }
                  </TouchableOpacity>

           </View>


                   
                  <TouchableOpacity style={styles.log_btn} onPress={() => {loginHandle(data.username, data.password )}} >
                <Text style={styles.btn_text}>Login</Text>
                </TouchableOpacity>
           <Text style={{marginVertical:10, color:"#828282", textDecorationLine: 'underline'}}  onPress={()=> navigation.navigate('FrgotPassword')}>Forgot Password?</Text>

           {/* <Text style={{ color:"#828282"}} onPress={()=> Linking.openURL('https://www.nomismasolution.co.uk/freetrial')}> 
          Don't have an account yet? <Text style={{fontWeight:'bold', color:"#727274", textDecorationLine: 'underline' }}>Sign up</Text>
          </Text> */}
           
        </View>  
      );
    };
    
    const Login = () => {

      
        return(
        <NavigationContainer>
           <Stack.Navigator>
             <Stack.Screen name="Login" options={{headerShown: false}} component={MainScreen} />
             <Stack.Screen name="FrgotPassword" options={{headerShown: false,  }} component={forgotPassword} />
             <Stack.Screen name="browser" options={{headerShown: false,  }} component={browser} />
             <Stack.Screen name="newsignaturepad" options={{headerShown: false,  }} component={newsignaturepad}/>
             <Stack.Screen name="reviewtax" options={{headerShown: false,  }} component={reviewtax} />
             <Stack.Screen name="viewtax" options={{headerShown: false,  }} component={viewtax} />
             <Stack.Screen name="HomePage" options={{headerShown: false}} component={HomePage} />
             <Stack.Screen name="profile2"  options={{headerShown: false}} component={profile2}/>
             <Stack.Screen name="changePassword"  options={{headerShown: false}} component={changePassword}/>
             <Stack.Screen name="setting" options={{headerShown: false }} component={setting}/>
             <Stack.Screen name="signaturepad"  options={{headerShown: false}} component={signaturepad}/> 
             <Stack.Screen name="viewPdf"  options={{headerShown: false}} component={viewPdf}/> 
             <Stack.Screen name="companies" options={{title: 'Choose Company',headerTintColor: 'white', headerLeft: null,headerStyle: {backgroundColor: '#43a1a2',  }}} component={companies}/>
          </Stack.Navigator>  
        </NavigationContainer>
        )  
    }

export default Login;




const styles = StyleSheet.create({

  spiner: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  container:{
    // backgroundColor: '#43a1a2',
    backgroundColor: '#fff',

    flex:1,
    justifyContent:'center',
    alignItems:'center',

    
  },
  welcometext:{
    color:'#fff',
    fontSize:18,
  },
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
   
    login:{
      margin: 2,
      paddingBottom:3 ,
    },   
    stop:{
      margin: 3,
      paddingBottom:2 ,
    },
    tinyLogo: {
      width: 100,
      height: 100,
      marginBottom:0,
    },
    spinnerTextStyle: {
        color: '#FFF'
      },
      button:{
        width: 300,
        margin: 14
      },
      signup:{
        textAlign: "center"
      },
      
      log_btn:{
        width:"80%",
        backgroundColor:"#43a1a2",
        borderRadius:5,
        paddingVertical:10,
        marginVertical:10,
        fontSize:20,
        height:45,
        borderWidth:null,
        textAlign:'center',
        
      },
      
      btn_text:{
        color:'#ffffff',
        fontWeight:'300',
        textAlign:'center',
        fontSize:18,
      },
    
      textBoxcontainer:{
        width:"100%",
      position:'relative',
      alignItems:'center',
      justifyContent:'center',
      },
    
      thouchablebtn:{
       position:'absolute', 
       right:35,
       width:35,
       height:40,
       padding:2,
       paddingVertical:10,
      },
  });