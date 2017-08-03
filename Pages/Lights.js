import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, Button, FlatList } from 'react-native';

import Page from './Page';

const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(247, 179, 69)'
    },
    title: {
        top:20,
        color:'black',
        opacity:0.45,
        fontSize:40,
        textAlign:'center',
        fontWeight:'bold'
    },
    listView: {
        top: 50
    },
    
    listCell: {
        width: Dimensions.get('window').width,
        height: 50,
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellTitle: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        paddingRight: 10
    },
    cellButton: {
        fontSize: 25,
        fontWeight: 'bold',
    }
});

export default class Lights extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            lightData: []
        }
    }

    componentDidMount() {
        this.loadLights();
    }

    componentWillUnmount() {
        firebase.database().ref().child('lights').off();
    }



    /********************
    *       RENDER      *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Lights</Text>

                <FlatList style={styles.listView} 
                        data={this.state.lightData} 
                        renderItem={this.lightsListCell}/>
            </View>
        );
    }




    /********************
    *      METHODS      *
    *********************/

    /** Loads the light values from the database. */
    loadLights() {
        firebase.database().ref().child('lights').on('value', this.loadCallback);
    }


    /** Firebase load callback */
    loadCallback = (snap) => {
        var a = [];

        snap.forEach( (light) => {
            var obj = {
                key: a.length,
                name: light.key,
                onOff: light.val().on
            };

            a.push(obj);
        });

        this.setState({ lightData: a });
        this.forceUpdate();
    }




    /** What should be rendered in the list view cell for the lights page. */
    lightsListCell = ({item}) => {
        return (
            <View style={styles.listCell}>
                <Text style={styles.cellTitle}>{item.name}</Text>
                <Button ref={(ref)=> this._toggleBtn = ref } style={styles.cellButton} title={item.onOff ? 'On' : 'Off'} color={item.onOff ? 'green' : 'red'} onPress={() => {
                    firebase.database().ref().child('lights').child(item.name).set({ on: !item.onOff });
                }}/>
            </View>
        )
    }

}