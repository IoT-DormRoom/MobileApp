import React from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';

import Page from './Page';

const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'green'
    },
    title: {
        top:20,
        color:'black',
        opacity:0.35,
        fontSize:40,
        textAlign:'center',
        fontFamily:'Avenir',
        fontWeight:'bold'
    }
});

export default class Messaging extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/



    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Account</Text>
            </View>
        );
    }

}