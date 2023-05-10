import React, { useEffect, useState } from 'react';
import { AsyncStorage,Linking } from 'react-native';
import Home from './home';
import { NavigationContainer,NavigationInjectedProps, withNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  SectionList,
  Searchbar,
  TouchableOpacity,
  h1,
  TextInput,Alert,ActivityIndicator,ToastAndroid,AlertIOS,Platform
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { Container, Header,Title, Content, Body,Button} from 'native-base';
export default App = ({route,navigation}) => {
  // const [date, setDate] = useState(new Date(1598051730000));
  const { year } = route.params;
  const [date, setDate] = useState(new Date().valueOf());

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showAstrick,SetshowAstrick ] = useState(false);

  const [userDetails, setuserDetail] = React.useState({});
  const [data, setData] = React.useState({
    title:'',
    utr:'',
    firstName:'',
    lastName:'',
    gender:'',
    dob:'',
    address:'',
    address2:'',
    address3:'',
    address4:'',
    postalCode:'',
    phone:'',
    email:'',
    niNumber:'',
    niStatus:false,
    maxDate:new Date(),
    isloading:false,
    url:'',
    Country:'',
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
  
  const Stack = createStackNavigator();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    let d= moment(selectedDate).format("DD/MM/YYYY");
    setShow(Platform.OS === 'ios');
    if(selectedDate && selectedDate!=undefined){
      data.dob=d;
      setDate(currentDate);
    }else{
      console.log("Wrong Date Format");
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const isValidPostcode = (p) =>{ 
    console.log("Post code ==== ",p," Country==== ",data.Country);
    if(data.Country== 'UK'){
      var postcodeRegEx = /^(GIR 0AA)|((([A-Z][0-9][0-9]?)|(([A-Z][A-HJ-Y][0-9][0-9]?)|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2})$/
      console.log("Postal code Status   === ",postcodeRegEx.test(p));
      return postcodeRegEx.test(p);
    }else{
       
        console.log("No Validations");
        return true;

    }
      
  }

const validUtr = (p) =>{ 
  var utrRegEx =/[0-9]{10}/
  if(!utrRegEx.test(p)){
    AlertMessage('A UTR number must be a ten digit number.')
  }
  return utrRegEx.test(p); 
}

  const niNumberValid = (ninum) => {
      if(ninum.length ==9){
        var prefix = ninum.substring(0, 2);
        var sufix = ninum.substring(2, 8);
        var prefix1 = ninum.substring(0, 1);
        var prefix2 = ninum.substring(1, 2);
       var  character = ninum.charAt(8)
        var letters = /^[A-Za-z]+$/;
        var check = prefix.match(letters);
        var char =  /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
       var lastNum = ninum.substring(2);

       var rniNum = ninum.split(" ").join(""); 

       console.log("Prefix == ",prefix,"sufix ====  ",sufix," prefix1 === ",prefix1,"  prefix2 = ",prefix2, " rniNum ",rniNum);

        if(isNaN(sufix)|| char.test(rniNum) || check==null ){
          data.niStatus =false;
          // Alert.alert('NI Number', 'Not Valid.', [
          //   {text: 'Okay'}
          // ]);
          
        }
        else{

          if(character=='A' || character=='B' || character=='C' || character=='D'){
          data.niStatus =true;
          }else{
             data.niStatus =false;

          }
         
        }

      }

  };


  const logout = () => {
    Alert.alert('Logout!', 'Are you sure?', [
      {text: 'Cancel'},
      {text: 'Logout',
      onPress: () => {
        AsyncStorage.clear();
        navigation.navigate('Login');
      },
    
    },
  ]);

  }


  useEffect(() => {
    AsyncStorage.getItem('urlPrefix').then(ress => {
    AsyncStorage.getItem('userDetails').then(res => {
        var result = new Array();
        result =JSON.parse(res);
    const url = "http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/GetUserProfile?SATaxyearCode="+year;
    console.log
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',  
        AuthToken:result.AuthToken
      }
    })
      .then((response) => response.json())
      .then((json) =>{
        console.log("JSON    ====== ",json);
        // setDate(moment(json.dob,"MM/DD/YYYY").toISOString());
      data.url =json.EmailLink  
      data.utr=json.UTRNo;
      data.firstName =json.FirstName;
      data.lastName=json.LastName;
      data.gender=json.Gender;
      if(json.dob){
        data.dob=json.dob;

      }else{
        data.dob=''
      }  
      data.address=json.Address1;
      data.address2=json.Address2;
      data.address3=json.Address3;
      data.address4=json.Address4;
      data.postalCode=json.PostCode;
      data.phone=json.Phone;
      data.email=json.Email;
      data.niNumber=json.NINumber;

      if(json.Country==false){
        data.Country='UK';
        SetshowAstrick(true);
      }else{
        data.Country='Abroad';
        SetshowAstrick(false)
      }
     
     setuserDetail(json)
    //   setData(json)
      
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    })
    })
  }, []);

  const profileUpdate = () => {
      console.log("TaxpayerStatus ================== ",data.Country);
    if(data.niNumber){
       niNumberValid(data.niNumber.replace(/ +/g, ""));

    }else{
      data.niStatus=true;
    }
    if(data.email  && data.firstName && data.lastName && data.gender && data.dob && data.address  && data.niStatus==true && isValidPostcode(data.postalCode.toUpperCase()) && validUtr(data.utr) && validateEmail(data.email) ){
    AsyncStorage.getItem('urlPrefix').then(ress => {
    AsyncStorage.getItem('userDetails').then(res => {
      data.isloading=true;
      var result = new Array();
      result =JSON.parse(res);
      const url = "http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/PostUserProfile";
      console.log("DOB ==================================== ============== ",data.Country);
       var CountryValue='';
      if( data.Country=='UK'){
        CountryValue =0;
      }else{
        CountryValue=1;
      }

      console.log("Country Value ========= ",CountryValue);
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          AuthToken:result.AuthToken

        },

        body: JSON.stringify({
          UTRNo:data.utr,
          Title: data.title,
          FirstName:data.firstName,
          LastName:data.lastName,
          Gender:data.gender,
          dob:data.dob,
          Address1:data.address,
          Address2:data.address2,
          PostCode:data.postalCode.toUpperCase(),
          Email:data.email,
          Phone:data.phone,
          NINumber:data.niNumber,
          Country:CountryValue,
          // Country:data.TaxpayerStatus
        })
    })
        .then((response) => response.json())
        .then((json) =>{
          console.log("JSON  ==== ",json);
          data.isloading=false;

        // setData(json.ResultInfo)
        if(json.IsSuccess){
          navigation.navigate('HomePage');
          AlertMessage(json.Description);
          if(data.url){
            Linking.openURL(data.url);
          }
          }else{
            AlertMessage('Something Went wrong.');
          }
        
        })
        .catch((error) =>{
          data.isloading=false;
          console.error(error)
        }
        
        ).finally(() => setLoading(false));
  
      })
      })

    }else{

      if(data.niNumber){
      if(data.niNumber.length < 9 || data.niStatus==false){
        AlertMessage('Please enter correct NI Number.');   
      }
     }
      
    if(!isValidPostcode(data.postalCode)){
         console.log("Postal CODE ========== ",data.PostCode);
      Alert.alert('Error!', 'Please enter valid Postcode.', [
        {text: 'Okay'}
       ]);

  }else if(!data.firstName || !data.lastName || !data.gender ||  !data.dob || !data.address || !data.postalCode || !data.email || !data.utr){
   
    AlertMessage('Please enter all required field.');
  }
    }
}



const validateEmail =(email)=>{
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!re.test(email)){
    AlertMessage('Please enter valid email.');
  }
  
  return re.test(email);
}

