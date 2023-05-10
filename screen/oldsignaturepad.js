import SignaturePad from 'react-native-signature-pad';
import { View, Text,Touchable, StyleSheet,Image,TextInput,Alert,AsyncStorage,ToastAndroid,Platform, AlertIOS, } from 'react-native';
import React, { Component,useEffect, useState,useRef } from 'react';
import { Container, Header,Title, Body,Button,Content,Card} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Actions, Router, Scene} from "react-native-router-flux";

export default class Demo extends Component {

  constructor(props,navigation) {
    super(props);
    this.state = {
      base64: "",
      pad:null,
      show:true,
      formId:this.props.route.params.id,
      signatureName:this.props.route.params.digitalSignature,
      year:this.props.route.params.year
    };
  }

   AlertMessage = (message) => {
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

// function GoToButton({ navigation, screenName }) {
//   navigation.navigate('HomePage');
  
// }


   submit(){
    console.log("STATE === ",this.state);
            if(this.state.base64){
              AsyncStorage.getItem('urlPrefix').then(ress => {
                AsyncStorage.getItem('userDetails').then(res => {
                  var result = new Array();
                  result =JSON.parse(res);
                  // const url = "http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/"+ result.AuthToken+"/PostPersonSignDoc";
                  const url = "http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/PostPersonSignDoc";

                  console.log("URL  ========= ",url," STATe === ",this.state);
                  fetch(url, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      AuthToken:result.AuthToken

                    },
            
                    body: JSON.stringify({
                      // id:this.state.formId,
                      Sign: this.state.base64,
                      name:'',
                      SATaxYearCode:this.state.year  
                    })
                })
                    .then((response) => response.json())
                    .then((json) =>{
                      console.log("Jsonn ================ ",json);
                    if(json.IsSuccess){
                      this.props.navigation.push('HomePage');
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
              AlertMessage('please add your signature.');
            }
    }

  render () {
    return (
      <Container>

<Header style={styles.Header}>
 <Button  onPress={()=> this.props.navigation.goBack(null)} transparent>
            <Text><Icon   name="angle-left" size={18} color="#fff" /></Text>
            </Button> 
<Body  style={{alignItems:"center"}}>
 <Title>Signature</Title>
 </Body> 
 

</Header>

      <View style={styles.flex1}> 
  
        {this.state.show ? <SignaturePad 
          onError={this._signaturePadError}
          onChange={this._signaturePadChange}
          style={styles.pad}
        /> :this.setState({ show: !this.state.show }) }
 </View>
     
          <View style={{flexDirection:'row', marginBottom:20,    justifyContent:"space-around", alignItems:"center"  }}>
                 <Button style={styles.btnfull}  onPress={() => {this.sabclear()}}>
                <Text style={styles.text} >Clear</Text>
                </Button>
                <Button style={styles.btnfull}   onPress={() => {this.submit()}}>
        <Text  style={styles.text} >Submit</Text> 
                </Button>
                
                </View>
      
                </Container>
               
     
    )
  }


  
  sabclear(){
  this.setState({ show: !this.state.show });    
 }
  getbase64(){
     console.log("Base64 ==== ",this.state.base64,"======================");
     
  }
  _signaturePadError = (error) => {
    console.error("signature Errror =========== ",error);
  }

  _signaturePadChange = ({ base64DataUrl }) => {
    var baseCode=base64DataUrl.split("data:image/png;base64,");
    this.setState({base64:baseCode[1]});
  }
}

const styles = StyleSheet.create({
  flex1: {height:1100, flex:2,    borderColor:"#43a1a2", borderWidth:1, margin:15,  },
  pad: { backgroundColor: 'white',flex:0, height:1100,   width:"200%", },

  contentcont:{
    margin:20,
    flex:1,
    justifyContent:"center",
    alignItems:'center',
  },

  btnfull:{
    backgroundColor: '#43a1a2',
    marginTop:10,
    padding:10,
    borderRadius:5,
    color:"#ffffff",
    width:150,
    justifyContent:"center",
  
    
  },

  text:{
    color:"#ffffff",
    fontSize:16,
    textAlignVertical:"center",
    textAlign:"center"
  },

  Header:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#43a1a2',
    color:'#ffffff'

  },

});