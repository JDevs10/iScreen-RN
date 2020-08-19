import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import DeviceInfo from 'react-native-device-info';

let HW = {
    MyDeviceWidth: 0,
    MyDeviceHeight: 0
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class Carousel extends Component {
    scrollRef = React.createRef();
    constructor(props){
        super(props);
        this.state = {
            selectedIndex: 0
        };
    }

    componentDidMount = () => {
        setInterval(() => {
            this.setState(prev => ({selectedIndex: prev.selectedIndex === (this.props.data.length - 1) ? 0 : (prev.selectedIndex + 1)}), () => {
                this.scrollRef.current.scrollTo({
                    animated: true,
                    y: 0,
                    x: DEVICE_WIDTH * this.state.selectedIndex
                });
                //console.log('selectedIndex => ' + this.state.selectedIndex);
            });
        }, 2000);
    }

    setSelectedIndex = event => {
        //get width of the viewSize
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        //get the current position of the scrollView
        const contentOffSet = event.nativeEvent.contentOffSet.x;
        const selectIndex = Math.floor(contentOffSet / viewSize);
        this.setState({selectIndex: selectIndex});
    }

    productSelected(item){
        alert('json: ' + JSON.stringify(item));
    }

    render() {
        const data = this.props.data;
        HW = this.props.HW;
        const {selectedIndex} = this.state;
        // console.log('HW : ', HW);

        return (
            <View style={{height: "100%", width: "100%"}}>
                <ScrollView 
                    horizontal= {true}
                    onMomentumScrollEnd={this.setSelectedIndex} 
                    ref={this.scrollRef}
                    >
                    {
                        data.map((item, index) => (
                            // <Image 
                            //     key={index} 
                            //     source={item.pic}
                            //     style={styles.bg}/>
                            <TouchableOpacity key={index} onPress={() => this.productSelected(item)}>
                                    <View style={{alignItems: "center", justifyContent: "center", marginTop: 10, marginBottom: 10}}>
                                        <ImageBackground style={{width: HW.MyDeviceWidth, height: HW.MyDeviceHeight,}} source={item.pic}>

                                            <View style={{width: (HW.MyDeviceWidth * .9), position: "absolute", padding: 40, top: 0}}>
                                                <Text style={{fontSize: 35, fontWeight: "bold"}}>{item.label}</Text>
                                                <Text style={{width: ((HW.MyDeviceWidth * .9) * 0.25), fontSize: 20}}>{item.description}</Text>
                                            </View>
                                            <View style={{width: (HW.MyDeviceWidth * .9), position: "absolute", padding: 10, bottom: 0, left: (HW.MyDeviceWidth * .6)}}>
                                                <ImageBackground style={{width: DeviceInfo.isTablet() ? 300 : 50, height: DeviceInfo.isTablet() ? 250 : 20, alignItems: "center", justifyContent: "center"}} source={require('../../../img/price-tag.png')}>
                                                    <Text style={{fontSize: 60, fontWeight: "bold"}}>{item.prix}</Text>
                                                </ImageBackground>
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