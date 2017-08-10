import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, TextInput, Alert, TouchableHighlight,
        FlatList, TouchableWithoutFeedback } from 'react-native';

import Page from './Page';

import FoodRecipe from '../FoodRecipe';


export default class Recipes extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            recipes: []
        };
    }

    componentDidMount() {
        this.loadRecipes();
    }
    

    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Recipes</Text>

                <TouchableHighlight onPress={() => {}}
                                    underlayColor="rgba(0,0,0,0)">
					<View style={styles.uploadButtonView}>
						<Text style={styles.uploadButton}>
							+
						</Text>
					</View>
				</TouchableHighlight>
                <FlatList ref={(FlatList) => {this._recipeList = FlatList}}
                        style={styles.list}
                        data={this.state.recipes} 
                        renderItem={this.recipeCellComponent}
                        refreshing={false}
                        onRefresh={() => this.loadRecipes()}/>
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    /** Loads all the recipes that can be made given the current food options 
    * in the refrigerator. */
    loadRecipes() {
        FoodRecipe.loadAllRecipes((arr) => {

            this.setState({ recipes: [] }, () => {
                var loaded = this.state.recipes.concat(arr);
                //loaded.sort( (a, b) => { return b.ingredients.length - a.ingredients.length });
                
                this.setState({ recipes: loaded });
                console.log(loaded);
            });

        }, (err, arr) => {
            this.setState({ recipes: [] });
        });
    }




    /********************
    *       OTHER       *
    *********************/

    /** The component for the list cell. */
    recipeCellComponent = ({item}) => {
        var ingredientsString = "";
        for(var i = 0; i < item.ingredients.length; i++) {
            ingredientsString += "Name: " + item.ingredients[i].foodName + ", Quantity: " + item.ingredients[i].quantity + "\n";
        }

        return (
            <TouchableWithoutFeedback onPress={() => {
                    FoodRecipe.canMakeRecipe(item.key, (result) => {
                        Alert.alert('Make This Recipe', result ? 'You can make this recipe!' : 'Sorry, you do not have the ingredients to make this recipe',
                            [{text:'Ok', onPress: () => {}, style: 'cancel'}],
                            {cancelable:true}
                        );
                    })
                }}>
                <View style={styles.cell}>
                    <Text style={styles.cellText}>Name: {item.name}{'\n'}</Text>
                     <Text style={styles.cellText}>
                         Ingredients: {'\n'}
                         {ingredientsString}
                    </Text>  
                </View>
            </TouchableWithoutFeedback>
        );
    }
}


const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(255, 251, 216)'
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
        marginBottom: 20,
        width: Dimensions.get('screen').width - 50, 
        backgroundColor: 'rgb(244, 237, 168)'
    },
    cellText: {
        fontSize: 20,
        color: 'rgba(0,0,0,0.35)',
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center'
    },

    uploadButtonView: {
        width: Dimensions.get('window').width - 20,
        marginTop: 35,
        left: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(244, 233, 149)'
    },
    uploadButton: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.35)',
    },
});