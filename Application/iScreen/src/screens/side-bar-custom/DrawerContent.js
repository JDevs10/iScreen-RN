import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, BackHandler, Alert, Dimensions, AsyncStorage } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Paragraph, Drawer, Text, TouchableRipple, Switch } from 'react-native-paper';
import SettingsManager from '../../Database/SettingsManager';
import ServerManagement from '../../Database/ServerManagement';
import CategoriesManager from '../../Database/CategoriesManager';
import ProduitsManager from '../../Database/ProduitsManager';
import FindImages from '../../services/FindImages';



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

            const SettingsManager_ = new SettingsManager();
            await SettingsManager_.initDB();
            await SettingsManager_.DROP_SERVER();

            const ServerManagement_ = new ServerManagement();
            await ServerManagement_.initDB();
            await ServerManagement_.DROP_SERVER();

            const CategoriesManager_ = new CategoriesManager();
            await CategoriesManager_.initDB();
            await CategoriesManager_.DROP_SERVER();

            const ProduitsManager_ = new ProduitsManager();
            await ProduitsManager_.initDB();
            await ProduitsManager_.DROP_SERVER();

            BackHandler.exitApp();
        }else{
            console.log('Cancel Pressed');
        }
    }

    download_images_alert(){
        Alert.alert(
            "Téléchargement des Images",
            "Cette action risque de prendre du temps, veuillez ne pas arreter l'application durant cette opération",
            [
              {text: 'No', onPress: () => {}},
              {text: 'Yes', onPress: () => this.download_images()},
            ],
            { cancelable: false }
        );
    }

    async download_images(){
        console.log('downloading.......');
        console.log('findImages');
        //find the selected company
        const token_ = await AsyncStorage.getItem('token');
        const token = JSON.parse(token_);
        console.log('token : ', token.token);

        const findImages = new FindImages();
        const res_3 = await findImages.getAllProduitsImagesFromServer(token).then(async (val) => {
            console.log('findImages.getAllProduitsImagesFromServer : ');
            console.log(val);
            return await val;
        });
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
                                label="Téléchargement des Images"
                                onPress={() => {this.download_images_alert()}}
                            />
                            <DrawerItem 
                                // icon={({color, size}) => (
                                //     <Icon 
                                //     name="account-check-outline" 
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
                        label="Déconnexion"
                        onPress={() => {disconnect()}}
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