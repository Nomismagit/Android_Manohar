// import React from 'react';
import { View, Text, StyleSheet,ToastAndroid,Image,TextInput,AsyncStorage,Alert,ScrollView,Touchable, TouchableOpacity,Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { Container, Header,Title, Body,Button,Toast} from 'native-base';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import PDFView from 'react-native-view-pdf';

export default App = ({route,navigation}) => {
  const [data, setData] = useState([]);
  const { title } = route.params;
  const { url } = route.params;
  const { id } = route.params;
  const { year } = route.params;

  useEffect(() => {
    AsyncStorage.getItem('userDetails').then(res => {
        setData(JSON.parse(res));
     
    })

  }, []);


  
  const approve = () => {

    AsyncStorage.getItem('urlPrefix').then(ress => {
    AsyncStorage.getItem('userDetails').then(res => {
    console.log("Approved Function is hit");
    result =JSON.parse(res);

  // const url = "http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/"+ result.AuthToken+"/PostPersonFormApproveSataus";
  const url = "http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/PostPersonFormApproveSataus";

  console.log("URL   ==== ",url);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AuthToken:result.AuthToken

      },

      body: JSON.stringify([{
        formid: id,
        Status:1,
        SATaxYearCode:year
      }])
  })
      .then((response) => response.json())
      .then((json) =>{
        console.log("API Response === ",json);
        navigation.navigate('HomePage'); 
        ToastAndroid.show(json.Description, ToastAndroid.SHORT)
      

      })

    })
  })
    }


      return (  

        <Container>
          <Header style={styles.Header}>

          <Button  onPress={()=> navigation.goBack(null)} transparent>
            <Text onPress={()=> navigation.go}><Icon  onPress={()=> navigation.goBack(null)} name="arrow-back" size={18} color="#fff" /></Text>
            </Button>
           <Body  style={{alignItems:"center"}}>
            <Title> {title}</Title>
            </Body>   
          </Header>
          
          

      <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1, justifyContent:'center',marginTop:0  }}
          resource={url}      
        />
        <View style={{flexDirection:"row",  backgroundColor:'#E8E8E8',
  padding:18,   alignItems:"center", }}>
        <Text
          onPress={()=> Linking.openURL(url)}
         style={styles.log_btn}
         > <Icon   name="download" size={25} color="#ffffff" />   Download</Text> 
        </View>
      </Container>

      );
    };
    

const styles = StyleSheet.create({

  Header:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#43a1a2',
    color:'#ffffff'
  },
  
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
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
    backgroundColor: '#fff',
  },
  login:{
    margin: 2,
    paddingBottom:3 ,
  },
  tinyLogo: {
    width: 100,
    height: 100,
    marginBottom:10,
    marginTop:20
  },
  button:{
      width: "80%",
      height:50,
      margin: 5,
      borderRadius:5,
      marginVertical:5,
      paddingVertical:5, 
    },
 disable_btn:{
  width:"80%",
  backgroundColor:"#a1a2a2",
  borderRadius:5,
  paddingVertical:7,
  marginVertical:5,
  fontSize:16,
  height:40,
  margin: 5,
  textAlign:'center',
  color:'#ffffff',
 },

 log_btn:{
  width:"100%",
  backgroundColor:"#43a1a2",
  borderRadius:5,
  paddingVertical:6,
  marginVertical:5,
  fontSize:16,
  height:43,
  marginLeft:0,
  textAlign:'center',
  color:'#ffffff',
},

btnfull:{
  backgroundColor: '#43a1a2',
  marginTop:20,
  padding:20,
  borderRadius:5,
  color:"#ffffff",
},

lefticon:{
paddingLeft:30,
alignContent:"space-between"
}

});