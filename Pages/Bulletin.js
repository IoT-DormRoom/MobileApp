import React from 'react';
import { Dimensions, StyleSheet, View, Text, Button } from 'react-native';

import Page from './Page';

const styles = StyleSheet.create({
    pageStyles: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'green'
    }
});

export default class Bulletin extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/



    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    openMenu() {

    }

}