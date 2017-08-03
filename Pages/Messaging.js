import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, Button, FlatList, TextInput,
        TouchableHighlight } from 'react-native';

import Page from './Page';

const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(51, 153, 221)'
    },
    title: {
        top:20,
        color:'black',
        opacity:0.45,
        fontSize:40,
        textAlign:'center',
        fontWeight:'bold'
    },

    textInput: {
        top: 30,
        backgroundColor: 'white',
        height: 100,
        fontSize: 18,
        width: Dimensions.get('window').width
    },
    sendButtonArea: {
        width: 100,
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(30, 125, 188)',
        borderRadius: 20,
        marginTop: 50
    },
    sendButton: {
        fontSize: 22,
        color: 'rgb(9, 84, 61)',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    listView: {
        top: Dimensions.get('window').height / 24,
        marginBottom: Dimensions.get('window').height / 24
    },
    listCell: {
        width: Dimensions.get('window').width,
        margin: 'auto',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellSenderName: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        paddingTop: 10
    },
    cellTime: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    cellContent: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 10
    }
});


// DATE FUNCTIONS.
function dayNumberToString(a) {
    switch(a) {
        case 0: return 'Sunday'
        case 1: return 'Monday'
        case 2: return 'Tuesday'
        case 3: return 'Wednesday'
        case 4: return 'Thursday'
        case 5: return 'Friday'
        case 6: return 'Saturday'
        default: return 'Monday'
    }
}
function monthNumberToString(a) {
    switch(a) {
        case 0: return 'January'
        case 1: return 'February'
        case 2: return 'March'
        case 3: return 'April'
        case 4: return 'May'
        case 5: return 'June'
        case 6: return 'July'
        case 7: return 'August'
        case 8: return 'September'
        case 9: return 'October'
        case 10: return 'November'
        case 11: return 'December'
        default: return 'January'
    }
}




export default class Messaging extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            messages: [],
            inputText: ''
        }
    }

    componentDidMount() {
        this.loadMessages();
    }

    componentWillUnmount() {
        firebase.database().ref().child('Messaging').off();
    }



    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Messaging</Text>

                {/* Area for sending messages */}
                <TextInput ref={(TextInput)=> this._messageInput = TextInput}
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={true}
                            onChangeText={(text) => this.setState({ inputText: text }) }
                            placeholder='Enter the message you want to send here' />
                <TouchableHighlight onPress={this.sendMessage.bind(this)} 
                                    underlayColor="rgba(0,0,0,0)">
					<View style={styles.sendButtonArea}>
						<Text style={styles.sendButton}>
							Send
						</Text>
					</View>
				</TouchableHighlight>

                <FlatList style={styles.listView}
                        data={this.state.messages} 
                        renderItem={this.messageCell}/>
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

    /** Handles sending a message through the database. */
    sendMessage() {
        const store = this.props.rStore.getState();
        const cUser = store.currentUser;
        if(cUser === null || cUser === undefined) { return; }

        // // Get the message from the input field.
        var message = this.state.inputText;
        if(message !== "") {
            // Save to the database.
            const ref = firebase.database().ref().child('Messaging').push();
            ref.set({
                "id":ref.key,
                "content":message,
                "timestamp":Date.now(),
                "senderName":cUser.firstName + " " + cUser.lastName
            });

            // Clear the input field.
            this.setState({
                inputText: ''
            }, () => {
                this._messageInput.clear();
            });
        }
    }


    /** Loads all the messages from the database. */
    loadMessages() {
        const ref = firebase.database().ref()
        ref.child('Messaging').orderByChild('timestamp').on('child_added', this.loadCallback);
    }


    /** Firebase load callback */
    loadCallback = (snap) => {
        var singleMsg = snap.val();
        var timePostedAgo = new Date( singleMsg.timestamp );

        var day = timePostedAgo.getDay();
        var dayString = dayNumberToString(day);
        var date = timePostedAgo.getDate();
        var month = timePostedAgo.getMonth();
        var monthString = monthNumberToString(month);
        var year = timePostedAgo.getFullYear();
        var hours = timePostedAgo.getHours() - 12;
        var minutes = "0" + timePostedAgo.getMinutes();
        var amOrPm = "";
        
        if(timePostedAgo.getHours() > 12) {
            amOrPm = "pm";
        } else {
            amOrPm = "am";
        }
        var formattedTime = dayString + ', ' + monthString + ' ' + date + ', ' + year + ', ' + hours + ':' + minutes.substr(-2) + amOrPm;
        
        var finalObject = {
            key: singleMsg.id,
            senderName: singleMsg.senderName,
            timestamp: singleMsg.timestamp,
            formattedDate: formattedTime,
            content: singleMsg.content
        }
        
        // Configure the state so that is has the newest data.
        var newMessages = this.state.messages.concat([finalObject]);
        newMessages.sort( (a, b) => { return b.timestamp - a.timestamp });
        
        this.setState({ 
            messages: newMessages
        });
    }





    /** What should be rendered in the list view cell for the messages page. */
    messageCell = ({item}) => {
        return (
            <View style={styles.listCell}>
                <Text style={styles.cellSenderName}>{item.senderName}</Text>
                <Text style={styles.cellTime}>{item.formattedDate}</Text>
                <Text style={styles.cellContent}>{item.content}</Text>
            </View>
        )
    }

}