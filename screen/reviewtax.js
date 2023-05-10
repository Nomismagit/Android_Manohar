// import React from 'react';
import { View, Text, StyleSheet,Image,TextInput,AsyncStorage,Alert,ToastAndroid,AlertIOS,Platform
,  ScrollView,Touchable, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Container, Header,Title, Content, Card, CardItem, Body,Button} from 'native-base';
export default App = ({route,navigation}) => {
  const [data, setData] = useState([]);
  const [digitalName, setSigital] = useState();
  const [digitalsignature, setSignature] = useState();
  const [urlforreview, setReview] = useState([]);
  const [selfAssessmentform, setSaStatus] = useState([]);
  const [taxCalculation, setTaxCal] = useState([]);
  const [selfAssessment, setSelfAssessent] = useState([]);
  const [selectedyear, setYear] = useState([]);
  const { year } = route.params;
  const differentFont = "Dan'sDisneyUI";


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
  setData(JSON.parse(res));
  // const url="http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/"+userDetails.AuthToken+"/GetSAForm?SATaxYearCode=7";
  const url="http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/GetSAForm?SATaxYearCode="+year;

  console.log("Review === ",url, " Token  ============ ",userDetails.AuthToken);
  fetch(url,{
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',  
      AuthToken:userDetails.AuthToken
    }})
        .then((response) => response.json())
        .then((json) =>{
          if(json){
            console.log("JSON ==== ",json);
            //  setReview(json);
            data.pageData =json;
            data.saStaus = json[0].Status;
            data.saurl =json[0].url;
            setSaStatus(json[0]);
            setTaxCal(json[1]);
            setSelfAssessent(json[2]);               
          }
          else if(json.ErrorCode==2002){
            AlertMessage(json.Description);
            navigation.navigate('Login');
          } 
        
        })

    })
  })
  }, []);

  const generatdigtalsignatire = () => {
      if(digitalName){
        setSignature(digitalName)
      }else{
        AlertMessage('Please Type signature.');
      }
  }


  const openSignatureboard = () =>{
      navigation.navigate('newsignaturepad',{id:'',digitalSignature:'',year:year})
   
  }

  const submit = () =>{
    // if(digitalsignature){
    //   navigation.navigate('newsignaturepad',{id:'123',digitalSignature:digitalsignature,year:year})
    // }else{
    //   AlertMessage('Please generate a digital signature.');
    // }

    if(digitalsignature){
      AsyncStorage.getItem('urlPrefix').then(ress => {
        AsyncStorage.getItem('userDetails').then(res => {
          var result = new Array();
          result =JSON.parse(res);
          // const url = "http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/"+ result.AuthToken+"/PostPersonSignDoc";
          const url = "http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/PostPersonSignDoc";

          console.log("URL  ========= ",url," STATe === ",digitalsignature," Year === ",year);

          console.log(" Requeest ====== ",JSON.stringify({
            id:'',
            Sign:'',
            name:digitalsignature,
            SATaxYearCode:year  
          }));
          
          fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              AuthToken:result.AuthToken

            },
    
            body: JSON.stringify({
              id:'',
              Sign:'',
              name:digitalsignature,
              SATaxYearCode:year  
            })
        })
            .then((response) => response.json())
            .then((json) =>{
              console.log("Jsonn ================ ",json);
            if(json.IsSuccess){
              navigation.push('HomePage');
              // this.props.navigation.push('HomePage');
              if (Platform.OS === 'android') {
                ToastAndroid.showWithGravityAndOffset(
                  json.Description,
                  ToastAndroid.LONG,
                  ToastAndroid.TOP,
                  25,
                  50
                );
              } else {
                AlertIOS.alert('Hello WOrld');
              }
                  
              }else{
                AlertMessage('Something Went wrong.')
              }
            
            })
            .catch((error) =>{
              console.error(error)
            }
            
            )
      
          })
          })

    }else{
      AlertMessage('Please generate a digital signature.');
    }
  }
  

      return (  
        <Container>
          <Header style={styles.Header}>
          <Button onPress={()=>navigation.navigate('HomePage')} transparent>
            <Text ><Icon  name="angle-left" size={18} color="#fff" /></Text>
          </Button>
            <Body  style={{alignItems:"center"}}>
              <Title>Review Tax Return</Title>
            </Body>   
          </Header>

          <Content>
 <View style={styles.contentcont}>
    <View style={styles.keyfig}>
    <Title style={styles.teal_text}>Review and Submit Documents</Title>
    </View>

    {selfAssessmentform.Status==0 ? 

<View style={{marginBottom:10, marginTop:15,}}>
<View style={{flexDirection:"row", textAlignVertical:"5"}}>
  <Text><Icon name="info-circle" size={24} color="#a1a2a3" /> </Text><Text style={styles.body_text2}>Document awaiting your review</Text></View>
  <Button onPress={()=> navigation.navigate('browser',{title:'Self Assessment Forms',year:year, id:selfAssessmentform.formid,url:selfAssessmentform.url})} style={styles.btnfull} block>
      <View style={styles.row_text1}>
          <Text style={styles.text}>Self Assessment Forms</Text>
          <Text style={styles.body_text1}><Icon name="eye" size={24} color="#fff" /></Text>
      </View>
  </Button>
</View>

   : 

   <View style={{marginBottom:20, marginTop:20,}}>
<View style={{flexDirection:"row",}}>
   <Text><Icon name="check" size={24} color="#43a1a2" /> </Text><Text style={styles.body_text2}>Document ready to submit</Text></View>
    <Button style={styles.btnfull_grey} block>
          <View style={styles.row_text1}>
              <Text style={styles.text}>Self Assessment Forms  </Text>
              <Text style={styles.body_text1}><Icon name="check" size={24} color="#fff" /></Text>
          </View>
    </Button>

  </View>
    }

         
{taxCalculation.Status==0 ?    
 <View style={{marginBottom:10, marginTop:15,}}>
  <View style={{flexDirection:"row", textAlignVertical:"5"}}>
    <Text><Icon name="info-circle" size={24} color="#a1a2a3" /> </Text><Text style={styles.body_text2}>Document awaiting your review</Text></View>
    <Button onPress={()=> navigation.navigate('browser',{title:'Tax Calculation',year:year, id:taxCalculation.formid,url:taxCalculation.url})} style={styles.btnfull} block>
        <View style={styles.row_text1}>
            <Text style={styles.text}>Tax Calculation</Text>
            <Text style={styles.body_text1}><Icon name="eye" size={24} color="#fff" /></Text>
        </View>
    </Button>
  </View> 
  :
  <View style={{marginBottom:10, marginTop:15,}}>
<View style={{flexDirection:"row",}}>
   <Text><Icon name="check" size={24} color="#43a1a2" /> </Text><Text style={styles.body_text2}>Document ready to submit</Text></View>
    <Button style={styles.btnfull_grey} block>
          <View style={styles.row_text1}>
              <Text style={styles.text}>Tax Calculation </Text>
              <Text style={styles.body_text1}><Icon name="check" size={24} color="#fff" /></Text>
          </View>
    </Button>

  </View>
  
  }


{selfAssessment.Status==0 ?    

    <View style={{marginBottom:10, marginTop:15,}}>
 <View style={{flexDirection:"row", textAlignVertical:"5"}}>
   <Text><Icon name="info-circle" size={24} color="#a1a2a3" /> </Text><Text style={styles.body_text2}>Document awaiting your review</Text></View>
    <Button onPress={()=> navigation.navigate('browser',{title:'Self Assessment Summary',year:year, id:selfAssessment.formid,url:selfAssessment.url})} style={styles.btnfull} block>
          <View style={styles.row_text1}>
              <Text style={styles.text}>Self Assessment Summary</Text>
              <Text style={styles.body_text1}><Icon name="eye" size={24} color="#fff" /></Text>
            </View>
    </Button>
</View>
:

<View style={{marginBottom:10, marginTop:15,}}>
<View style={{flexDirection:"row", textAlignVertical:"5"}}>

<Text><Icon name="check" size={24} color="#43a1a2" /> </Text><Text style={styles.body_text2}>Document ready to submit</Text></View>
    <Button style={styles.btnfull_grey} block>
          <View style={styles.row_text1}>
              <Text style={styles.text}>Self Assessment Summary </Text>
              <Text style={styles.body_text1}><Icon name="check" size={24} color="#fff" /></Text>
          </View>
    </Button>
  </View>

}

<View style={styles.keyfig}>
    {/* <Title style={styles.teal_text}>Type Signature</Title>  */}

    <View style={{flexDirection:'row'}}>
          <Text style={[styles.teal_text,]}>Type Signature</Text>
          {selfAssessment.Status==0 || taxCalculation.Status==0 || selfAssessmentform.Status==0? 

          <Text  style={[styles.teal_text1, { marginLeft:70,textAlign:'right'}]}>Draw Signature</Text>:
          <Text onPress={()=> openSignatureboard()} style={[styles.teal_text, { marginLeft:70,textAlign:'right'}]}>Draw Signature</Text>
          }
        </View>

    
    </View>
    <View style={{flexDirection:"row", textAlignVertical:"5"}}>
    <TextInput
    // defaultValue={data.LoginName}
    onChangeText={(item) => setSigital(item)}
    onBlur={() => generatdigtalsignatire()}
    style={styles.inputBox} underlineColorAndroid='rgba(0,0,0,0)' placeholder='Type Signature' />
    {/* <Button style={!digitalName ? styles.disabled2 : styles.genbtnfull} disabled={!digitalName} onPress={()=> generatdigtalsignatire()}  block>
              <Text style={styles.gentext}>Generate</Text>
    </Button> */}
    </View>

    <Card>
            <CardItem>
              <Body>
                {/* <Text style={{fontSize:26, alignSelf:"center", fontWeight: 'bold', textAlignVertical:"center",  }}> */}
                <Text style={{fontSize:26, alignSelf:"center",fontFamily: "Cochin", fontWeight: 'bold', fontStyle: 'italic' }}>
                
                {/* <Text style={{fontSize:26, alignSelf:"center", fontFamily: 'Pacifico',  }}> */}

                {digitalsignature}
                </Text>
              </Body>
              </CardItem>
              </Card>

   {selfAssessment.Status==0 || taxCalculation.Status==0 || selfAssessmentform.Status==0? 

        <Button style={ styles.disabled } disabled={!digitalsignature }   block>
          <View style={styles.row_text1}>
              <Text style={styles.text}>Submit</Text>
              <Text style={styles.body_text1}><Icon name="angle-right" size={24} color="#fff" /></Text>
          </View>
         </Button>
            :
            <Button style={!digitalsignature  ? styles.disabled : styles.btnfull} disabled={!digitalsignature } onPress={()=> submit()}  block>
          <View style={styles.row_text1}>
              <Text style={styles.text}>Submit</Text>
              <Text style={styles.body_text1}><Icon name="angle-right" size={24} color="#fff" /></Text>
          </View>

         </Button>
       }
          </View>

</Content>
  
{/* <View style={styles.container}>
      
        <Image style={styles.tinyLogo} source={require("../images/icon.png")} />

     <Text
     style={styles.log_btn} onPress={()=> navigation.navigate('browser',{title:'Self-Assessment Forms', id:'Hello',url:'https://www.wikipedia.org/'})}
      ><Icon name="user" size={18} color="#fff" style={styles.lefticon} />Self-Assessment Forms</Text>
   
    <Text
     style={styles.log_btn} onPress={()=> navigation.navigate('browser',{title:'Tax Calculation', id:'Hello',url:'https://www.wikipedia.org/'})}
      ><Icon name="user" size={18} color="#fff" style={styles.lefticon} />Tax Calculation</Text>

    <Text
     style={styles.log_btn} onPress={()=> navigation.navigate('browser',{title:'Self-Assessment Summary', id:'Hello',url:'https://www.wikipedia.org/'})}
      ><Icon name="user" size={18} color="#fff" style={styles.lefticon} />Self-Assessment Summary</Text>
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
contentcont:{
  margin:20,
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
marginTop:5,
padding:20,
borderRadius:5,
color:"#ffffff",
},

disabled:{
  backgroundColor: '#9e9e9e',
  marginTop:5,
  padding:20,
  borderRadius:5,
  color:"#ffffff",
},

disabled2:{
  backgroundColor: '#9e9e9e',
  marginTop:10,
  padding:10,
  borderRadius:5,
  color:"#ffffff",
  marginLeft:10,
  },

genbtnfull:{
  backgroundColor: '#43a1a2',
  marginTop:10,
  padding:10,
  borderRadius:5,
  color:"#ffffff",
  marginLeft:10,
  },
  gentext:{
    color:"#ffffff",
    fontSize:16,
    textAlignVertical:"center",
    },

btnfull_grey:{
  backgroundColor: '#9e9e9e',
  marginTop:5,
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


teal_text1:{
color:"#9e9e9e",
fontSize:15,
fontWeight: 'bold',
},

teal_text:{
  color:"#43a1a2",
  fontSize:15,
  fontWeight: 'bold',
  },

drawSignature:{
  color:"#43a1a2",
  fontSize:10,
  fontWeight: 'bold',
  textAlign:'right',
  flex:1

   },

body_text:{
color:"#000000",
fontSize:20,
textAlign:"left"
},


body_text1:{
color:"#000000",
fontSize:20,
},

body_text2:{
  color:"#000000",
  fontSize:14,
  fontStyle:"italic",
},


row_text:{
flexDirection: 'row', flex:1, marginTop:20, justifyContent:"space-between",
},
row_text1:{
flexDirection: 'row', flex:1, justifyContent:"space-between",
},


title:{
  color:"#43a1a2",
  fontSize:25,
  alignSelf:"center",
  fontWeight:'bold',
},

inputlabel:{
  color:"#000000",
  paddingBottom:0,
  fontSize:14,
  marginTop:5,
 
},
label_text:{
  color:"#000000",
  fontSize:18,
  paddingBottom:0,
},


inputBox:{

  borderRadius:5,
  paddingLeft:10,
  marginVertical:10,
  fontSize:16, 
  height:40,
  borderColor:'#ccc',
  borderWidth:1,
  width:'98%',
  
},

inputContainer: {
  justifyContent: 'center',
},
input: {
  height: 50,
},
icon: {
  position: 'absolute',
  right: 10,
  top:45,
  color:"#a1a2a3"
}


});