const dropDOwnChange = (value) => {
  console.log("Country === ",value.toString());
  // alert("Country ======== ",value.toString());
  data.Country =value;
  if(value=="UK"){
    SetshowAstrick(true)
  }else{
    SetshowAstrick(false)
  }
  
}

  return (

    <Container>
         <Header style={styles.header}>
          <Button  onPress={()=> navigation.goBack(null)} transparent>
          <Text onPress={()=> navigation.go}><Icon  onPress={()=> navigation.goBack(null)} name="angle-left" size={18} color="#fff" /></Text>
          </Button>
           <Body  style={{alignItems:"center"}}>
            <Title>Profile Information</Title>

            </Body> 
           
          </Header>
          <Content>

     <View style={styles.contentcont}>
     <View style={styles.labelwidth}>
        <Text style={styles.labelwidth}>UTR Number <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
         defaultValue={data.utr}
         keyboardType = 'number-pad'
         maxLength={10}
         onChangeText={(item) =>
           data.utr =item
         }
        style={styles.inputBox} underlineColorAndroid='rgba(0,0,0,0)' placeholder='1234567890' />
        
        <Text style={styles.labelwidth}>First Name<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput defaultValue={data.firstName}
          onChangeText={(item) =>data.firstName =item}
          underlineColorAndroid='rgba(0,0,0,0)' placeholder='First Name'  style={styles.inputBox}
          maxLength={30}
          />

        <Text style={styles.labelwidth}>Last Name<Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput 
        defaultValue={data.lastName}
        onChangeText={(item) =>data.lastName =item}
        style={styles.inputBox} underlineColorAndroid='rgba(0,0,0,0)' placeholder='Last Name' maxLength={30} />

<Text style={styles.labelwidth}>NI Number</Text>

      <TextInput 
      defaultValue={data.niNumber}
      onChangeText={(item) =>
        data.niNumber =item.toUpperCase()
      }
      autoCapitalize="characters"
      keyboardType="default"
      maxLength={9} style={styles.inputBox} placeholder='NI Number'  underlineColorAndroid='rgba(0,0,0,0)'  />
        
     </View>

     <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}>DOB<Text style={{ color: 'red' }}>*</Text></Text>
    
      <View style={styles.inputBox}><Text style={{paddingVertical:10}}>{data.dob}</Text> 
        <View style={styles.thouchablebtn}><Icon name='calendar'  onPress={showDatepicker}  size={18} color="#a1a1a1" /></View>
      </View>
     
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
           onChange={onChange}
           maximumDate={new Date()}
        />
      )}

<Text style={styles.labelwidth}>Gender</Text>
    <DropDownPicker
                  items={[  
                      {label: 'Male', value: 'M', icon: () => <Icon name="mars" size={18} color="#43a1a2" />},
                      {label: 'Female', value: 'F', icon: () => <Icon name="venus" size={18} color="#43a1a2" />},
                      // {label: 'Other', value: 'o', icon: () => <Icon name="genderless" size={18} color="#900" />},
                  ]}
                  defaultValue={data.gender}
                  containerStyle={{height: 40,width:"100%", marginVertical:15, }}
                  style={{backgroundColor: '#ffffff'}}
                  itemStyle={{
                      justifyContent: 'flex-start'
                  }}
                  dropDownStyle={{backgroundColor: '#ffffff'}}
                   onChangeItem={(item) =>data.gender =item.value} 
              />

<Text style={styles.labelwidth} >Address 1<Text style={{ color: 'red' }}>*</Text></Text>
    <TextInput
    
     defaultValue={data.address}
    onChangeText={(item) =>data.address =item}
     maxLength={30} style={styles.inputBox} onChangeItem={(item) =>data.address =item.value} placeholder="Address" underlineColorAndroid='rgba(0,0,0,0)'  />
    
   
    <Text style={styles.labelwidth} >Address 2</Text>

    <TextInput 
     defaultValue={data.address2}
     onChangeText={(item) =>data.address2 =item}
     maxLength={30} style={styles.inputBox} onChangeItem={(item) =>data.address2 =item.value} placeholder='Address 2' underlineColorAndroid='rgba(0,0,0,0)'  />
    
    <Text style={styles.labelwidth} >Country</Text>
    <DropDownPicker
                  items={[  
                      {label: 'United Kingdom', value: 'UK'},
                      {label: 'Abroad', value: 'Abroad'},
                      // {label: 'Other', value: 'o', icon: () => <Icon name="genderless" size={18} color="#900" />},
                  ]}
                  defaultValue={data.Country}
                  containerStyle={{height: 40,width:"100%", marginVertical:15, }}
                  style={{backgroundColor: '#ffffff'}}
                  itemStyle={{
                      justifyContent: 'flex-start'
                  }}
                  dropDownStyle={{backgroundColor: '#ffffff'}}
                   onChangeItem={(item) =>  dropDOwnChange(item.value)} 
              />

  {/* {showAstrick ?<Text style={{ color: 'red' }}>*</Text>:<Text>Helooooooooo</Text> } */}
  
  <Text style={styles.labelwidth}>Post Code {data.Country=='UK' ?<Text style={{ color: 'red' }}>*</Text>:null}</Text>
    <TextInput 
    defaultValue={data.postalCode}
    onChangeText={(item) =>data.postalCode =item}
    maxLength={8} placeholder='Post Code' onChangeItem={(item) =>data.postalCode =item.value} style={styles.inputBox} underlineColorAndroid='rgba(0,0,0,0)'  />

