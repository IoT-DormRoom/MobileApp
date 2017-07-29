import React from 'react';
import { Dimensions, StyleSheet, View, Text, Button } from 'react-native';

import Bulletin from './Pages/Bulletin';
import Messaging from './Pages/Messaging';


const styles = StyleSheet.create({
    sidebar: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingTop: Dimensions.get('window').height / 25,
        backgroundColor: 'rgb(112, 220, 165)'
    },
    menuButton: {
        width: Dimensions.get('window').width,
        height: 50,
        backgroundColor: 'rgb(98, 196, 143)'
    },
    buttonTitle: {
        lineHeight: 50,
        textAlign: 'center'
    }
});


export default class Sidebar extends React.Component {

    /********************
    *   INITIALIZATION  *
    *********************/



    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.sidebar}>
                <Button title='Bulletin' color='black' onPress={() => {
                    this.changePage(0);    
                }} />
                <Button title='Messaging' color='black' onPress={() => {
                    this.changePage(1);
                }}/>
                <Button title='To-Do (Personal)' color='black' onPress={() => {
                    this.changePage(2);
                }} />
                <Button title='To-Do (Shared)' color='black' onPress={() => {
                    this.changePage(3);
                }} />
                <Button title='Lights' color='black' onPress={() => {
                    this.changePage(4);
                }} />
                <Button title='Account' color='black' onPress={() => {
                    this.changePage(4);
                }} />
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    changePage(i) {
        this.props.rStore.dispatch({
            type: 'CHANGE_PAGE',
            index: i
        });
    }

}