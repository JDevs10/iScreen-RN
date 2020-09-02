import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import DeviceInfo from 'react-native-device-info';
import SettingsManager from '../../Database/SettingsManager';

let HW = {
    MyDeviceWidth: 0,
    MyDeviceHeight: 0
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
let myInterval;
let autoPlay = true;

export default class Carousel extends Component {
    scrollRef = React.createRef();
    constructor(props){
        super(props);
        this.state = {
            _autoPlay: false,
            _showTittle: false,
            _showDescription: false,
            _speedScroll: (2 * 1000),
            _showPriceContainer: false,
            _showPriceLabel: false,
            selectedIndex: 0,
            updating: false
        };
    }

    componentDidMount(){
        this.updateSettings();
        this.autoScroll();
    }

    componentWillUpdate(nextProps, nextState) {
        nextState._autoPlay = nextProps.settings.autoPlay,
        nextState._showTittle = nextProps.settings.showTittle,
        nextState._showDescription = nextProps.settings.showDescription,
        nextState._speedScroll = (nextProps.settings.speed * 1000),
        nextState._showPriceContainer = nextProps.settings.showPrice,
        nextState._showPriceLabel = nextProps.settings.showPrice,
        nextState._modifyDate = nextProps.settings.modifyDate

        console.log('nextProps : ', nextProps);
        console.log('nextState : ', nextState);
    }

    updateSettings(){
        const settings = this.props.settings;
        console.log('Carousel | settings : ', settings);
        this.setState({
            _autoPlay: settings.autoPlay,
            _showTittle: settings.showTittle,
            _showDescription: settings.showDescription,
            _speedScroll: (settings.speed * 1000),
            _showPriceContainer: settings.showPrice,
            _showPriceLabel: settings.showPrice,
            _modifyDate: settings.modifyDate
        });
    }

    async _checkSettingsUpdated(){
        if(!this.state.updating){
            this.setState({updating: true});
            console.log('_checkSettingsUpdated | updating....');

            const sm = new SettingsManager();
            await sm.initDB();
            const settings = await sm.GET_SETTINGS_BY_ID(1).then(async (val) => {
                console.log('_checkSettingsUpdated | GET_SETTINGS_BY_ID: val => ', val);
                console.log('_checkSettingsUpdated | GET_SETTINGS_BY_ID: modifyDate => ', val.modifyDate);
                return await val;
            });

            if(this.state._modifyDate != settings.modifyDate){
                this.setState({
                    _autoPlay: settings.autoPlay,
                    _showTittle: settings.showTittle,
                    _showDescription: settings.showDescription,
                    _speedScroll: (settings.speed * 1000),
                    _showPriceContainer: settings.showPrice,
                    _showPriceLabel: settings.showPrice,
                    _modifyDate: settings.modifyDate
                });
            }
            this.setState({updating: false});
        }
        
    }

    setSelectedIndex = event => {
        try{
            //get width of the viewSize
            const viewSize = event.nativeEvent.layoutMeasurement.width;
            //get the current position of the scrollView
            const contentOffSet = event.nativeEvent.contentOffSet.x;
            const selectIndex = Math.floor(contentOffSet / viewSize);
            this.setState({selectIndex: selectIndex});
        }catch(error){
            console.log('setSelectedIndex() error : ', error);
        }
    }

    autoScroll(){
        if(this.autoPlay && this.state._autoPlay){
            myInterval = setInterval(() => {
                this.setState(prev => ({selectedIndex: prev.selectedIndex === (this.props.data.length - 1) ? 0 : (prev.selectedIndex + 1)}), () => {
                    this.scrollRef.current.scrollTo({
                        animated: true,
                        y: 0,
                        x: DEVICE_WIDTH * this.state.selectedIndex
                    });
                    console.log('selectedIndex => ' + this.state.selectedIndex);
                    console.log('x => ' + DEVICE_WIDTH * this.state.selectedIndex);
                });
            }, this.state._speedScroll);
        }
    }

    touchStart(){
        if(myInterval && this.state._autoPlay){
            clearInterval(myInterval);
            myInterval = null;
            this.autoPlay = false;
        }
    }

    touchEnd(){
        if(this.state._autoPlay){
            setTimeout(async () => {
                this.autoPlay = true;
                this.autoScroll();
            }, 5000);
        }
    }

    productSelected(item){
        alert('json: ' + JSON.stringify(item));
    }

    render() {
        const data = this.props.data;
        HW = this.props.HW;
        const {selectedIndex} = this.state;

        return (
            <View style={{height: "100%", width: "100%"}}>
                <ScrollView 
                    horizontal= {true}
                    centerContent={true}
                    snapToAlignment={"center"}
                    alwaysBounceHorizontal={true}
                    onTouchStart={this.touchStart()}
                    onTouchEnd={this.touchEnd()}
                    onMomentumScrollEnd={this.setSelectedIndex} 
                    ref={this.scrollRef}
                    >
                    {
                        data.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => this.productSelected(item)}>
                                <View style={{alignItems: "center", justifyContent: "center", marginTop: 10, marginBottom: 10}}>
                                    <ImageBackground style={{width: HW.MyDeviceWidth, height: HW.MyDeviceHeight,}} source={require("../../../img/no-img.jpg")}>

                                        <View style={{width: (HW.MyDeviceWidth * .9), position: "absolute", padding: 40, top: 0}}>
                                            {this.state._showTittle ? <Text style={{fontSize: 35, fontWeight: "bold"}}>{item.label}</Text> : null}
                                            {this.state._showTittle ? <Text style={{width: ((HW.MyDeviceWidth * .9) * 0.25), fontSize: 20}}>{item.description}</Text> : null}     
                                        </View>
                                        <View style={{width: (HW.MyDeviceWidth * .9), position: "absolute", padding: 10, bottom: 0, left: (HW.MyDeviceWidth * .6)}}>
                                            { this.state._showPriceContainer && this.state._showPriceLabel ? 
                                                <ImageBackground style={{width: DeviceInfo.isTablet() ? 300 : 50, height: DeviceInfo.isTablet() ? 250 : 20, alignItems: "center", justifyContent: "center"}} source={require('../../../img/price-tag.png')}>
                                                    <Text style={{fontSize: 60, fontWeight: "bold"}}>{parseFloat(item.price) * 100 / 100} €</Text>
                                                </ImageBackground>
                                            : null}
                                            { !this.state._showPriceContainer && this.state._showPriceLabel ? 
                                                <Text style={{width: DeviceInfo.isTablet() ? 300 : 50, height: DeviceInfo.isTablet() ? 250 : 20, alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: "bold"}}>{parseFloat(item.price) * 100 / 100} €</Text>
                                            : null}
                                        </View>
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>

                <View style={styles.circleDiv}>
                    {
                        data.map((item, index) => (
                            <View 
                                key={index}
                                style={[styles.whiteCircle, {opacity: index === selectedIndex ? 0.2 : 1}]}/>
                        ))
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bg: {
        height: "100%",
        width: HW.MyDeviceWidth
    },
    circleDiv: {
        position: "absolute",
        bottom: 15,
        height: 10,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    whiteCircle: {
        height: 6,
        width: 6,
        borderRadius: 3,
        margin: 5,
        backgroundColor: "#000"
    }
    });