<Text style={styles.labelwidth}>Phone</Text>

   <TextInput 
    defaultValue={data.phone}
    onChangeText={(item) =>data.phone =item}
    maxLength={13} 
    keyboardType={'phone-pad'} 
    // autoCompleteType={'tel'}
    placeholder='Phone' onChangeItem={(item) =>data.phone =item.value} style={styles.inputBox} underlineColorAndroid='rgba(0,0,0,0)'  />
      
      <Text style={styles.labelwidth}>Email <Text style={{ color: 'red' }}>*</Text></Text>
    <TextInput 
    defaultValue={data.email}
    onChangeText={(item) =>data.email =item}
    placeholder='Email' onChangeItem={(item) =>data.email =item.value} style={styles.inputBox} underlineColorAndroid='rgba(0,0,0,0)'  />
  
   </View>  
   
    {/* <View style={styles.flexrow1}>

    <Text style={styles.labelwidth}>Title:</Text>
    <DropDownPicker
                  items={[  
                      {label: 'Mr.', value: 'Mr.', icon: () => <Icon name="user" size={18} color="#43a1a2" />},
                      {label: 'Mrs.', value: 'Mrs.', icon: () => <Icon name="user" size={18} color="#43a1a2" />},
                      {label: 'Miss', value: 'Miss', icon: () => <Icon name="user" size={18} color="#43a1a2" />},
                      {label: 'Ms.', value: 'Ms', icon: () => <Icon name="user" size={18} color="#43a1a2" />},
                      {label: 'Dr', value: 'Dr', icon: () => <Icon name="user" size={18} color="#43a1a2" />},
                  ]}
                  defaultValue={data.title}
                  containerStyle={{height: 40,width:"65%",marginLeft:30, marginVertical:15,}}
                  style={{backgroundColor: '#ffffff'}}
                  itemStyle={{
                      justifyContent: 'flex-start'
                  }}
                  dropDownStyle={{backgroundColor: '#ffffff'}}
                   onChangeItem={(item) =>data.title =item.value} 
              />
    </View>  */}

