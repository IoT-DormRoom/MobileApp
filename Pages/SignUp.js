import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableHighlight,
        Alert } from 'react-native';

import Page from './Page';
import sCode from '../specialCode.json';

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
        left: Dimensions.get('window').width / 2 - 50,
        width: 100,
        height: 50,
        borderRadius: 20,
        marginTop: 35,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    buttonTitle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
    }
});

export default class SignUp extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            firstNameText: '',
            lastNameText: '',
            emailText: '',
            passwordText: '',
            passwordConfirmText: '',
            specialCode: ''
        }
    }


    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Sign Up</Text>

                <TextInput ref={(TextInput)=> this._firstNameField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            onChangeText={(text) => this.setState({ firstNameText: text }) }
                            placeholder='First Name' />
                <TextInput ref={(TextInput)=> this._lastNameField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            onChangeText={(text) => this.setState({ lastNameText: text }) }
                            placeholder='Last Name' />
                <TextInput ref={(TextInput)=> this._emailField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            keyboardType='email-address'
                            onChangeText={(text) => this.setState({ emailText: text }) }
                            placeholder='Email' />
                <TextInput ref={(TextInput)=> this._passwordField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            caretHidden={true}
                            onChangeText={(text) => this.setState({ passwordText: text }) }
                            placeholder='Password' />
                <TextInput ref={(TextInput)=> this._passwordConfirmField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            caretHidden={true}
                            onChangeText={(text) => this.setState({ passwordConfirmText: text }) }
                            placeholder='Password' />
                <TextInput ref={(TextInput)=> this._specialCodeField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            onChangeText={(text) => this.setState({ specialCode: text }) }
                            placeholder='Special code' />

                <TouchableHighlight onPress={this.handleSignUp.bind(this)} underlayColor='rgba(0,0,0,0)'>
                    <View style={styles.button}>
                        <Text style={styles.buttonTitle}>Create Account</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    handleSignUp() {
        var firstNameText = this.state.firstNameText;
        var lastNameText = this.state.lastNameText;
        var emailText = this.state.emailText;
        var passwordText = this.state.passwordText;
        var passwordConfirmText = this.state.passwordConfirmText;
        var specialCode = this.state.specialCode

        if(firstNameText != '' && lastNameText != '' && emailText != '' 
        && passwordText != '' && passwordConfirmText != '' && specialCode != '') {

            if(passwordText === passwordConfirmText) {
                if(specialCode === sCode.code) {

                    // Create the user in firebase auth.
                    firebase.auth().createUserWithEmailAndPassword(emailText, passwordText).then( (user) => {
                        
                        /* This is the completion block. Once the user has been created, save the actual
                        data to the database. */

                        const newUser = {
                            'firstName':firstNameText,
                            'lastName':lastNameText,
                            'email':emailText,
                            'uid':user.uid
                        }
                        firebase.database().ref().child('Users').child(user.uid).set(newUser); // End of saving user to database.

                        // Go to the account page.
                        this.props.rStore.dispatch({ 
                            type:'LOGIN',
                            currentUser: newUser
                        });

                    }); // End of creating user.

                }
                // Incorrect special code.
                else {
                    Alert.alert('Error', 'Please enter the correct code to create an account.',
                        [{text: 'Close', onPress: () => {}, style:'cancel'}],
                        { cancelable: true }
                    );
                }
            } 
            // Passwords do not match.
            else {
                Alert.alert('Error', 'Passwords do not match.',
                    [{text: 'Close', onPress: () => {}, style:'cancel'}],
                    { cancelable: true }
                );
            }
        }
        // Missing credentials.
        else {
            Alert.alert('Error', 'Please enter all information to create an account.',
                [{text: 'Close', onPress: () => {}, style:'cancel'}],
                { cancelable: true }
            );
        }
    }

}