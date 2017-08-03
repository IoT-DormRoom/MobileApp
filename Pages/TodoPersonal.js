import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, FlatList, TextInput, 
        TouchableHighlight, Alert } from 'react-native';

import Page from './Page';

const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(234, 211, 119)'
    },
    title: {
        top:20,
        color:'black',
        opacity:0.35,
        fontSize:40,
        textAlign:'center',
        fontWeight:'bold'
    },
    listView: {
        
    },

    textInput: {
        top: 30,
        backgroundColor: 'white',
        height: 50,
        fontSize: 18,
        width: Dimensions.get('window').width
    },
    addButtonArea: {
        marginTop: Dimensions.get('window').height / 22,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    addButton: {
        color: 'rgba(0,0,0,0.4)',
        fontSize: 20,
        fontWeight: 'bold',
    },

    cell: {
        width: Dimensions.get('window').width,
        height: 80,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    cellTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

export default class TodoPersonal extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            todos: [],
            newTodoText: ''
        };
    }

    componentDidMount() {
        const currentUser = this.props.rStore.getState().currentUser;
        if(currentUser === null) {
            this.props.rStore.dispatch({
                type: 'CHANGE_PAGE',
                index: 7
            });
            return;
        }

        this.loadPersonalTodos();
    }

    componentWillUnmount() {
        firebase.database().ref().child('TodoPersonal').off();
    }




    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>To-Do Personal</Text>

                {/* Area for adding todos */}
                <TextInput ref={(TextInput)=> this._todoInput = TextInput}
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={true}
                            onChangeText={(text) => this.setState({ newTodoText: text }) }
                            placeholder='Enter a new to-do' />
                <TouchableHighlight onPress={this.addTodo.bind(this)} underlayColor="rgba(0,0,0,0)">
					<View style={styles.addButtonArea}>
						<Text style={styles.addButton}>
							Add To-Do
						</Text>
					</View>
				</TouchableHighlight>

                <FlatList style={styles.listView}
                        data={this.state.todos}
                        renderItem={this.todoCell} />
            </View>
        );
    }

    /********************
    *      METHODS      *
    *********************/

    /** Adds a new todo to the database. */
    addTodo() {
        const store = this.props.rStore.getState();

        if(store.currentUser !== null) {
            if(this.state.newTodoText != '') {
                // Save to firebase
                var ref = firebase.database().ref().child('TodoPersonal').push();

                ref.set({
                    'id':ref.key,
                    'content':this.state.newTodoText,
                    'uploader': 'fdafsdfdafh',
                    'timestamp':Date.now(),
                });

                this._todoInput.clear();
            }
        }
    }


    /** Handles completing (and removing) a todo. */
    completeTodo(item) {
        Alert.alert('Complete', 'Are you ready to complete the todo: ' + item.title,
            [{text: 'Yes', onPress: () => this.handleComplete(item)},
            {text: 'No', onPress: () => {}, style: 'cancel'}],
            { cancelable: true }
        );
    }

    /** Handles the real completion process. */
    handleComplete(item) {
        const currentUser = this.props.rStore.getState().currentUser;
        if(currentUser === null) { return; }

        firebase.database().ref().child('TodoPersonal').orderByChild('uploader').equalTo(currentUser.uid).child(item.id).remove();
        this.setState({ todos: newTodos }, () => this.forceUpdate());
    }


    /** Loads all the personal todos. */
    loadPersonalTodos() {
        firebase.database().ref().child('TodoPersonal').on('child_added', this.loadCallback);
    }


    /** The callback for firebase. */
    loadCallback = (snap) => {
        var todo = snap.val();

        // Create the cell
        var finalObject = {
            key: todo.id,
            title: todo.content,
            id: todo.id,
            timestamp: todo.timestamp,
            uploader: todo.uploader
        };

        var newTodos = this.state.todos.concat([finalObject]);
        newTodos.sort( (a,b) => { return b.timestamp - a.timestamp });
        this.setState({ todos: newTodos });
    }




    /********************
    *       OTHER       *
    *********************/

    todoCell = ({item}) => {
        return (
            <TouchableHighlight onPress={() => {
                    this.completeTodo(item)
                }} underlayColor="rgba(0,0,0,0)">
                <View style={styles.cell}>
                    <Text style={styles.cellTitle}>{item.title}</Text>
                </View>
            </TouchableHighlight>
        );
    }

}