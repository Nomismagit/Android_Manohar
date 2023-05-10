// import React from 'react';
import {View, Text, StyleSheet,Image,TextInput,AsyncStorage,Alert,Linking,BackHandler,
  ToastAndroid,AlertIOS,Platform,ActivityIndicator,ScrollView,   RefreshControl,SafeAreaView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { Container, Header,Title, Body,Button,Content,Card} from 'native-base';
// import { Dropdown } from 'react-native-material-dropdown';
import {useRoute} from '@react-navigation/native';
import Loader from './component/loader';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default App = ({navigation,props}) => {
  const [data, setData] = useState([]);
  const [dropDownValue, setDropdown] = useState([]);
  const [homepageValue, homepage] = useState([]);
  const [selectvalue, selectedValue] = useState();
  const [counter, setCounter] = useState({
    value:0
  });

  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshLoader, setrefreshLoader] = React.useState({
    isloading:false,
    droDownValue:''
  });


  const [loading, setLoading] = useState(false);
  const onRefresh = React.useCallback(() => {
    refreshLoader.isloading=true;

    console.log("refreshLoader.droDownValue ========== ",refreshLoader.droDownValue)
    if(refreshLoader.droDownValue){
      getKey(refreshLoader.droDownValue);
    }else{

    }
   
    return
// alert("Helloooooooooo");
    // setRefreshing(true);
    AsyncStorage.getItem('urlPrefix').then(ress => {
      AsyncStorage.getItem('userDetails').then(res => {
           setData(JSON.parse(res));
           var userDetails = new Array();
           userDetails =JSON.parse(res);
          //  const url="http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/"+userDetails.AuthToken+"/GetTaxYears";
          const url="http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/GetTaxYears";
  
           fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',  
              AuthToken:userDetails.AuthToken
            },
    
          }).then((response) => response.json())
        .then((json) =>{
          var temp=[];
          console.log("Json  ======= ",json);
          if(json.ErrorCode==2002){
            // AsyncStorage.clear();
            commingSoon(json.Description,'Please Login!');
            navigation.navigate('Login');
          }
          let len =json.ResultInfo.length;
          if(len >0 && json.ResultInfo){
            for(let i=0;i<len;i++){
              var indexvalue = json.ResultInfo[i];
              var joined = {value:indexvalue.Yearcode,label:indexvalue.YearName}
              temp.push(joined)
            }
            setDropdown(temp);
            getKey(temp[0].value);
            selectedValue(temp[0].value);
          }
          refreshLoader.isloading=false;
        })
        // .catch((error) => console.error("Error ================ ",error))
  
        
      })
    })
    wait(2000).then(() => 
    refreshLoader.isloading=false,
    // setRefreshing(false)
    );

  }, []);

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
 const route = useRoute();
 const  handleBackButton=()=>  {    

   const {index, routes} = navigation.dangerouslyGetState();
   const currentRoute = routes[index].name;
console.log(" currentRoute == ",currentRoute)

   if(currentRoute=='reviewtax'){
     console.log("Review  Function");
       navigation.pop();
       navigation.navigate('HomePage');
       return true;
      //  return false;
      // navigation.navigate('profile2',{year:'7'});
    //  navigation.navigate('HomePage');
  }
  if(currentRoute=='HomePage'){
    BackHandler.exitApp()
      } 
  else{
    
  }
   
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
   console.log("Use Effect  ================ ");
   
    AsyncStorage.getItem('urlPrefix').then(ress => {
    AsyncStorage.getItem('userDetails').then(res => {

      
         setData(JSON.parse(res));
         var userDetails = new Array();
         userDetails =JSON.parse(res);
        //  const url="http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/"+userDetails.AuthToken+"/GetTaxYears";
        const url="http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/GetTaxYears";

         fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',  
            AuthToken:userDetails.AuthToken
          },
  
        }).then((response) => response.json())
      .then((json) =>{
        var temp=[];
        console.log("Json  ======= ",json);
        if(json.ErrorCode==2002){
          // AsyncStorage.clear();
          commingSoon(json.Description,'Please Login!');
          navigation.navigate('Login');
        }
        let len =json.ResultInfo.length;
        if(len >0 && json.ResultInfo){
          for(let i=0;i<len;i++){
            var indexvalue = json.ResultInfo[i];
            var joined = {value:indexvalue.Yearcode,label:indexvalue.YearName}
            temp.push(joined)
          }
          setDropdown(temp);
          getKey(temp[0].value);
          selectedValue(temp[0].value);
          refreshLoader.droDownValue=temp[0].value;
        }
      
      })
      // .catch((error) => console.error("Error ================ ",error))

      
    })
  })
  }, []);

  function openBrowser(url){
     
    InAppBrowser.open(url, {
      // iOS Properties
      dismissButtonStyle: 'cancel',
      preferredBarTintColor: '#453AA4',
      preferredControlTintColor: 'white',
      readerMode: true,
      animated: true,
      modalPresentationStyle: 'fullScreen',
      modalTransitionStyle: 'coverVertical',
      modalEnabled: true,
      enableBarCollapsing: false,
      // Android Properties
      showTitle: true,
      toolbarColor: '#44a2a2',
      secondaryToolbarColor: 'black',
      navigationBarColor: 'black',
      navigationBarDividerColor: 'white',
      enableUrlBarHiding: true,
      enableDefaultShare: true,
      forceCloseOnRedirection: false,
      // Specify full animation resource identifier(package:anim/name)
      // or only resource name(in case of animation bundled with app).
      animations: {
        startEnter: 'slide_in_right',
        startExit: 'slide_out_left',
        endEnter: 'slide_in_left',
        endExit: 'slide_out_right'
      },
      headers: {
        'my-custom-header': 'my custom header value'
      }
    })
  
 
} 
  

  const getKey = (year) => {
    // selectedValue('');
    console.log("YEAR ===== ",year," Seeeeeeeeeeeeeeeeeee ========== ",selectvalue);
    
    selectedValue(year);
    refreshLoader.isloading=true;
    AsyncStorage.getItem('urlPrefix').then(ress => {
      AsyncStorage.getItem('userDetails').then(res => {
        userDetails =JSON.parse(res);
          // const url="http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/"+userDetails.AuthToken+"/GetPersonDashboard?SATaxYearCode="+year;
          const url="http://"+ress+".nomismasolution.co.uk/AccountREST/SelfAssessment.svc/"+ress+"/GetPersonDashboard?SATaxYearCode="+year;

          console.log("URL!!!! === ",url);
          console.log("userDetails.AuthToken ==========",userDetails.AuthToken)
          fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',  
              AuthToken:userDetails.AuthToken
            },
          }
          
            )
        .then((response) => response.json())
        .then((json) =>{


          refreshLoader.isloading=false;
          console.log(" json ======================= ",json);

          if(json){   
            console.log("Key DATA ===== ",json);
            homepage(json)   
          }

          else if(json.ErrorCode==2002){
            navigation.navigate('Login');
            commingSoon(json.Description,'Please Login!');
          } 
          refreshLoader.isloading=false;

        })
        // .catch((error) => console.error("Error ================ ",error))
  
        
      })
    })

  }

  const commingSoon = (val,title) => {
    AlertMessage(val);
  }
      return (  
        <Container>

          <Header style={styles.Header}>
           <Body  style={{alignItems:"center"}}>
            <Title> {data.LoginName}</Title>
            </Body> 
            <Button  onPress={()=> navigation.navigate('setting',{year:selectvalue})} transparent>
            <Text><Icon name="cog" size={18} color="#fff" /></Text>
            </Button>

          </Header>

          <Content>
          <SafeAreaView style={styles.container}>
          <ScrollView
     
     contentContainerStyle={styles.scrollView}
     refreshControl={
       <RefreshControl
         refreshing={refreshLoader.isloading}
         onRefresh={onRefresh}
       />
     }   
       >


          {/* <Loader loading={loading} />
           */}

          {homepageValue.Taxreturnstatus ? <View>

    <View style={styles.contentcont}>
    <View style={{flexDirection:"row",}}><Text style={styles.taxyear}>Tax Year:</Text>
    <DropDownPicker
                  items={dropDownValue}
                  defaultValue={selectvalue}
                  containerStyle={{height: 40,width:"70%",marginLeft:30, marginVertical:0,}}
                  style={{backgroundColor: '#ffffff'}}
                  itemStyle={{
                      justifyContent: 'flex-start'
                  }}
                  dropDownStyle={{backgroundColor: '#ffffff'}}
                   onChangeItem={(item) =>{ 
                    refreshLoader.droDownValue=item.value; 
                    getKey(item.value)
                  
                  } }
              />
    </View> 

    {homepageValue.Taxreturnstatus=='Not Started' ? 
    <View>

<View style={styles.card}>
          <Text style={styles.text}>Tax Return Status:
          </Text> 
          <Text style={styles.status}>Not Started</Text>
    </View>
  <Button   onPress={()=> navigation.navigate('profile2',{year:selectvalue})} style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>GET STARTED</Text>    
      <Text style={styles.body_text1}><Icon name="angle-right" size={30} color="#fff" /></Text>
    </View>
  </Button>
  </View>:null}

  
  {homepageValue.Taxreturnstatus=='Failed' ? 
    <View>

<View style={styles.card}>
          <Text style={styles.text}>Tax Return Status:
          </Text> 
          <Text style={styles.status}>{homepageValue.Taxreturnstatus}</Text>
    </View>
  </View>:null}

    {homepageValue.Taxreturnstatus=='Questionnaire Sent' ? 

<View>

<View style={styles.card}>
          <Text style={styles.text}>Tax Return Status:
          </Text> 
          <Text style={styles.status}>Questionnaire Received</Text>
    </View>
  <Button   onPress={()=> openBrowser(homepageValue.EmailLink)} style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>Complete Questionnaire</Text>    
      <Text style={styles.body_text1}><Icon name="angle-right" size={30} color="#fff" /></Text>
    </View>
  </Button>
  </View>:null}

  {/* Response Received */}

  {homepageValue.Taxreturnstatus=='Response Received' ? 

<View>

<View style={styles.card}>
          <Text style={styles.text}>Tax Return Status:
          </Text> 
          <Text style={styles.status}>Questionnaire Submitted</Text>
    </View>
  <Button   style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>Awaiting Advisor</Text>    
    </View>
  </Button>
  </View>:null}
{/* In Progress */}

  {homepageValue.Taxreturnstatus=='InProgress' ? 
<View>
<View style={styles.card}>
          <Text style={styles.text}>Tax Return Status:
          </Text> 
          <Text style={styles.status}>With Advisor</Text>
    </View>
  {/* <Button   style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>None</Text>    
    </View>
  </Button> */}
  </View>:null}

  {/*Queries Sent  */}

  {homepageValue.Taxreturnstatus=='Queries Sent' ? 
<View>
<View style={styles.card}>
          <Text style={styles.text}>Tax Return Status:
          </Text> 
          <Text style={styles.status}>Queries Received</Text>
    </View>
  <Button   style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>Check Email</Text>    
    </View>
  </Button>
  </View>:null}


  {/* Awaiting Review */}

  {homepageValue.Taxreturnstatus=="AwaitingReview" ? 
<View>
<View style={styles.card}>
          <Text style={styles.text}>Tax Return Status:
          </Text> 
          <Text style={styles.status}>With Advisor</Text>
    </View>
  {/* <Button   style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>None</Text>    
    </View>
  </Button> */}
  </View>:null}



  {/* sent for Approved */}

{homepageValue.Taxreturnstatus=="Reviewing" ? 

<View>

<View style={styles.card}>
          <Text style={styles.text}>Tax Return Status:
          </Text> 
          <Text style={styles.status}>To Be Approved</Text>
    </View>
  <Button  onPress={()=> navigation.push('reviewtax',{year:selectvalue})}  style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>Review Tax Return</Text>    
      <Text style={styles.body_text1}><Icon name="angle-right" size={30} color="#fff" /></Text>
    </View>
  </Button>
  </View>:null}

{/* Approved */}

{homepageValue.Taxreturnstatus=='Approved' ? 

<View>

<View style={styles.card}>
          <Text style={styles.text}>Tax Return Status:
          </Text> 
          <Text style={styles.status}>Approved</Text>
    </View>
  <Button  onPress={()=> navigation.push('viewtax',{year:selectvalue})}  style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>View Tax Return</Text>    
      <Text style={styles.body_text1}><Icon name="angle-right" size={30} color="#fff" /></Text>
    </View>
  </Button>
  </View>:null}


{/* Failed */}

{homepageValue.Taxreturnstatus=='Filed' ? 

<View>

<View style={styles.card}>
          <Text style={styles.text}>Tax Return Status:
          </Text> 
          <Text style={styles.status}>Filed</Text>
    </View>
  <Button  onPress={()=> navigation.push('viewtax',{year:selectvalue})}  style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>View Tax Return</Text>    
      <Text style={styles.body_text1}><Icon name="angle-right" size={30} color="#fff" /></Text>
    </View>
  </Button>
  </View>:null}

    
  <View style={styles.keyfig}>
    <Text style={styles.teal_text}>Key Figures</Text>
  </View>

  <View style={styles.row_text}>
    <Text style={styles.body_text}>Total Income:</Text>
    <Text style={styles.body_text1}> {homepageValue.totalincome}</Text>
  </View>
  <View style={styles.row_text}>
    <Text style={styles.body_text}>Taxable Income:</Text>
    <Text style={styles.body_text1}> {homepageValue.taxableincome}</Text>
  </View>

  <View style={styles.keyfig}>
    <Text style={styles.teal_text}>Tax Due</Text>
  </View>

    <View style={styles.row_text}>
      <Text style={styles.body_text}>{homepageValue.DueDateTaxDue1}</Text>
      <Text style={styles.body_text1}> {homepageValue.TaxDue1}</Text>
    </View>
    <View style={styles.row_text}>
       <Text style={styles.body_text}>{homepageValue.DueDateTaxDue2}</Text>
       <Text style={styles.body_text1}> {homepageValue.TaxDue2}</Text>
    </View>

    <Button   onPress={()=> openBrowser('http://www.gov.uk/pay-self-assessment-tax-bill?')} style={styles.btnfull} block>
    <View  style={styles.row_text1}>
      <Text style={styles.text}>MAKE TAX PAYMENT</Text>    
      <Text style={styles.body_text1}><Icon name="angle-right" size={30} color="#fff" /></Text>
    </View>
  </Button>

    </View>
    </View>:
     <View all={0} style={styles.loader}>
     <ActivityIndicator animating={data.isloading} color="#43a1a2"   size="large" />
   </View>
    
    }

</ScrollView>

  </SafeAreaView>  
    </Content>
 
{/* Commented Code */}

{/*         
     <Text
     style={styles.log_btn} onPress={()=> navigation.navigate('reviewtax',{year:selectvalue})}
      ><Icon name="user" size={18} color="#fff" style={styles.lefticon} />Review Tax</Text> 
        */}
        

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
  loader:{
    marginTop:200
  },
  card: {
    backgroundColor: '#43a1a2',
    padding:20,
    alignItems:'center',
    marginTop:10
  },
  contentcont:{
    margin:15,
  },

  taxyear:{paddingVertical:10, color:'#43a1a2', fontSize:16, fontWeight:"700",},

  btnfull:{
    backgroundColor: '#43a1a2',
    marginTop:20,
    padding:20,
    borderRadius:5,
    color:"#ffffff",
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
  scrollView:{

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

    text1:{
      color:"#ffffff",
      fontSize:40,
      lineHeight:60,
      fontStyle: 'italic',
      fontWeight: 'bold',
    },
    text:{
      color:"#ffffff",
      fontSize:20,
      textAlignVertical:"center",
    },
     status:{
      color:"#ffffff",
      fontSize:25,
      lineHeight:60,
      fontStyle: 'italic',
      fontWeight: 'bold',
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
    },
     
    row_text:{
      flexDirection: 'row', flex:1, marginTop:20, justifyContent:"space-between",
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

row_text1:{
  flexDirection: 'row', flex:1, justifyContent:"space-between",
},

});