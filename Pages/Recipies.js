import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, TextInput, Alert, TouchableHighlight } from 'react-native';

import Page from './Page';

const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(167, 173, 209)'
    },
    title: {
        top:20,
        color:'black',
        opacity:0.45,
        fontSize:40,
        textAlign:'center',
        fontWeight:'bold'
    },

});

export default class Recipies extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            
        };
    }

    

    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Recipies</Text>

            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    


}