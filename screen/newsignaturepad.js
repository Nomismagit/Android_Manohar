// import React, { Component } from 'react';
// import { View, StyleSheet } from 'react-native';

import SignaturePad from 'react-native-signature-pad';
import { View, Text,Touchable, StyleSheet,Image,TextInput,Alert,AsyncStorage,Linking, TouchableOpacity,ActivityIndicator,Route } from 'react-native';
import React, { Component,useEffect, useState,useRef } from 'react';
import { Container, Header,Title, Body,Button,Content,Card} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Actions, Router, Scene} from "react-native-router-flux";




export default App = ({navigation}) => {

  const [data, setData] = React.useState({
    signaturepads:'true'
  });

  // const [data, setData] = React.useState(true);

  const _signaturePadError = (error) => {
    console.error(error);
  }

  const _signaturePadChange = () => {

  }
  const sabclear = () => {
    console.log("Signatur Pad === ")
      // setData(false);
     setData({...data,signaturepads:'false'})
  }

  const convert = (value) => {
    return Boolean(value);
  }

  const submit = () => {

  }
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

          <Content>

            
      { data.signaturepads=='true' ?  <View style={styles.flex1}>
        <Text>=============={data.signaturepads}</Text>
        <SignaturePad 
          onError={_signaturePadError()}
          onChange={_signaturePadChange()}
          style={styles.pad}
        /> 
      </View>:   setData({...data,signaturepads:'true'})
 }

{/* 
          <View style={styles.flex1}>
        
        { data==true ? <SignaturePad 
          onError={_signaturePadError()}
          onChange={_signaturePadChange()}
          style={styles.pad}
        /> : setData(true) }
      </View> */}

          <View style={{flexDirection:'row', marginBottom:20, justifyContent:"space-around",    }}>
                 <Button style={styles.btnfull}  onPress={() => {sabclear()}}>
                <Text style={styles.text} >Clear</Text>
                </Button>
                <Button style={styles.btnfull}  onPress={() => {submit()}}>
        <Text style={styles.text} >Submit</Text> 
                </Button>
                
                </View>

          </Content> 
        </Container>

      );
    };
    


const styles = StyleSheet.create({
  flex1: { flex: 1, height:400, borderColor:"#43a1a2", borderWidth:1, margin:15, },
  pad: { backgroundColor: 'white', height:400, },
 

  contentcont:{
    margin:20,
    flex:1,
    justifyContent:"center",
    alignItems:'center',
  },

  btnfull:{
    backgroundColor: '#43a1a2',
    marginTop:20,
    padding:20,
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