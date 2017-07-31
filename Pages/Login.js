import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableHighlight } from 'react-native';

import Page from './Page';

const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(90, 201, 173)'
    },
    title: {
        top:20,
        color:'black',
        opacity:0.45,
        fontSize:40,
        textAlign:'center',
        fontFamily:'Avenir',
        fontWeight:'bold'
    },

    inputField: {
        width: Dimensions.get('window').width,
        height: 40,
        justifyContent: 'center',
        textAlign: 'center',
        top: Dimensions.get('window').height / 25,
        backgroundColor: 'white',
        marginBottom: 10,
        marginTop: 20
    },
    button: {
        top: 50,
        left: Dimensions.get('window').width / 2 - 50,
        width: 100,
        height: 50,
        borderRadius: 20,
        marginBottom: 10,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    buttonTitle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Avenir'
    }
});

export default class Login extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            loginFieldText: '',
            passwordFieldText: ''
        };
    }


    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Login</Text>

                <TextInput ref={(TextInput)=> this._loginField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            keyboardType='email-address'
                            onChangeText={(text) => this.setState({ loginFieldText: text }) }
                            placeholder='Email' />
                <TextInput ref={(TextInput)=> this._passwordField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            caretHidden={true}
                            onChangeText={(text) => this.setState({ passwordFieldText: text }) }
                            placeholder='Password' />

                <TouchableHighlight onPress={this.handleLogin.bind(this)} underlayColor='rgba(0,0,0,0)'>
                    <View style={styles.button}>
                        <Text style={styles.buttonTitle}>Login</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handleSignUp.bind(this)} underlayColor='rgba(0,0,0,0)'>
                    <View style={styles.button}>
                        <Text style={styles.buttonTitle}>Sign Up</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    handleSignUp() {
        this.props.rStore.dispatch({
            type: 'CHANGE_PAGE',
            index: 7
        });
    }


    handleLogin() {
        var email = this.state.loginFieldText;
        var password = this.state.passwordFieldText;

        // Login with firebase
        firebase.auth().signInWithEmailAndPassword(email, password).then( (user) => {

            // Get the user credentials from the database.
            firebase.database().ref().child('Users').child(user.uid).once('value', (snap) => {
                
                this.props.rStore.dispatch({ type:'LOGIN', currentUser: snap.val() });

            }); // End of getting data.

        }).catch( (err) => {

            alert(err.message);

        }); // End of logging in.
    }

}