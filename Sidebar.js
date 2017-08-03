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
        height: 50,
        position: 'relative',
        width: Dimensions.get('window').width,
        backgroundColor: 'rgb(98, 196, 143)'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.45)'
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
                <Text style={styles.title}>Dashboard</Text>
                
                <View style={styles.menuButton}>
                    <Button title='Bulletin' color='rgba(0, 0, 0, 0.45)' onPress={() => {
                        this.changePage(0);    
                    }} />
                </View>
                <View style={styles.menuButton}>
                    <Button title='Messaging' color='rgba(0, 0, 0, 0.45)' onPress={() => {
                        this.changePage(1);
                    }}/>
                </View>
                <View style={styles.menuButton}>
                    <Button title='To-Do (Personal)' color='rgba(0, 0, 0, 0.45)' onPress={() => {
                        this.changePage(2);
                    }} />
                </View>
                <View style={styles.menuButton}>
                    <Button title='To-Do (Shared)' color='rgba(0, 0, 0, 0.45)' onPress={() => {
                        this.changePage(3);
                    }} />
                </View>
                <View style={styles.menuButton}>
                    <Button title='Lights' color='rgba(0, 0, 0, 0.45)' onPress={() => {
                        this.changePage(4);
                    }} />
                </View>
                <View style={styles.menuButton}>
                    <Button title='Key Hanger' color='rgba(0, 0, 0, 0.45)' onPress={() => {
                        this.changePage(5);
                    }} />
                </View>
                <View style={styles.menuButton}>
                    <Button title='Account' color='rgba(0, 0, 0, 0.45)' onPress={() => {
                        this.changePage(6);
                    }} />
                </View>
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    changePage(i) {
        if(i === 6) {
            if(this.props.rStore.getState().currentUser === null) {
                this.props.rStore.dispatch({
                    type: 'CHANGE_PAGE',
                    index: 7
                });
                return;
            }
        }
        this.props.rStore.dispatch({
            type: 'CHANGE_PAGE',
            index: i
        });
    }

}