/* AJAX */
var superagent = require('superagent');
import { Alert } from 'react-native';


// FOOD

/** Handles uploading a food item to the database with an ajax call. 
*   @param {String} name The name of the food item.
*   @param {Number} quantity The quantity of the food item.
*   @param {String} category The category this item belongs to.
*   @param {String} type The type of item this is.
*/
module.exports.uploadFoodItem = function({ name = '', quantity = 0, category, type }) {
    
    // Check for missing info.
    if(name === '' || quantity === '') { 
        Alert.alert('Post Error', 'Missing credentials. Make sure to enter all required information.',
            [{text:'Cancel',onPress: () => {}, style: 'cancel'}],
            {cancelable:true}
        );
        return;
    }

    // Post with superagent (ajax).
    superagent.post('https://dorm-service-server.herokuapp.com/food')
    .send({
        "name": name,
        "quantity": quantity,
        "category": category,
        "type": type
    })
    .set('Accept', 'application/json')
    .set('contentType', 'application/json')
    .set('dataType', 'json')
    .end((err, resp) => {
        if(err) {
            Alert.alert('Upload', err,
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
            return;
        } else {
            Alert.alert('Upload', 'Upload Successful!',
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
            return;
        }
    });
}



/** Handles loading all of the food that is currently in the refrigerator.
*   @param {function} success The callback for when the food has been loaded.
*   It returns an array of food objects which will never be null, but may be empty.
*   @param {function} failure In the event that there is an error in loading the data,
*   this failure block will be called and will return an empty array of data.
*/
module.exports.loadAllFood = function(success, failure) {
    var arr = [];

    superagent.get('https://dorm-service-server.herokuapp.com/food', (err, resp) => {
        if(err) { 
            failure(err, arr);
            return;
        }

        // Load all food.
        var json = JSON.parse(resp.text);
        
        // Loop through the json.
        for(var food in json) {
            if(json.hasOwnProperty(food)) {
                // Create an object from the parsed json.
                var obj = {
                    key: food,
                    name: json[food].name,
                    quantity: json[food].quantity,
                    category: json[food].category || 'none',
                    type: json[food].type || 'none'
                };

                arr.push(obj);
            }
        } // End of for-loop.
        
        // Run the success block.
        success(arr);
    })
}



/** Handles loading a single food item from the database.
*   @param {String} id The id of the food item you are looking for.
*   @param {Function} success The block to run when the food is successfully loaded.
*   @param {Function} failure The block to run when the food fails to load or if there is no
*   food item with the given id.
*/
module.exports.loadSingleFood = function(id, success, failure) {
    superagent.get('https://dorm-service-server.herokuapp.com/food/' + id, (err, resp) => {
        if(err) { 
            failure(err);
            return;
        }

        // Load the food item.
        var json = JSON.parse(resp.text);
        var obj = {
            id: id,
            name: json.name,
            quantity: json.quantity,
            category: json.category || 'none',
            type: json.type || 'none'
        }
        success(obj);
    });
}



/** Handles updating a single food item in the database.
*   @param {String} id The id of the food item you are looking for.
*   @param {Number} quantity The quantity of the food item.
*/
module.exports.updateFood = function(id, { name = '', quantity = 0, category, type }) {
    superagent.put('https://dorm-service-server.herokuapp.com/food/' + id)
    .send({
        "name":name,
        "quantity": quantity,
        "category":category,
        "type":type
    })
    .set('Accept', 'application/json')
    .set('contentType', 'application/json')
    .set('dataType', 'json')
    .end((err, resp) => {
        if(err) {
            Alert.alert('Update', err,
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
        } else {
            Alert.alert('Update', 'Update Successful!',
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
        }
    });
}



/** Deletes a food item from the database.
*   @param {String} id The id of the food item you are looking for.
*/
module.exports.deleteFood = function(id) {
    superagent.delete('https://dorm-service-server.herokuapp.com/food/' + id)
    .set('Accept', 'application/json')
    .set('contentType', 'application/json')
    .set('dataType', 'json')
    .end((err, resp) => {
        if(err) {
            Alert.alert('Delete', err,
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
        } else {
            Alert.alert('Delete', 'Delete Successful!',
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
        }
    });
}





// RECIPES

/** Loads all the recipes from the database. These are the recipes that can be 
* made with the food that is currently in the refrigerator.
* @param {Function} success The block to run when the data is successfully loaded.
* returns an array of objects.
* @param {Function} failure The block to run when there is an error loading the data.
* Returns an empty array of data.
*/
module.exports.loadAllRecipes = function(success, failure) {
    var arr = [];

    superagent.get('https://dorm-service-server.herokuapp.com/recipe', (err, resp) => {
        if(err) {
            failure(err, arr);
            return;
        }

        // Load all recipes.
        var json = JSON.parse(resp.text);
        
        // Loop through the json.
        for(var id in json) {
            if(json.hasOwnProperty(id)) {
                // Create an object from the parsed json.
                // Get all the ingredients.
                var ingredients = json[id].ingredients;
                var modelIngredients = [];
                for(var ingID in ingredients) {
                    var obj = {
                        key: ingID,
                        foodName: ingredients[ingID].foodName,
                        foodId: ingredients[ingID].foodId,
                        quantity: ingredients[ingID].quantity
                    }
                    modelIngredients.push(obj);
                }

                var model = {
                    key: id,
                    name: json[id].name,
                    ingredients: modelIngredients
                };

                arr.push(model);
            }
        } // End of for-loop.

        success(arr);
    });
}



/** Loads a single recipe from the database.
*   @param {String} id The id of the recipe to look for.
*   @param {Function} success The success block, which returns the loaded object.
*   @param {Function} failure The block to run when the object fails to load.
*/
module.exports.loadSingleRecipe = function(id, success, failure) {
    superagent.get('https://dorm-service-server.herokuapp.com/recipe/' + id, (err, resp) => {
        if(err) { 
            failure(err);
            return;
        }

        // Load the food item.
        var json = JSON.parse(resp.text);
        var ingredients = json[id].ingredients;
        var modelIngredients = [];
        for(var ingID in ingredients) {
            var obj = {
                key: ingID,
                foodName: ingredients[ingID].foodName,
                foodId: ingredients[ingID].foodId,
                quantity: ingredients[ingID].quantity
            }
            modelIngredients.push(obj);
        }
        var model = {
            id: id,
            name: json.name,
            ingredients: modelIngredients
        }
        success(model);
    });
}



/** Uploads a recipe to the database.
*   @param {String} name The name of the recipe.
*   @param {Array} ingredients An array of objects representing the ingredients of this recipe.
*   @param {Function} success The block to run when the recipe is successfully uploaded.
*   @param {Function} failure A callback for when there is an error creating the recipe.
*/
module.exports.uploadRecipe = function(name = '', ingredients = [], success, failure) {
    if(name === '') { failure('Invalid name for recipe.'); return; }

    superagent.post('https://dorm-service-server.herokuapp.com/recipe/')
    .send({
        "name": name,
        "ingredients": ingredients
    })
    .set('Accept', 'application/json')
    .set('contentType', 'application/json')
    .set('dataType', 'json')
    .end((err, resp) => {
        console.log(resp);
        console.log(err);
        if(err) {
            Alert.alert('Upload', err,
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
            failure('Error uploading recipe.');
            return;
        } else {
            Alert.alert('Upload', 'Upload Successful!',
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
            success();
        }
    });
}




/** Updates a recipe in the database. 
*   @param {String} id The id of the recipe to be updated.
*   @param {Number} newIngredients The new ingredients.
*/
module.exports.updateRecipe = function(id, newIngredients) {
    superagent.put('https://dorm-service-server.herokuapp.com/recipe/' + id)
    .send({
        "ingredients": newIngredients
    })
    .set('Accept', 'application/json')
    .set('contentType', 'application/json')
    .set('dataType', 'json')
    .end((err, resp) => {
        if(err) {
            Alert.alert('Update', err,
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
        } else {
            Alert.alert('Update', 'Update Successful!',
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
        }
    });
}




/** Deletes a recipe from the database. 
*   @param {String} id The id of the recipe to be removed.
*/
module.exports.deleteRecipe = function(id) {
    superagent.delete('https://dorm-service-server.herokuapp.com/recipe/' + id)
    .set('Accept', 'application/json')
    .set('contentType', 'application/json')
    .set('dataType', 'json')
    .end((err, resp) => {
        if(err) {
            Alert.alert('Delete', err,
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
        } else {
            Alert.alert('Delete', 'Delete Successful!',
                [{text:'Ok',onPress: () => {}, style: 'cancel'}],
                {cancelable:true}
            );
        }
    });
}




/** Returns whether or not you can make a certain recipe given the ingredients in the
* refrigerator.
*   @param {String} id The id of the recipe
*   @param {Function} completion The callback for when you can/cannot make the recipe
*/
module.exports.canMakeRecipe = function(id, completion) {
    superagent.get('https://dorm-service-server.herokuapp.com/recipe/' + id + "/canMake", (err, resp) => {
        if(err) {
            completion(false);
            return;
        }

        const result = JSON.parse(resp.text);
        if(result['status'] === false) { completion(false); }
        else { completion(true); }
    });
}