{/* 

    <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}>First Name:<Text style={{ color: 'red' }}>*</Text></Text>
    <TextInput defaultValue={data.firstName}
    onChangeText={(item) =>data.firstName =item}
    underlineColorAndroid='rgba(0,0,0,0)' placeholder='First Name'  style={styles.inputBox}
    maxLength={30}
    />
    </View>
    <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}>Last Name:<Text style={{ color: 'red' }}>*</Text></Text>
    <TextInput 
   
    defaultValue={data.lastName}
    onChangeText={(item) =>data.lastName =item}
     style={styles.inputBox} underlineColorAndroid='rgba(0,0,0,0)' placeholder='Last Name' maxLength={30} />
    </View>

    <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}>Gender:<Text style={{ color: 'red' }}>*</Text></Text>
    <DropDownPicker
                  items={[  
                      {label: 'Male', value: 'M', icon: () => <Icon name="mars" size={18} color="#43a1a2" />},
                      {label: 'Female', value: 'F', icon: () => <Icon name="venus-double" size={18} color="#43a1a2" />},
                      // {label: 'Other', value: 'o', icon: () => <Icon name="genderless" size={18} color="#900" />},
                  ]}
                  defaultValue={data.gender}
                  containerStyle={{height: 40,width:"65%",marginLeft:30, marginVertical:15, }}
                  style={{backgroundColor: '#ffffff'}}
                  itemStyle={{
                      justifyContent: 'flex-start'
                  }}
                  dropDownStyle={{backgroundColor: '#ffffff'}}
                   onChangeItem={(item) =>data.gender =item.value} 
              />
    </View>

    <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}>DOB:<Text style={{ color: 'red' }}>*</Text></Text>
    
      <View style={styles.inputBox}><Text style={{paddingVertical:10}}>{data.dob}</Text> 
        <View style={styles.thouchablebtn}><Icon name='calendar'  onPress={showDatepicker}  size={18} color="#a1a1a1" /></View>
      </View>
     
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
           onChange={onChange}
           maximumDate={new Date()}
        />
      )}
   
   </View>
   
    <View style={styles.flexrow1}>
    <Text style={styles.labelwidth} >Address:<Text style={{ color: 'red' }}>*</Text></Text>
    <TextInput
    
     defaultValue={data.address}
    onChangeText={(item) =>data.address =item}
     maxLength={30} style={styles.inputBox} onChangeItem={(item) =>data.address =item.value} placeholder="Address" underlineColorAndroid='rgba(0,0,0,0)'  />
    </View>
    <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}></Text>
    <TextInput 
     defaultValue={data.address2}
     onChangeText={(item) =>data.address2 =item}
     maxLength={30} style={styles.inputBox} onChangeItem={(item) =>data.city =item.value} placeholder='City' onChangeItem={(item) =>data.city =item.value} underlineColorAndroid='rgba(0,0,0,0)'  />
    </View>

    <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}></Text>
    <TextInput 
    defaultValue={data.address3}
    onChangeText={(item) =>data.address3 =item}
    maxLength={30} style={styles.inputBox} onChangeItem={(item) =>data.state =item.value} placeholder='State' underlineColorAndroid='rgba(0,0,0,0)'  />
    </View>

    <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}></Text>
    <TextInput 
    defaultValue={data.address4}
    onChangeText={(item) =>data.address4 =item}
    maxLength={30} style={styles.inputBox}  placeholder='' underlineColorAndroid='rgba(0,0,0,0)'  />
    </View>

    <View all={0}>
   <ActivityIndicator animating={data.isloading} color="#43a1a2"   size="large" />
   </View>

    <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}>Post Code:<Text style={{ color: 'red' }}>*</Text></Text>
    <TextInput 
    defaultValue={data.postalCode}
    onChangeText={(item) =>data.postalCode =item}
    maxLength={8} placeholder='Postal Code' onChangeItem={(item) =>data.postalCode =item.value} style={styles.inputBox} underlineColorAndroid='rgba(0,0,0,0)'  />
    </View>

  <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}>Phone:</Text>
    <TextInput 
    defaultValue={data.phone}
    onChangeText={(item) =>data.phone =item}
    maxLength={13} keyboardType={'phone-pad'} placeholder='Phone' onChangeItem={(item) =>data.phone =item.value} style={styles.inputBox} underlineColorAndroid='rgba(0,0,0,0)'  />
    
  
  </View>
  <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}>Email:</Text>
    <TextInput 
    defaultValue={data.email}
    onChangeText={(item) =>data.email =item}
    placeholder='Email' onChangeItem={(item) =>data.email =item.value} style={styles.inputBox} underlineColorAndroid='rgba(0,0,0,0)'  />
  </View>
  <View style={styles.flexrow1}>
    <Text style={styles.labelwidth}>NI Number:</Text>

    <TextInput 
    
    defaultValue={data.niNumber}
    
    onChangeText={(item) =>
       data.niNumber =item.toUpperCase()
    
    }
    autoCapitalize="characters"
    keyboardType="default"
    maxLength={9} style={styles.inputBox} placeholder='NI Number'  underlineColorAndroid='rgba(0,0,0,0)'  />
  </View>

*/}
{/* <TouchableOpacity onPress={() =>profileUpdate()} style={styles.log_btn} >
<Text style={styles.btn_text}>Next</Text>
</TouchableOpacity>  */}

<Button onPress={() =>profileUpdate()} style={styles.btnfull} block>
          <View style={styles.row_text1}>
              <Text style={styles.text}>NEXT</Text>
              <Text style={styles.body_text1}><Icon name="angle-right" size={30} color="#fff" /></Text>
            </View>
</Button>

          </View>

</Content>

</Container>
  );
};


const styles = StyleSheet.create({

  contentcont:{
    margin:20,
  },
  
  lefttext: {
    fontSize: 18,
    fontWeight: '600',
    color:'#ffffff',
   textAlignVertical:"center"

  },
  thouchablebtn:{
    position:'absolute', 
    right:-4,
    width:35,
    height:40,
    padding:2,
    paddingVertical:10,
   },
   
  header: {
    backgroundColor: '#43a1a2',
  },

  footer: {
    backgroundColor: '#43a1a2',
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
  fontSize:20,
  fontWeight: 'bold',
},

body_text:{
  color:"#000000",
  fontSize:20,
  textAlign:"left"
},
Header:{
  width:'100%',
  justifyContent:'center',
  alignItems:'center',
  backgroundColor:'#43a1a2',
  color:'#ffffff'

},


body_text1:{
  color:"#000000",
  fontSize:20,
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


