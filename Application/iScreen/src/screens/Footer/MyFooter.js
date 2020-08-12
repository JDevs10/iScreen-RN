import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class MyFooter extends Component {
    render() {
        return (
            <View style={styles.body}>
                <Text style={styles.text}>© iScreen - Développer JDevs10</Text>
            </View>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    body:{
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        width: '100%',
        height: '5%'
    },
    text: {
        color: '#fff'
    }
});