import React, { Component } from 'react'
import { View, Text, Button, Image, TouchableOpacity, TextInput, Platform, StyleSheet , StatusBar, ScrollView, Alert } from 'react-native';
import MyFooter from './Footer/MyFooter';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import SettingsServices from '../services/SettingsServices';

export default class Settings_v2 extends Component {
    inputKey_length = 24;         // needs 25 digits
    inputServer_length = 3;       // needs 4 digits

    constructor(props){
        super(props);
        this.state = {
          server: '',
          key: '',
          check_textInputChange_server: false,
          check_textInputChange_key: false,
          secureKeyTextEntry: true,
        };
    }


    render() {
        const textInputChanged_server = (val) => {
            if(val.length > this.inputServer_length){
              
              this.setState({
                ...this.state,
                server: val,
                check_textInputChange_server: true
              });
              
            }else{
              this.setState({
                ...this.state,
                server: val,
                check_textInputChange_server: false
              });
            }
        }
          
        const handleKeyChange = (val) =>{
            if(Validate_key(val) == 'true'){
              
              this.setState({
                ...this.state,
                key: val,
                check_textInputChange_key: true
              });
              
            }else{
              this.setState({
                ...this.state,
                key: val,
                check_textInputChange_key: false
              });
            }
        };
      
        const updateSecureKeyTextEntry = () =>{
            this.setState({
              ...this.state,
              secureKeyTextEntry: !this.state.secureKeyTextEntry
            });
        };

        const Validate_IpOrUrl_address = (address) =>{  
            let isIp = true;
            let isUrl = true;
            let result = "";
      
            if(address.length <= this.inputServer_length){
              return "* Le serveur n'est pas valide => [Error:Length] : " + address.length;
            }
      
            if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address)) {  
              isIp = false;
              result = "* L'adresse ip '"+address+"' n'est pas au bon format!";
            }
      
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
              '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
              '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            if (!pattern.test(address)) {  
              isUrl = false;
              result += "\nOu\n* L'url '"+address+"' n'est pas au bon format!";
            }
      
            if(!isIp && !isUrl){
              return result;
            }else{
              return "true";
            }
        } 
      
        const Validate_key = (inputKey) =>{  
            let isInputKey = true;
            let isUrl = true;
            let result = "";
      
            if(inputKey.length <= this.inputKey_length){
              return "* La clé licence n'est pas valide => [Error:Length] : " + inputKey.length;
            }
      
            if (!/([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})/.test(inputKey)
                && inputKey.split("-").length != 5) {  
              isInputKey = false;
              result = "* La licence '"+inputKey+"' n'est pas au bon format! :: " + inputKey.split("-").length;
            }
      
            isUrl = false;
      
            // var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            //   '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            //   '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            //   '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            //   '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            //   '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            // if (!pattern.test(address)) {  
            //   isUrl = false;
            //   result += "\nOu\n* L'url '"+address+"' n'est pas au bon format!";
            // }
      
            if(!isInputKey && !isUrl){
              return result;
            }else{
              return "true";
            }
        }

        //check passed data before sending it to iStock auth-creation module
    const verifyData = () =>{

        const data_ = {
          server: this.state.server.trim(),
          key: this.state.key
        };
  
        const result_ip_url = Validate_IpOrUrl_address(data_.server);
        if(result_ip_url != 'true'){
          errors += "###############\n"+result_ip_url + "\n";
        }
        
        const result_key = Validate_key(data_.key);
        if(result_key != 'true'){
          errors += "###############\n"+result_key + "\n";
        }
        
        if(errors.length > 1){
          alert(errors);
          return;
        }
  
        const settings = new SettingsServices();
        settings.Save(data__);
    };

        return (
            <View style={styles.container}>

                <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content"/>
                <View style={styles.header}>
                    <Text style={styles.text_header}>Enregistrement des configurations</Text>
                </View>
                <Animatable.View 
                    animation="fadeInUpBig"
                    style={styles.body}>

                    <ScrollView>
                    
                        <Text style={[styles.text_footer, {marginTop: 40}]}>Adresse du serveur</Text>

                        <View style={styles.action}>
                            <FontAwesome 
                            name="server" 
                            color="#05375a" 
                            size={20}/>
                            <TextInput 
                            placeholder="Ex: toto.com ou 127.0.0.1" 
                            style={styles.textInput} 
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChanged_server(val)}/>

                            {this.state.check_textInputChange_server ? 
                            <Animatable.View animation="bounceIn">
                                <Feather 
                                name="check-circle" 
                                color="#00AAFF" 
                                size={20}  />
                            </Animatable.View>
                            : 
                            null} 
                            
                        </View>

                        <Text style={[styles.text_footer, {marginTop: 40}]}>Licence</Text>
                        <View style={styles.action}>
                            <FontAwesome 
                            name="key" 
                            color="#05375a" 
                            size={20}/>
                            <TextInput 
                            placeholder="Ex: xxxx-xxxx-xxxx-xxxx-xxxx" 
                            style={styles.textInput} 
                            autoCapitalize="none" 
                            secureTextEntry={this.state.secureKeyTextEntry ? true : false}
                            onChangeText={(val) => handleKeyChange(val)}/>

                            

                            <View style={{flexDirection: "row"}}>
                            <View style={{paddingRight: 5}}>
                                <TouchableOpacity
                                onPress={updateSecureKeyTextEntry}>

                                {this.state.secureKeyTextEntry ? 
                                <Feather 
                                    name="eye" 
                                    color="grey" 
                                    size={20}/>
                                : 
                                <Feather 
                                    name="eye-off" 
                                    color="grey" 
                                    size={20}/>
                                }
                                </TouchableOpacity>

                            </View>
                            <View style={{paddingLeft: 5}}>
                                {this.state.check_textInputChange_key ? 
                                <Animatable.View animation="bounceIn">
                                    <Feather 
                                    name="check-circle" 
                                    color="#00AAFF" 
                                    size={20}  />
                                </Animatable.View>
                                : 
                                null}

                            </View>
                            </View>
                            
                        </View>

                        <View style={styles.button}>
                            <TouchableOpacity 
                                style={styles.signIn}
                                onPress={() => verifyData()}>
                                <View style={styles.signIn}>
                                <Text style={[styles.textSign, {color: '#FFF'}]}>Enregistrer</Text>
                                </View>
                            </TouchableOpacity>
                            

                            <TouchableOpacity
                                onPress={() => end()} 
                                style={[styles.signIn, {
                                borderColor: "#00AAFF",
                                borderWidth: 1,
                                marginTop: 15
                                }]}>
                                <Text style={[styles.textSign, {color: '#000'}]}>Annuler</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                </Animatable.View>
                <MyFooter/>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#00AAFF'
    },
    header: {
        // paddingHorizontal: 20,
        // paddingTop: 20,
        // paddingBottom: 30,
        height: '20%',
        width: '100%',
        position: "relative"
    },
    body: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30,
      height: '70%',
      width: '100%',
      position: "absolute",
      bottom: 60,
    },
    text_header: {
        padding: 20,
        color: '#ABCDEF',
        fontWeight: 'bold',
        fontSize: 30,
        position: "absolute",
        bottom: 0
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : 12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderRadius: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });