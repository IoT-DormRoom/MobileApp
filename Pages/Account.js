import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, TextInput, Alert, TouchableHighlight } from 'react-native';

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

export default class Account extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            emailFieldText: '',
            passwordFieldText: '',
            passwordConfirmText: ''
        };
    }

    

    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Account</Text>

                <TextInput ref={(TextInput)=> this._loginField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            keyboardType='email-address'
                            onChangeText={(text) => this.setState({ emailFieldText: text }) }
                            placeholder='Update Email' />
                <TextInput ref={(TextInput)=> this._passwordField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            caretHidden={true}
                            onChangeText={(text) => this.setState({ passwordFieldText: text }) }
                            placeholder='Update Password' />
                <TextInput ref={(TextInput)=> this._passwordField = TextInput}
                            style={styles.inputField}
                            autoCorrect={false}
                            multiline={false}
                            caretHidden={true}
                            onChangeText={(text) => this.setState({ passwordConfirmText: text }) }
                            placeholder='Re-enter your new password' />

                <TouchableHighlight onPress={this.handleSaveChanges.bind(this)} underlayColor='rgba(0,0,0,0)'>
                    <View style={styles.button}>
                        <Text style={styles.buttonTitle}>Save Changes</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handleLogout.bind(this)} underlayColor='rgba(0,0,0,0)'>
                    <View style={styles.button}>
                        <Text style={styles.buttonTitle}>Logout</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    handleSaveChanges() {
        const store = this.props.rStore.getState();

        var email = this.state.emailFieldText;
        var password = this.state.passwordFieldText;
        var confirmPass = this.state.passwordConfirmText;

        if(email != '') {
            // Update email
            firebase.auth().currentUser.updateEmail(email).then( () => {
                // Update the local user object.
                let usr = store.currentUser;
                usr.email = email;

                Alert.alert('Update Email', 'Successfully updated your email!',
                    [{text:'Ok',onPress:() => {}, style:'cancel'}],
                    { cancelable: true }
                );
            }).catch( (err) => {
                Alert.alert('Error', '' + err,
                    [{text:'Close',onPress:() => {}, style:'cancel'}],
                    { cancelable: true }
                );
                return;
            });
        }

        if(password != '' && confirmPass != '') {
            if(password === confirmPass) {
                // Update password
                firebase.auth().currentUser.updatePassword(password).then( () => {
                    Alert.alert('Update Password', 'Successfully updated your password!',
                        [{text:'Ok',onPress:() => {}, style:'cancel'}],
                        { cancelable: true }
                    );
                }).catch( (err) => {
                    Alert.alert('Error', '' + err,
                        [{text:'Close',onPress:() => {}, style:'cancel'}],
                        { cancelable: true }
                    );
                    return;
                });
            } else {
                Alert.alert('Error', 'Passwords do not match.',
                    [{text:'Close',onPress:() => {}, style:'cancel'}],
                    { cancelable: true }
                );
                return;
            }
        }
    }


    handleLogout() {
        firebase.auth().signOut();
        this.props.rStore.dispatch({
            type: 'LOGOUT'
        });
    }


}