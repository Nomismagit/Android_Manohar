import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator,AsyncStorage,BackHandler,Dimensions,Animated, TouchableOpacity,useRoute } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import { useNavigationState } from '@react-navigation/native'    
import {Actions, Router, Scene} from "react-native-router-flux";

let {width, height} = Dimensions.get('window');


class FlatListDemo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
      backClickCount:0
    };
    this.arrayholder = [];
    this.springValue = new Animated.Value(100) ; 

  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

componentWillUnmount() {
  BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
}

_spring() {
  this.setState({backClickCount: 1}, () => {
      Animated.sequence([
          Animated.spring(
              this.springValue,
              {
                  toValue: -.15 * height,
                  friction: 5,
                  duration: 300,
                  useNativeDriver: true,
              }
          ),
          Animated.timing(
              this.springValue,
              {
                  toValue: 100,
                  duration: 300,
                  useNativeDriver: true,
              }
          ),

      ]).start(() => {
          this.setState({backClickCount: 0});
      });
  });

}

handleBackButton = () => {
  const {index, routes} = this.props.navigation.dangerouslyGetState();
  const currentRoute = routes[index].name;
  if(currentRoute =='companies' || currentRoute =='HomePage'){
    this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
    return true;
    }else{
    } 
};


  makeRemoteRequest = () => {

    AsyncStorage.getItem('urlPrefix').then(ress => {
    AsyncStorage.getItem('userDetails').then(res => {
          var result = new Array();
          result =JSON.parse(res);

    // const url = "http://"+ress+".nomismasolution.co.uk/AccountREST/AccountService.svc/"+ress+"/"+ result.AuthToken + '/GetCompanyInfoList';
    const url = "http://"+ress+".nomismasolution.co.uk/AccountREST/AccountService.svc/"+ress+"/"+ result.AuthToken + '/GetPayrollCompanyInfoListApp';
    
    this.setState({ loading: true });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if(res.IsSuccess==true){
        this.setState({
          data: res.ResultInfo,
          error: res.error || null,
          loading: false,
        });
        this.arrayholder = res.ResultInfo;
       if(res.ResultInfo.length ==1){
        let companycodes =res.ResultInfo[0].PayrollCompanyCode.toString();
        AsyncStorage.setItem('companyCode',companycodes);
        this.props.navigation.navigate('HomePage');

       }

      }else{

        if(res.error =2002){
          navigation.navigate('Login');
          Alert.alert(res.Description, [
           {text: 'Okay'}])
        }else{
          Alert.alert('Something Went Wrong!', [
              {text: 'Okay'}
          ]);
        }
      }


      })
      .catch(error => {
        this.setState({ error, loading: false });
      });

     });
   });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.CompanyName}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(text) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  setCompanyCode = (val) => {
    // let companycodes =val.CompanyCode.toString();
    let companycodes =val.PayrollCompanyCode.toString();
    AsyncStorage.setItem('companyCode',companycodes);
    this.props.navigation.navigate('HomePage');
   
  }

  renderHeader = () => {
    return (
      <SearchBar
        containerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 5}}
        placeholder="Search"
        placeholderTextColor={'#g5fffg5g5'}
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem onPress={() =>this.setCompanyCode(item)}
              // leftAvatar={{ source: { uri: item.picture.thumbnail } }}
              title={`${item.CompanyName}`}
              // subtitle={item.email}
            />
          )}
          keyExtractor={item => item.CompanyCode}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
}

export default FlatListDemo;