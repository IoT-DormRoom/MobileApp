import React from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';

import Page from './Page';

const styles = StyleSheet.create({
    pageStyles: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'lightblue'
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
                <Text>Still Working</Text>
            </View>
        );
    }

}