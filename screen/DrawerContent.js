import React from 'react';
import {
  
  StyleSheet,
  ScrollView,
  View,Image,Text
 
} from 'react-native';
// import {
//     useTheme,
//     Avatar,
//     Title,
//     Caption,  
//     Paragraph,
//     Drawer,
//     Text,
//     TouchableRipple,
//     Switch
// } from 'react-native-paper';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';

export function DrawerContent(props){
    // const paperTheme = useTheme();

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
             {/* <View>
                 <Text>Home</Text>
             </View> */}


<View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                <Image
                style={styles.tinyLogo}
                source={{
                uri: 'http://reactnative.dev/img/tiny_logo.png',
                }}
            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Text style={styles.title}>Mohd Zeeshan</Text>
                                <Text style={styles.caption}>Software Developer</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                 <Text style={[styles.paragraph, styles.caption]}>80</Text>
                                <Text style={styles.caption}>Following</Text> 
                            </View>
                            
                        </View>
                    </View>
                    </View>

                    <View  style={styles.texttt}>
                 <Text style={styles.title}>Home</Text>
                 </View>
                 <View style={styles.texttt}>
                 <Text style={styles.title}  >Setting</Text>
                 </View>   
                 <View style={styles.texttt}>
                 <Text style={styles.title}>Log out</Text>
             </View>
            </DrawerContentScrollView>

            

            {/* <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Home"
                          //   onPress={() => {props.navigation.navigate('Home')}
                          // }
                        />
            </Drawer.Section> */}
        </View> 
    );
}


const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    tinyLogo: {
        width: 50,
        height: 50,
      },
      texttt:{
        marginTop:10,
        alignItems: 'center',
        fontSize: 2,
      }
  });