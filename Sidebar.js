import React from 'react';
import { Dimensions, StyleSheet, View, Text, Button, TouchableHighlight } from 'react-native';

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
        justifyContent: 'center',
        alignContent: 'center',
        width: Dimensions.get('window').width,
        backgroundColor: 'rgb(98, 196, 143)'
    },
    menuButtonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 50,
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
                
                <TouchableHighlight onPress={() => {this.changePage('BULLETIN')}}>
                    <View style={styles.menuButton}>
                        <Text style={styles.menuButtonTitle}>Bulletin</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.changePage('MESSAGING')}}>
                    <View style={styles.menuButton}>
                        <Text style={styles.menuButtonTitle}>Messaging</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.changePage('TODO_PERSONAL')}}>
                    <View style={styles.menuButton}>
                        <Text style={styles.menuButtonTitle}>To-Do (Personal)</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.changePage('TODO_SHARED')}}>
                    <View style={styles.menuButton}>
                        <Text style={styles.menuButtonTitle}>To-Do (Shared)</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.changePage('LIGHTS')}}>
                    <View style={styles.menuButton}>
                        <Text style={styles.menuButtonTitle}>Lights</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.changePage('REFRIGERATOR')}}>
                    <View style={styles.menuButton}>
                        <Text style={styles.menuButtonTitle}>Refrigerator</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.changePage('RECIPES')}}>
                    <View style={styles.menuButton}>
                        <Text style={styles.menuButtonTitle}>Recipes</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.changePage('KEYHANGER')}}>
                    <View style={styles.menuButton}>
                        <Text style={styles.menuButtonTitle}>Key Hanger</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.changePage('ACCOUNT')}}>
                    <View style={styles.menuButton}>
                        <Text style={styles.menuButtonTitle}>Account</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    changePage(i) {
        if(i === 'ACCOUNT') {
            if(this.props.rStore.getState().currentUser === null) {
                this.props.rStore.dispatch({ type: 'LOGINPAGE' });
                return;
            } else {
                this.props.rStore.dispatch({ type: 'ACCOUNT' });
                return;
            }
        }
        this.props.rStore.dispatch({
            type: i
        });
    }

}