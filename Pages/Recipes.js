import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, TextInput, Alert, TouchableHighlight,
        FlatList, TouchableWithoutFeedback, Modal } from 'react-native';

import Page from './Page';

import FoodRecipe from '../FoodRecipe';


export default class Recipes extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            recipes: [],
            food: [],
            selectedFood: [],
            openUploadDialog: false,
            recipeNameText: ''
        };
    }

    componentDidMount() {
        this.loadRecipes();
        this.loadFood();
    }
    

    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Recipes</Text>

                <TouchableHighlight onPress={() => { this.setState({ openUploadDialog: true }) }}
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


                {/* The modal for uploading a recipe. */}
                <Modal animationType={"fade"} transparent={false} visible={this.state.openUploadDialog} onRequestClose={() => {}}>
                    <View style={styles.detailModal}>
                        <Text style={styles.uploadTitle}>Upload Recipe:</Text>

                        <TextInput ref={(TextInput) => {this._recipeNameField = TextInput}}
                                autoCorrect={false}
                                style={styles.input}
                                multiline={false}
                                onChangeText={(text) => this.setState({ recipeNameText: text })}
                                placeholder='Enter the name of the recipe' />
                        
                        <Text style={styles.uploadTitle}>{'\n'}Select Ingredients:</Text>
                        <FlatList ref={(FlatList) => {this._foodList = FlatList}}
                            style={styles.foodList}
                            horizontal={true}
                            data={this.state.food} 
                            renderItem={this.foodCellComponent} />
                        <Text style={{fontSize:15}}>{this.state.selectedFood.map( (a,b,c) => { return a.name + ', ' })}</Text>


                        <TouchableHighlight onPress={() => this.handleSubmitRecipe()} underlayColor="rgba(0,0,0,0)">
                            <View style={styles.button}>
                                <Text style={{fontFamily:'Avenir',fontSize:20,textAlign:'center'}}>
                                    Upload
                                </Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.setState({openUploadDialog:false})} underlayColor="rgba(0,0,0,0)">
                            <View style={styles.button}>
                                <Text style={{fontFamily:'Avenir',fontSize:20,textAlign:'center'}}>
                                    Cancel
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </Modal>
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
                loaded.sort( (a, b) => { return b.ingredients.length - a.ingredients.length });
                
                this.setState({ recipes: loaded });
            });

        }, (err, arr) => {
            this.setState({ recipes: [] });
        });
    }


    /** Loads all the food that is currently in the refrigerator. */
    loadFood() {
        FoodRecipe.loadAllFood((arr) => {
            this.setState({ food: arr });
        }, (err, arr) => {
            this.setState({ food: [] });
        });
    }


    /** Handles submitting a recipe to the database. */
    handleSubmitRecipe() {
        if(this.state.recipeNameText !== '') {
            if(this.state.selectedFood.length > 0) {
                // Configure the ingredients
                var ings = [];
                for(var i = 0; i < this.state.selectedFood.length; i++) {
                    var a = {
                        foodId: this.state.selectedFood[i].key,
                        foodName: this.state.selectedFood[i].name,
                        quantity: this.state.selectedFood[i].quantity
                    };
                    ings.push(a);
                }
                
                // Now upload it.
                FoodRecipe.uploadRecipe(this.state.recipeNameText, ings, () => {
                    // Success.
                    this.setState({
                        recipeNameText: '',
                        selectedFood: [],
                        openUploadDialog: false
                    });
                }, (err) => {
                    // Failure
                });

            } else {
                Alert.alert('Missing Information', 'You must select some ingredients for this recipe',
                    [{text:'Close',onPress:()=>{},style:'cancel'}],
                    {cancelable:true}
                );
            }
        } else {
            Alert.alert('Missing Information', 'You must enter a name for the recipe',
                [{text:'Close',onPress:()=>{},style:'cancel'}],
                {cancelable:true}
            );
        }
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
                    Alert.alert('Options','',
                        [{text:'Check Make Recipe', onPress: () => {
                            FoodRecipe.canMakeRecipe(item.key, (result) => {
                                Alert.alert('Make This Recipe', result ? 'You can make this recipe!' : 'Sorry, you do not have the ingredients to make this recipe',
                                    [{text:'Ok', onPress: () => {}, style: 'cancel'}],
                                    {cancelable:true}
                                );
                            })
                        }},
                        {text:'Delete',onPress:() => {FoodRecipe.deleteRecipe(item.key);}},
                        {text:'Cancel',onPress:()=>{},style:'cancel'}],
                        {cancelable:true}
                    );
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


    /** The component for the food cell. */
    foodCellComponent = ({item}) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                    if(this.state.selectedFood.indexOf(item) < 0) {
                        this.setState({ 
                            selectedFood: this.state.selectedFood.concat([item])
                        });
                    } else {
                        this.state.selectedFood.splice(this.state.selectedFood.indexOf(item), 1);
                        this.forceUpdate();
                    }
                }} underlayColor='rgba(0,0,0,0)'>
                <View style={styles.foodCell}>
                    <Text style={styles.foodCellText}>{item.name}</Text>
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
    foodList: {
        height: 80,
        marginTop: 30,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgb(255, 251, 216)'
    },

    // Upload button view
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

    // Upload modal
    detailModal: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    uploadTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center'
    },
    input: {
        width: Dimensions.get('window').width - 20,
        height: 40,
        fontSize: 18,
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'center',
        marginTop: 20
    },
    button: {
        width: 150,
        height: 50,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(214, 182, 237)'
    },

    // Food cell
    foodCell: {
        height: 80,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(244, 233, 149)'
    },
    foodCellText: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        color: 'rgba(0,0,0,0.5)'
    }
});