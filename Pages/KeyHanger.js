import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, Button, Image, FlatList, WebView,
        TouchableHighlight, Alert, Modal, TextInput } from 'react-native';

import superagent from 'superagent';

import Page from './Page';



// Methods to connect to the database.

/**  Returns whether or not the keys is on the hooks.
*   @param {Function} result The function that gets called when the data has been loaded.
*   Returns two parameters, each stating whether the left and right keys are on their hooks.
*   @param {Function} failure The block to run if there is ever an error loading the data.
*/
const keysOnHook = (result, failure) => {
    superagent.get("https://dorm-service-server.herokuapp.com/keyhook", (err, resp) => {
        if(err) { failure(err); return; }

        var json = JSON.parse(resp.text);
        result(json['leftHook'], json['rightHook']);
    });
};







export default class KeyHanger extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            keys: [
                {name: "Left Key: ", value: false, key: 0},
                {name: "Right Key: ", value: false, key: 1}
            ]
        }
    }

    componentDidMount() {
        this.loadKeyHooks();
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

                <FlatList ref={(FlatList) => {this._keysList = FlatList}}
                        style={styles.list}
                        data={this.state.keys} 
                        renderItem={this.keyCell}/>
            </View>
        );
    }



    /********************
    *      METHODS      *
    *********************/

    // Loads the data for whether or not the room keys are on their respective hooks.
    loadKeyHooks() {
        keysOnHook( (leftRes, rightRes) => {
            var arr = [];
            arr.push({ name: "Left Key: ", value: leftRes, key: 0 });
            arr.push({ name: "Right Key: ", value: rightRes, key: 1 });
            
            this.setState({ keys: arr });
        }, (err) => {
            Alert.alert('Error', '' + err, [{text:'Close',onPress:()=>{},style:'cancel'}],
                {cancelable:true}
            );
            return;
        });
    }




    /********************
    *       OTHER       *
    *********************/

    keyCell = ({item}) => {
        return (
            <View style={styles.listCell}>
                <Text style={styles.cellText}>
                    {item.name} {item.value === true ? "On the hook" : "Not on the hook"}
                </Text>
            </View>
        );
    }

    
}


// STYLES
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
    },


    list: {
        marginTop: 50
    },
    listCell: {
        width: Dimensions.get('window').width,
        height: 45,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'white'
    },
    cellText: {
        fontSize: 20,
        fontFamily: 'Avenir',
        textAlign: 'center'
    }
});