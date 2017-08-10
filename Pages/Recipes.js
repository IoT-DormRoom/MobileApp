import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, TextInput, Alert, TouchableHighlight,
        FlatList } from 'react-native';

import Page from './Page';


export default class Recipes extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            food: [],
            recipies: []
        };
    }

    componentDidMount() {
        this.loadRecipies();
        this.loadFood();
        this.loadSingleFood();
    }
    

    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Recipes</Text>

                <FlatList ref={(FlatList) => {this._recipeList = FlatList}}
                        style={styles.list}
                        data={this.state.recipeOptionsWithCurrentFood} 
                        renderItem={this.recipeCellComponent}/>
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    /** Loads all the recipes that can be made given the current food options 
    * in the refrigerator.
    */
    loadRecipes() {
        
    }


    /** Loads all the food that is currently in the refrigerator.
    */
    loadFood() {
        loadAllFood((arr) => {
            this.setState({ food: this.state.food.concat([arr]) });
        }, (err, arr) => {
            
        });
    }
    

    /** Loads a single food item from the database with the given id. */
    loadSingleFood() {
        loadFood('-Kr7pCFXDL8V8Wg6TGk5', (food) => {
            console.log(food);
        }, (err) => {
            console.log(err);
        });
    }





    /********************
    *       OTHER       *
    *********************/

    /** The component for the list cell. */
    recipeCellComponent = <View>
        
    </View>

}


const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(167, 173, 209)'
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
        marginTop: 10,
        marginBottom: 10
    },
    cell: {
        left: 25,
        height: 300,
        marginBottom: 20,
        width: Dimensions.get('screen').width - 50, 
        backgroundColor: 'white'
    },
});