import React from 'react';
import imagePicker from 'react-native-image-picker';
import { Dimensions, StyleSheet, View, Text, Button, Image, FlatList, WebView,
        TouchableHighlight, Alert, Modal, TextInput, TouchableWithoutFeedback,
        Linking, Platform } from 'react-native';

import Page from './Page';
import FoodRecipe from '../FoodRecipe';




export default class Refrigerator extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            food: [],
            openAddFoodDialog: false,
            openDetailDialog: false,
            nameText: '',
            quantityText: '',
            categoryText: '',
            typeText: ''
        }
    }

    componentDidMount() {
        const currentUser = this.props.rStore.getState().currentUser;
        if(currentUser === null) {
            this.props.rStore.dispatch({type: 'LOGINPAGE'});
            return;
        }
        
        this.loadAllFood();
    }

    componentWillUnmount() {
        
    }



    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Refrigerator</Text>

                <TouchableHighlight onPress={this.openModal.bind(this)}
                                    underlayColor="rgba(0,0,0,0)">
					<View style={styles.uploadButtonView}>
						<Text style={styles.uploadButton}>
							+
						</Text>
					</View>
				</TouchableHighlight>

                <FlatList ref={(FlatList) => {this._foodList = FlatList}}
                        style={styles.list}
                        data={this.state.food}
                        renderItem={this.foodCell}
                        refreshing={false}
                        onRefresh={() => this.loadAllFood()}/>


                <Modal animationType={"fade"} transparent={false} visible={this.state.openAddFoodDialog} onRequestClose={() => {}}>
                    <View style={styles.detailModal}>
                        <Text style={styles.uploadTitle}>Add Food To Refrigerator</Text>

                        <TextInput ref={(TextInput)=> this._nameField = TextInput}
                            autoCorrect={false}
                            style={styles.input}
                            multiline={false}
                            onChangeText={(text) => this.setState({ nameText: text }) }
                            placeholder='Name of food' />
                        <TextInput ref={(TextInput)=> this._quantityField = TextInput}
                            autoCorrect={false}
                            style={styles.input}
                            multiline={false}
                            onChangeText={(text) => this.setState({ quantityText: text }) }
                            placeholder='Quantity' />
                        <TextInput ref={(TextInput)=> this._categoryField = TextInput}
                            autoCorrect={false}
                            style={styles.input}
                            multiline={false}
                            onChangeText={(text) => this.setState({ categoryText: text }) }
                            placeholder='Category (Optional)' />
                        <TextInput ref={(TextInput)=> this._typeField = TextInput}
                            autoCorrect={false}
                            style={styles.input}
                            multiline={false}
                            onChangeText={(text) => this.setState({ typeText: text }) }
                            placeholder='Type (Optional)' />

                        <TouchableHighlight onPress={this.handleSubmitFoodItem.bind(this)} underlayColor="rgba(0,0,0,0)">
                            <View style={styles.button}>
                                <Text style={{fontFamily:'Avenir',fontSize:20,textAlign:'center'}}>
                                    Submit
                                </Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => 
                                    this.setState({ 
                                        openAddFoodDialog: false,
                                        nameText: '',
                                        quantityText: '',
                                        categoryText: '',
                                        typeText: '',
                                        idText: ''
                                    }
                                )} underlayColor="rgba(0,0,0,0)">
                            <View style={styles.button}>
                                <Text style={{fontFamily:'Avenir',fontSize:20,textAlign:'center'}}>
                                    Cancel
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </Modal>
                
                <Modal animationType={"fade"} transparent={false} visible={this.state.openDetailDialog} onRequestClose={() => {}}>
                    <View style={styles.detailModal}>
                        <Text style={styles.uploadTitle}>Food: {this.state.nameText}</Text>

                        <TextInput
                            autoCorrect={false}
                            style={styles.input}
                            multiline={false}
                            onChangeText={(text) => this.setState({ nameText: text })}
                            value={this.state.nameText} />
                        <TextInput
                            autoCorrect={false}
                            style={styles.input}
                            multiline={false}
                            onChangeText={(text) => this.setState({ quantityText: text })}
                            value={this.state.quantityText} />
                        <TextInput
                            autoCorrect={false}
                            style={styles.input}
                            multiline={false}
                            onChangeText={(text) => this.setState({ categoryText: text })}
                            value={this.state.categoryText} />
                        <TextInput
                            autoCorrect={false}
                            style={styles.input}
                            multiline={false}
                            onChangeText={(text) => this.setState({ typeText: text })}
                            value={this.state.typeText} />

                        <TouchableHighlight onPress={this.updateFood.bind(this)} underlayColor="rgba(0,0,0,0)">
                            <View style={styles.button}>
                                <Text style={{fontFamily:'Avenir',fontSize:20,textAlign:'center'}}>
                                    Update
                                </Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.deleteFood.bind(this)} underlayColor="rgba(0,0,0,0)">
                            <View style={styles.button}>
                                <Text style={{fontFamily:'Avenir',fontSize:20,textAlign:'center'}}>
                                    Delete
                                </Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => 
                                    this.setState({ 
                                        openDetailDialog: false,
                                        nameText: '',
                                        quantityText: '',
                                        categoryText: '',
                                        typeText: '',
                                        idText: ''
                                    }
                                )} underlayColor="rgba(0,0,0,0)">
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
    *       UPLOAD      *
    *********************/

    /** Opens the modal for uploading something to the refrigerator. */
    openModal() {
        this.setState({ openAddFoodDialog: true });
    }


    /** Handles uploading the food item. */
    handleSubmitFoodItem() {
        if(this.state.nameText === '' || this.state.quantityText === '') {
            Alert.alert('Error', 'Missing information',
                [{text:'Close',onPress:()=>{},style:'cancel'}],
                {cancelable:true}
            );
            return;
        }
        const intQuant = parseInt(this.state.quantityText);

        // Create the object and save to the database.
        var obj = {
            name: this.state.nameText,
            quantity: intQuant
        }
        if(this.state.categoryText !== '') { obj['category'] = this.state.categoryText; }
        if(this.state.typeText !== '') { obj['type'] = this.state.typeText; }

        FoodRecipe.uploadFoodItem(obj);
        this.setState({ openAddFoodDialog: false });
    }




    /********************
    *      METHODS      *
    *********************/

    /** Calls the method from the food items from the database. */
    loadAllFood() {
        FoodRecipe.loadAllFood( (arr) => {
            this.setState({ food: [] }, () => {
                var loaded = this.state.food.concat(arr);
                loaded.sort( (a, b) => { return b.quantity - a.quantity });
                
                this.setState({ food: loaded });
            });
        }, (err, arr) => {
            this.setState({ food: [] });
        });
    }
   

    /** Updates a food item in the database. */
    updateFood() {
        var quant = parseInt(this.state.quantityText.trim());

        FoodRecipe.updateFood(this.state.idText, {
            name: this.state.nameText,
            quantity: quant,
            category: this.state.categoryText,
            type: this.state.typeText
        });

        FoodRecipe.loadAllRecipes((arr) => {
            for(var i = 0; i < arr.length; i++) {
                for(var j = 0; j < arr[i].ingredients.length; j++) {
                    if(arr[i].ingredients[j].foodId === this.state.idText) {
                        arr[i].ingredients[j] = {
                            foodId: arr[i].ingredients[j].foodId,
                            foodName: arr[i].ingredients[j].foodName,
                            quantity: quant
                        };
                        FoodRecipe.updateRecipe(arr[i].key, arr[i].ingredients);
                    }
                }
            }

            this.setState({
                nameText: '',
                quantityText: '',
                categoryText: '',
                typeText: '',
                idText: ''
            });
        }, (err) => {});

        this.setState({ openDetailDialog: false });
    }


    /** Handles deleting a food item from the database. */
    deleteFood() {
        Alert.alert('Delete', 'Are you sure you want to delete this ' + this.state.nameText + ' from the refrigerator?',
            [{text:'Yes', onPress: () => { 
                FoodRecipe.deleteFood(this.state.idText);
                this.setState({
                    openDetailDialog: false,
                    nameText: '',
                    quantityText: '',
                    categoryText: '',
                    typeText: '',
                    idText: ''
                });
             }},
            {text: 'No', onPress: () => {}, style:'cancel'}],
            {cancelable:true}
        );
    }






    /********************
    *       OTHER       *
    *********************/

    /** What should be rendered in the list view cell for the refrigerator page. */
    foodCell = ({item}) => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                    this.setState({ 
                        openDetailDialog: true,
                        nameText: item.name,
                        quantityText: ''+item.quantity,
                        categoryText: item.category,
                        typeText: item.type,
                        idText: item.key
                    });
                }}>
                <View style={styles.cell}>
                    <Text style={styles.cellText}>Name: {item.name}</Text>
                    <Text style={styles.cellText}>Quantity: {item.quantity}</Text>
                    <Text style={styles.cellText}>Category: {item.category}</Text>
                    <Text style={styles.cellText}>Type: {item.type}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
    
}


//STYLES
const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(214, 182, 237)',
    },
    title: {
        top:20,
        color:'black',
        opacity:0.45,
        fontSize:40,
        textAlign:'center',
        fontWeight:'bold'
    },


    // The list view
    list: {
        marginTop: 10,
        marginBottom: 10
    },
    cell: {
        left: 25,
        height: 120,
        marginBottom: 20,
        width: Dimensions.get('screen').width - 50, 
        backgroundColor: 'white'
    },

    // The upload button
    uploadButtonView: {
        width: Dimensions.get('window').width - 20,
        marginTop: 35,
        left: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(188, 149, 219)'
    },
    uploadButton: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.35)',
    },

    // Cell
    cellText: {
        fontSize: 20,
        color: 'rgb(188, 149, 219)',
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center'
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
    }
});