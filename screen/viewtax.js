// import React from 'react';
import { View, Text, StyleSheet,Image,TextInput,AsyncStorage,Alert,ToastAndroid,AlertIOS,Platform} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicicon from 'react-native-vector-icons/Ionicons';
import { Container, Header,Title, Content, Body,Button} from 'native-base';

export default App = ({route,navigation}) => {
  const [data, setData] = useState([]);
  const { year } = route.params;
  const [data2, setData2] = useState({
    url0:'',
    url0status:'',
    url1:'',
    url1status:'',
    url2:'',
    url2status:'',
    title1:'Approved Tax Calculation',
    title2:'Signed Self-Assessment Forms',
    title3:'Signed Self-Assessment Summary',
  });

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

  useEffect(() => {
    
    AsyncStorage.getItem('urlPrefix').then(ress => {
      AsyncStorage.getItem('userDetails').then(res => {
    var userDetails = JSON.parse(res);
    // const url="http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/"+userDetails.AuthToken+"/ShowSignDocument?SATaxYearCode="+year;
    const url="http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/ShowSignDocument?SATaxYearCode="+year;
     
          console.log("URL === ",url);
          fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',  
              AuthToken:userDetails.AuthToken
            },
    
          })
          .then((response) => response.json())
          .then((json) =>{
            if(json){
              console.log("JSON ================================= ",json);  
              data2.url0=json[0].url;
              data2.url0status=json[0].Status;
              data2.url1=json[1].url;
              data2.url1status=json[1].Status;
              data2.url2=json[2].url;
              data2.url2status=json[2].Status;
              if(json[0].Status==1){
                data2.title2='Approved Self-Assessment Forms';
                data2.title3='Approved Self-Assessment Summary';
              }
              setData(json);  
              console.log(" data2 === ",data);
            }
            else if(json.ErrorCode==2002){
              AsyncStorage.clear();
              // commingSoon(json.Description,'Please Login!');
              navigation.navigate('Login');
              AlertMessage(json.Description);
            } 
          
          })
  
      })
    })

  }, []);

  

      return (  
        <Container>
          <Header style={styles.Header}>

          <Button  onPress={()=> navigation.goBack(null)} transparent>
            <Text onPress={()=> navigation.go}><Ionicicon  onPress={()=> navigation.goBack(null)} name="arrow-back" size={18} color="#fff" /></Text>
          </Button>

          <Body  style={{alignItems:"center"}}>
            <Title>View Tax Return</Title>
          </Body> 
          </Header>
        <Content>
     

<View style={styles.contentcont}>
       
 <View style={styles.keyfig}>
    <Title style={styles.teal_text}>View Tax Return</Title>
    </View>
  

    {data2.url1=='' ?<View>

  </View>: 
<Button  onPress={()=>navigation.navigate('viewPdf',{title:data2.title1,year:year, id:'456',url:data[1].url}) }  style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>Approved Tax Calculation</Text>
      <Text style={styles.body_text1}><Icon name="eye" size={20} color="#fff" /></Text>
    </View>
</Button>
}

{data2.url0=='' ?<View>

  </View>: 
<Button onPress={()=> navigation.navigate('viewPdf',{title:data2.title2,year:year, id:'123',url:data[0].url})}   style={styles.btnfull} block>
    <View  style={styles.row_text1}>
    {data2.url0status==0 ?<Text style={styles.text}>Signed Self-Assessment Forms</Text>:
    <Text style={styles.text}>Approved Self-Assessment Forms</Text>
    }
      <Text style={styles.body_text1}><Icon name="eye" size={18} color="#fff" /></Text>
    </View>
</Button>
}

{data2.url2=='' ?<View>

  </View>: 
<Button  onPress={()=> navigation.navigate('viewPdf',{title:data2.title3,year:year, id:'123',url:data[2].url})}  style={styles.btnfull} block>
    <View  style={styles.row_text1}>
    {data2.url2status==0 ?<Text style={styles.text}>Signed Self-Assessment Summary</Text>:
    <Text style={styles.text}>Approved Self-Assessment Summary</Text>
    }
      <Text style={styles.body_text1}><Icon name="eye" size={20} color="#fff" /></Text>
    </View>
</Button>
}
  </View>
  </Content>


        
{/* 
    <View style={styles.container}>
      
        <Image style={styles.tinyLogo} source={require("../images/icon.png")} />
   

      {data.UserType=='Employee' ?  
      <Text
      style={styles.log_btn}
      onPress={()=> navigation.navigate('payslip')}
      ><Icon name="money" size={18} color="#fff" />  View Payslip</Text>
      :null}

{data.UserType=='Employee' ? 
   <Text
   style={styles.log_btn}
     onPress={()=> navigation.navigate('attendence')}
   ><Icon name="calendar" size={18} color="#fff" />  Annual Leave</Text>
      :null}
  
   {data.UserType=='Employee' ? 

   <Text
    style={styles.log_btn}
     onPress={()=> navigation.navigate('profile2')}
   > <Icon name="user" size={18} color="#fff" />  Profile</Text>
    :null}

   

   {data.UserType=='Employee' ? 

     <Text
     style={styles.disable_btn} 
      ><Icon name="briefcase" size={18} color="#fff" />  Expense Management</Text>
     :null}

  
   
     {data.UserType=='Employer' ? 
     <Text
     style={styles.log_btn}
        onPress={()=> navigation.navigate('employeeList')}
      ><Icon name="user" size={18} color="#fff" style={styles.lefticon} />  Employees </Text>
     :null}
      
     
     {data.UserType=='Employer' ? 
     <Text
     style={styles.disable_btn}
      ><Icon name="calendar" size={18} color="#fff" style={styles.lefticon} />  Annual Leave Management</Text>
      :null}

     {data.UserType=='Employer' ? 
     
     <Text
     style={styles.disable_btn}
      ><Icon name="gbp" size={18} color="#fff" style={styles.lefticon} />  Expense Management</Text>
      :null }
      

</View> */}

{/* <View style={styles.container}>
      
      <Image style={styles.tinyLogo} source={require("../images/icon.png")} />

     <Text
     style={styles.log_btn} onPress={()=> Linking.openURL('https://www.gov.uk/pay-self-assessment-tax-bill?')}
      >Approved Tax Calculation <Icon name="eye" size={18} color="#fff" style={styles.lefticon} /> </Text>
   
    <Text
     style={styles.log_btn} onPress={()=> Linking.openURL('https://www.gov.uk/pay-self-assessment-tax-bill?')}
     >Signed Self-Assessment Forms <Icon name="eye" size={18} color="#fff" style={styles.lefticon} /></Text>

    <Text
     style={styles.log_btn} onPress={()=> Linking.openURL('https://www.gov.uk/pay-self-assessment-tax-bill?')}
     >Signed Self-Assessment Summary <Icon name="eye" size={18} color="#fff" style={styles.lefticon} /></Text>
  </View> */}

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

  contentcont:{
    margin:15,
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
  width:"80%",
  backgroundColor:"#43a1a2",
  borderRadius:5,
  paddingVertical:7,
  marginVertical:5,
  fontSize:16,
  height:40,
  margin: 5,
  textAlign:'center',
  color:'#ffffff',
 

},

lefticon:{

paddingLeft:30,
alignContent:"space-between"

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
text:{
  color:"#ffffff",
  fontSize:16,
  textAlignVertical:"center",
},

keyfig:{
  color:"#43a1a2",
  borderBottomColor: '#43a1a2',
  borderBottomWidth: 1,
  paddingBottom:10,
  fontSize:16,
  marginTop:20,
 
},
teal_text:{
  color:"#43a1a2",
  fontSize:20,
},

body_text:{
  color:"#000000",
  fontSize:20,
  textAlign:"left"
},


body_text1:{
  color:"#000000",
  fontSize:20,
  textAlignVertical:"center",

},
row_text:{
  flexDirection: 'row', flex:1, marginTop:20, justifyContent:"space-between",
},

row_text1:{
  flexDirection: 'row', flex:1, justifyContent:"space-between",
},


});