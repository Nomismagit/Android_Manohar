import { View, Text, StyleSheet,Image,TextInput,AsyncStorage,Alert,BackHandler } from 'react-native';

import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Container, Header,Title, Body,Button,Content,Card} from 'native-base';

export default App = ({route,navigation}) => {
  const [data, setData] = useState([]);
  const { year } = route.params;

  useEffect(() => {
    AsyncStorage.getItem('userDetails').then(res => {
        setData(JSON.parse(res));
    })

  }, []);


  const logout = () => {
    Alert.alert('Self Assessment', 'Are you sure you want to logout of Self Assessment?', [
      {text: 'CANCEL'},
      {text: 'PROCEED',
      onPress: () => {
        AsyncStorage.clear();
        navigation.navigate('Login');
        BackHandler.exitApp();
      },
    
    },
  ]);

  }
      return (

        <Container>
         
        <Header style={styles.Header}>

        <Button  onPress={()=> navigation.goBack(null)} transparent>
          <Text onPress={()=> navigation.go}><Icon  onPress={()=> navigation.goBack(null)} name="angle-left" size={18} color="#fff" /></Text>
          </Button>
         <Body  style={{alignItems:"center"}}>
          <Title>Settings</Title>

          </Body> 
          
        </Header>
        
        <View style={styles.contentcont}>
        <Image style={styles.tinyLogo} source={require("../images/icon.png")} />
      <Text style={{marginBottom:30, fontSize:16, color:"#43a1a2"}}>{data.LoginName}</Text>
     
     <Button onPress={()=> navigation.navigate('profile2',{year:year})} style={styles.btnfull} block>
      <View  style={styles.row_text1}>
      <Text style={styles.text} >Profile</Text>    
      <Text style={styles.body_text1}><Icon name="user" size={18} color="#fff" style={styles.lefticon} /></Text>
    </View>
    </Button>
    <Button onPress={()=> navigation.navigate('changePassword')} style={styles.btnfull} block>
      <View  style={styles.row_text1}>
      <Text style={styles.text} >Change Password</Text>    
      <Text style={styles.body_text1}><Icon name="pencil-square" size={18} color="#fff" style={styles.lefticon} /></Text>
    </View>
    </Button>
    <Button  onPress={()=>logout()} style={styles.btnfull} block>
      <View  style={styles.row_text1}>
      <Text style={styles.text} >Logout</Text>    
      <Text style={styles.body_text1}><Icon name="sign-out" size={18} color="#fff" style={styles.lefticon} /></Text>
    </View>
    </Button>
  

  

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
  contentcont:{
    margin:15,
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',  
    backgroundColor: '#fff',
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

  

    login:{
      margin: 2,
      paddingBottom:3 ,
    },
    tinyLogo: {
      width: 100,
      height: 100,
      marginBottom:10,
    },
    button: {
        width: 300,
        margin: 5
      },
      lefticon: {

        paddingLeft: 30,
        alignContent: "space-between"

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

      body_text1:{
        color:"#000000",
        fontSize:20,
        textAlignVertical:"center"
      },
       
      row_text:{
        flexDirection: 'row', flex:1, marginTop:20, justifyContent:"space-between",
      },

      text:{
        color:"#ffffff",
        fontSize:16,
        textAlignVertical:"center",
      },

      btnfull:{
        backgroundColor: '#43a1a2',
        marginTop:20,
        padding:20,
        borderRadius:5,
        color:"#ffffff",
      },

      row_text1:{
        flexDirection: 'row', flex:1, justifyContent:"space-between",
      },
    });