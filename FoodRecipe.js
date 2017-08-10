/* AJAX */
var superagent = require('superagent');
import { Alert } from 'react-native';


// FOOD

/** Handles uploading a food item to the databaase with an ajax call. 
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
module.exports.loadAllFood = function(success, failure = (err, arr) => {}) {
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
module.exports.loadFood = function(id, success, failure) {
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
module.exports.updateFood = function(id, quantity) {
    superagent.post('https://dorm-service-server.herokuapp.com/food/' + id)
    .send({
        "quantity": quantity
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

