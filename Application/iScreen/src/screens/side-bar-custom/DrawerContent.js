import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, BackHandler, Alert, Dimensions, AsyncStorage } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Paragraph, Drawer, Text, TouchableRipple, Switch } from 'react-native-paper';


export default class DrawerContent extends Component {
    constructor(props){
        super(props); 
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.existPressed);
    }
      
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.existPressed);
    }

    existPressed = () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit?',
          [
            {text: 'No', onPress: () => this.leaving(false)},
            {text: 'Yes', onPress: () => this.leaving(true)},
          ],
          { cancelable: false });
          return true;
    }

    async leaving(isLeaving){
        if(isLeaving == true){
          await AsyncStorage.removeItem('token');
          BackHandler.exitApp();
        }else{
          console.log('Cancel Pressed');
        }
    }

    render() {
        const disconnect = () => {
            this.existPressed();
        }

        return (
            <View style={{flex: 1}}>
                <DrawerContentScrollView {...this.props}>
                    <View style={styles.drawerContent}>
                        <View style={styles.userInfoSection}>
                            <View style={{flexDirection:'row',marginTop: 15}}>
                                <Avatar.Image 
                                    source={{
                                        uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                                    }}
                                    size={50}
                                />
                                <View style={{marginLeft:15, flexDirection:'column'}}>
                                    <Title style={styles.title}>John Doe</Title>
                                    <Caption style={styles.caption}>@j_doe</Caption>
                                </View>
                            </View>

                        </View>
                        
                        <Drawer.Section style={styles.drawerSection}>
                            <DrawerItem 
                                // icon={({color, size}) => (
                                //     <Icon 
                                //     name="home-outline" 
                                //     color={color}
                                //     size={size}
                                //     />
                                // )}
                                label="Affiche"
                                onPress={() => {this.props.navigation.navigate('Home')}}
                            />
                            <DrawerItem 
                                // icon={({color, size}) => (
                                //     <Icon 
                                //     name="account-outline" 
                                //     color={color}
                                //     size={size}
                                //     />
                                // )}
                                label="Configuration"
                                onPress={() => {this.props.navigation.navigate('Settings_v2')}}
                            />
                            <DrawerItem 
                                // icon={({color, size}) => (
                                //     <Icon 
                                //     name="account-check-outline" 
                                //     color={color}
                                //     size={size}
                                //     />
                                // )}
                                label="Support"
                                onPress={() => {alert("Nos développeurs travaillent dur sur cette fonctionnalité")}}
                            />
                        </Drawer.Section>
                        <Drawer.Section title="Preferences">
                            <TouchableRipple>
                                <View style={styles.preference}>
                                    <Text>Dark Theme</Text>
                                    <View pointerEvents="none">
                                        <Switch/>
                                    </View>
                                </View>
                            </TouchableRipple>
                        </Drawer.Section>
                    </View>
                </DrawerContentScrollView>

                <Drawer.Section style={styles.bottomDrawerSection}>
                    <DrawerItem 
                        // icon={({color, size}) => (
                        //     <Icon 
                        //     name="exit-to-app" 
                        //     color={color}
                        //     size={size}
                        //     />
                        // )}
                        label="Sign Out"
                        onPress={() => {this.disconnect()}}
                    />
                </Drawer.Section>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    drawerContent:{
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
      },
    title:{
        fontSize: 16,
        marginTop: 3,
        fontWeight: "bold"
    },
    caption:{
        fontSize: 14,
        lineHeight: 14
    },
    row:{
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    section:{
        marginRight: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    paragraph:{
        fontWeight: "bold",
        marginRight: 3
    },
    drawerSection:{
        marginTop: 15
    },
    bottomDrawerSection:{
        marginBottom: 15,
        borderTopColor: "#f4f4f4",
        borderTopWidth: 1
    },
    preference:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16
    }
});