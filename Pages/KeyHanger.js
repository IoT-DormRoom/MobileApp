import React from 'react';
import * as firebase from 'firebase';
//import imagePicker from 'react-native-imagepicker';
import { Dimensions, StyleSheet, View, Text, Button, Image, FlatList, WebView,
        TouchableHighlight, Alert, Modal, TextInput } from 'react-native';

import Page from './Page';

//STYLES
const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(244, 100, 100)',
    },
    title: {
        top:20,
        color:'black',
        opacity:0.45,
        fontSize:40,
        textAlign:'center',
        fontWeight:'bold'
    }
});

export default class KeyHanger extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            
        }
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        
    }



    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Key Hanger</Text>

            </View>
        );
    }






    /********************
    *       OTHER       *
    *********************/

    
}