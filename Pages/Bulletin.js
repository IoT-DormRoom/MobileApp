import React from 'react';
import * as firebase from 'firebase';
import imagePicker from 'react-native-imagepicker';
import { Dimensions, StyleSheet, View, Text, Button, Image, FlatList, WebView,
        TouchableHighlight, Alert, Modal, TextInput, TouchableWithoutFeedback,
        Linking } from 'react-native';

import Page from './Page';

//STYLES
const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(188, 139, 75)',
    },
    title: {
        top:20,
        color:'black',
        opacity:0.45,
        fontSize:40,
        textAlign:'center',
        fontFamily:'Avenir',
        fontWeight:'bold'
    },


    // The list view
    list: {
        top: Dimensions.get('window').height / 12,
        marginBottom: Dimensions.get('window').height / 12
    },
    cell: {
        left: 25,
        height: 300,
        marginBottom: 20,
        width: Dimensions.get('screen').width - 50, 
        backgroundColor: 'white'
    },
    cellTitle: {
        fontSize: 22,
        color: 'black',
        fontFamily: 'Avenir',
        textAlign: 'center'
    },
    contentText: {
        width: '100%',
        height: '90%',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Avenir',
        backgroundColor: 'rgb(107, 187, 214)'
    },
    contentImage: {
        width: '100%',
        height: '90%',
        backgroundColor: 'rgb(107, 187, 214)'
    },
    contentLink: {
        width: '100%',
        height: '90%',
        backgroundColor: 'rgb(107, 187, 214)'
    },


    // The upload button
    uploadButtonView: {
        width: Dimensions.get('window').width - 20,
        top: Dimensions.get('window').height / 22,
        left: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(153, 96, 36)'
    },
    uploadButton: {
        fontSize: 35,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.35)',
    },


    // Upload modals
    messageUploadTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center',
        color: 'rgba(0,0,0,0.5)',
        top: Dimensions.get('screen').height / 20
    },
    textInput: {
        top: Dimensions.get('window').height / 14,
        width: Dimensions.get('window').width - 20,
        height: 300,
        fontSize: 18,
        fontFamily: 'Avenir',
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'lightgray'
    },
    submitButtonArea: {
        top: Dimensions.get('window').height / 10,
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightblue'
    },
    cancelButtonArea: {
        top: Dimensions.get('window').height / 8,
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    button: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Avenir'
    },
    uploadLabel: {
        top: Dimensions.get('window').height / 12,
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        fontFamily: 'Avenir'
    },
    orLinkLabel: {
        top: Dimensions.get('window').height / 8,
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        fontFamily: 'Avenir'
    },
    linkField: {
        top: Dimensions.get('window').height / 7,
        width: Dimensions.get('window').width - 20,
        fontSize: 18,
        fontFamily: 'Avenir',
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'center'
    },
    titleField: {
        top: Dimensions.get('window').height / 17,
        width: Dimensions.get('window').width - 20,
        fontSize: 18,
        fontFamily: 'Avenir',
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'center'
    },
    selectPhotoBtn: {
        top: Dimensions.get('window').height / 10,
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightcoral',
        marginBottom: 20
    },

    deleteButton: {
        width: 200,
        height: 50,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    detailModal: {
        top: '15%',
        left: '10%',
        width: '80%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    detailTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center',
        marginTop: 15,
        width: Dimensions.get('window').width
    },
    detailSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center',
        marginBottom: 10,
        width: Dimensions.get('window').width
    },
    detailContent: {
        width: Dimensions.get('screen').width
    }
});


/** Helper method for selecting the uri from the image picker. */
var selectedURI = null;
const selectURI = (uri) => {
    styles.selectPhotoBtn['backgroundColor'] = 'lightgreen';
    selectedURI = uri;
};


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

export default class Bulletin extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            posts: [],
            messageOpen: false,
            photoOpen: false,
            linkOpen: false,
            detailOpen: false,

            detail: null,
            
            titleText: '',
            inputText: '',
            linkText: ''
        }
    }

    componentDidMount() {
        this.loadBulletinPosts();
    }

    componentWillUnmount() {
        firebase.database().ref().child('Bulletin').off();
    }



    /********************
    *      RENDER       *
    *********************/

    render() {
        return (
            <View style={styles.pageStyles}>
                <Text style={styles.title}>Bulletin</Text>

                <TouchableHighlight onPress={this.openUploadDialog.bind(this)} 
                                    underlayColor="rgba(0,0,0,0)">
					<View style={styles.uploadButtonView}>
						<Text style={styles.uploadButton}>
							+
						</Text>
					</View>
				</TouchableHighlight>

                <FlatList ref={(FlatList) => {this._bulletinList = FlatList}}
                        style={styles.list}
                        data={this.state.posts} 
                        renderItem={this.bulletinCell}/>



                {/* Message Dialog. */}
                <Modal animationType={"slide"} transparent={false} visible={this.state.messageOpen} onRequestClose={() => {}}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        {/* The title of the modal. */}
                        <Text style={styles.messageUploadTitle}>Upload Message</Text>
                        
                        <TextInput ref={(TextInput)=> this._titleField = TextInput}
                            style={styles.titleField}
                            autoCorrect={false}
                            multiline={false}
                            onChangeText={(text) => this.setState({ titleText: text }) }
                            placeholder='Title' />

                        {/* The input field for typing the message. */}
                        <TextInput ref={(TextInput)=> this._messageInput = TextInput}
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={true}
                            onChangeText={(text) => this.setState({ inputText: text }) }
                            placeholder='Enter the message you want to send here' />

                        {this.submitCancelComponent}
                    </View>
                </Modal>

                {/* Photo/GIF Dialog. */}
                <Modal animationType={"slide"} transparent={false} visible={this.state.photoOpen} onRequestClose={() => {}}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        {/* The title of the modal. */}
                        <Text style={styles.messageUploadTitle}>Upload Photo/GIF</Text>

                        <TextInput ref={(TextInput)=> this._titleField = TextInput}
                            style={styles.titleField}
                            autoCorrect={false}
                            multiline={false}
                            onChangeText={(text) => this.setState({ titleText: text }) }
                            placeholder='Title' />

                        <Text style={ styles.uploadLabel }>
                            Upload from file:
                        </Text>
                        <TouchableHighlight onPress={this.openImagePicker} underlayColor="rgba(0,0,0,0)">
                            <View style={styles.selectPhotoBtn}>
                                <Text style={styles.button}>
                                    Choose Photo
                                </Text>
                            </View>
                        </TouchableHighlight>


                        <Text style={ styles.orLinkLabel }>
                            Or paste the link to the photo/gif below:
                        </Text>
                        <TextInput ref={(TextInput)=> this._photoLinkField = TextInput}
                            style={styles.linkField}
                            autoCorrect={false}
                            multiline={false}
                            onChangeText={(text) => this.setState({ linkText: text }) }
                            placeholder='URL' />
                        <Text>{'\n\n\n'}</Text>

                        {this.submitCancelComponent}
                    </View>
                </Modal>

                {/* Link Dialog. */}
                <Modal animationType={"slide"} transparent={false} visible={this.state.linkOpen} onRequestClose={() => {}}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        {/* The title of the modal. */}
                        <Text style={styles.messageUploadTitle}>Upload Link</Text>

                        <TextInput ref={(TextInput)=> this._titleField = TextInput}
                            style={styles.titleField}
                            autoCorrect={false}
                            multiline={false}
                            onChangeText={(text) => this.setState({ titleText: text }) }
                            placeholder='Title' />
                        
                        <Text style={ styles.orLinkLabel }>
                            Paste the link below:
                        </Text>
                        <TextInput ref={(TextInput)=> this._linkLinkField = TextInput}
                            style={styles.linkField}
                            autoCorrect={false}
                            multiline={false}
                            onChangeText={(text) => this.setState({ linkText: text }) }
                            placeholder='URL' />
                        <Text>{'\n\n\n'}</Text>

                        {this.submitCancelComponent}
                    </View>
                </Modal>


                {/* The detail view dialog. */}
                <Modal animationType={"fade"} transparent={false} visible={this.state.detailOpen} onRequestClose={() => {}}>
                    <View style={styles.detailModal}>
                        <Text style={styles.detailTitle}>{this.state.detail !== null ? this.state.detail.title : 'Title'}</Text>
                        <Text style={styles.detailSubtitle}>{this.state.detail !== null ? this.state.detail.uploader : 'Uploaded By'}</Text>
                        <Text style={styles.detailSubtitle}>{this.state.detail !== null ? this.state.detail.uploadDate : 'Upload Date'}</Text>

                        {this.state.detail !== null ? this.getDetailCellContent(this.state.detail) : <View></View>}

                        <TouchableHighlight onPress={() => this.deletePost(this.state.detail)} underlayColor="rgba(0,0,0,0)">
                            <View style={styles.deleteButton}>
                                <Text style={styles.button}>
                                    Delete
                                </Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.setState({ detailOpen: false }) } underlayColor="rgba(0,0,0,0)">
                            <View style={styles.deleteButton}>
                                <Text style={styles.button}>
                                    Close
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

    /** Opens the upload dialog. */
    openUploadDialog() {
        Alert.alert(
            'Upload Bulletin Post',
            'What kind of bulletin post are you making?',
            [
                {text: 'Message', onPress: () => this.setState({ messageOpen: true })},
                {text: 'Photo/GIF', onPress: () => this.setState({ photoOpen: true })},
                {text: 'Link', onPress: () => this.setState({ linkOpen: true })},
                {text: 'Cancel', onPress: () => {}, style: 'cancel'}
            ],
            { cancelable: true }
        );
    }

    /** Submits the bulletin post. */
    submitBulletinPost() {
        const store = this.props.rStore.getState();
        var title = this.state.titleText;

        var image = selectedURI;
        
        // Message
        if(this.state.messageOpen) {
            var message = this.state.inputText;
            
            if(message != '' && title != '') {

                // Set the data in firebase.
                var path = firebase.database().ref().child('Bulletin').push()
                path.set({
                    "uploader":store.currentUser.uid,
                    "content":message,
                    "type":"message",
                    "uploadDate":Date.now(),
                    "title":title,
                    "xCoord": this.randomCoordinate().x,
                    "yCoord": this.randomCoordinate().y,
                    "rotation": 0,
                    "id":path.key,
                    "read":false
                }).then( () => {
                    window.location.reload(true);
                });
            } else {
                Alert.alert('Missing Information', 'Please enter all information before submitting.',
                    [{text: 'Close', onPress: () => {}, style:'cancel'}]
                );
                return;
            }
        }
        // Photo
        else if(this.state.photoOpen) {
            var url = this.state.linkText;
            var image = selectedURI;

            var databasePath = firebase.database().ref().child('Bulletin').push();
            if(title != '') {
                if(image !== null) {
                    // Set the database path.
                    databasePath.set({
                        "uploader":store.currentUser.uid,
                        "content": image,
                        "type":"photo",
                        "uploadDate":Date.now(),
                        "title":title,
                        "xCoord": this.randomCoordinate().x,
                        "yCoord": this.randomCoordinate().y,
                        "rotation":0,
                        "id":databasePath.key,
                        "read":false
                    }).then( () => {
                        window.location.reload(true);
                    });
                    return;

                } else {
                    // Set the database path.
                    databasePath.set({
                        "uploader":store.currentUser.uid,
                        "content": url,
                        "type":"photo",
                        "uploadDate":Date.now(),
                        "title":title,
                        "xCoord": this.randomCoordinate().x,
                        "yCoord": this.randomCoordinate().y,
                        "rotation":0,
                        "id":databasePath.key,
                        "read":false
                    }).then( () => {
                        window.location.reload(true);
                    });
                    return;
                }
            }
            // Otherwise, show error alert.
            else {
                Alert.alert('Missing Information', 'Please enter all information before submitting.',
                    [{text: 'Close', onPress: () => {}, style:'cancel'}]
                );
                return;
            }
        }
        // Link
        else if(this.state.linkOpen) {
            var url = this.state.linkText;

            if(url != '' && title != '') {

                // Set the data in firebase.
                var path = firebase.database().ref().child('Bulletin').push()
                path.set({
                    "uploader":store.currentUser.uid,
                    "content":url,
                    "type":"link",
                    "uploadDate":Date.now(),
                    "title":title,
                    "xCoord": this.randomCoordinate().x,
                    "yCoord": this.randomCoordinate().y,
                    "rotation":0,
                    "id":path.key,
                    "read":false
                }).then( () => {
                    window.location.reload(true);
                });
            } else {
                Alert.alert('Missing Information', 'Please enter all information before submitting.',
                    [{text: 'Close', onPress: () => {}, style:'cancel'}]
                );
                return;
            }
        }

        this.setState({ messageOpen: false, photoOpen: false, linkOpen: false });
    }


    /** Shows the image picker. */
    openImagePicker() {
        imagePicker.open({
            takePhoto: false,
            useLastPhoto: false,
            chooseFromLibrary: true
        }).then( ({ uri, width, height }) => {
            
            Alert.alert('Image Select Success', 'Image has been selected successfully.',
                [{text:'Ok', onPress: () => {}, style:'cancel'}],
                { cancelable: true }
            );
            selectURI(uri);
            return;

        }, (error) => {
            Alert.alert('Image Select Error', 'There was an issue picking your image.',
                [{text: 'Close', onPress: () => {}, style:'cancel'}],
                { cancelable: true }
            );
            return;
        });
    }




    /********************
    *      METHODS      *
    *********************/

    /** Handles deleting a bulletin post. */
    deletePost(item) {
        Alert.alert('Delete Post', 'Are you sure you want to delete this bulletin post?',
            [{text: 'Yes', onPress: () => {
                firebase.database().ref().child('Bulletin').child(item.id).remove();
                this.setState({
                    detail: null,
                    detailOpen: false
                }, () => this.forceUpdate());
            }},
            {text: 'No', onPress: () => {}, style: 'cancel'}],
            { cancelable: true }
        );
    }


    /** Loads all of the bulletin board posts from the firebase database. */
    loadBulletinPosts() {
        firebase.database().ref().child('Bulletin').on('child_added', this.loadCallback);
    }
    

    /** The firebase load callback. */
    loadCallback = (snap) => {
        var finalObject = {
            key: snap.key,
            content: snap.val().content,
            title: snap.val().title,
            xPos: snap.val().xCoord,
            yPos: snap.val().yCoord,
            rotation: snap.val().rotation,
            uploader: snap.val().uploader,
            type: snap.val().type,
            id: snap.key,
            read: snap.val().read,
            uploadDate: snap.val().uploadDate
        };

        var newPosts = this.state.posts.concat([finalObject]);
        newPosts.sort( (a, b) => { return b.uploadDate - a.uploadDate } );
        
        this.setState({ posts: newPosts });
    }





    /********************
    *       OTHER       *
    *********************/

    /** What should be rendered in the list view cell for the bulletin page. */
    bulletinCell = ({item}) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.configureDetailView(item)}>
                <View style={styles.cell}>
                    {this.getBulletinCellContent(item)}
                    <Text style={styles.cellTitle}>{item.title.substring(0,25)}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    /** Bulletin cell content, whether it is text, and image, gif, etc. */
    getBulletinCellContent(item) {
        // Link
        if(item.type === 'link') {
            return <WebView source={{uri: item.content}}
                            style={styles.contentLink}
                            scrollEnabled={false}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={true} />
        }

        // Image
        else if(item.type === 'photo') {
            return <Image style={styles.contentImage}
                        source={{uri: item.content}} />
        }

        // Message
        else {
            return <Text style={styles.contentText}>{item.content.substring(0,80)}...</Text>
        }
    }


    /** Same as above, but for detail. */
    getDetailCellContent(item) {
        // Link
        if(item.type === 'link') {
            var finalStyle = {
                width: Dimensions.get('screen').width,
                marginBottom: 50,
                marginTop: 50,
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'lightgray'
            }
            return(
                <TouchableHighlight onPress={() => {
                        // Go to the website
                        if(Linking.canOpenURL(item.content)) {
                            Linking.openURL(item.content);
                        }
                    }} underlayColor='rgba(0,0,0,0)'>
                    <View style={finalStyle}>
                        <Text style={{textAlign:'center'}}>Click to go to: {'\n'}{item.content}</Text>
                    </View>
                </TouchableHighlight>
            );
        }

        // Image
        else if(item.type === 'photo') {
            return (
                <View style={styles.detailContent}>
                    <Image style={styles.contentImage}
                        source={{uri: item.content}} />
                </View>
            );
        }

        // Message
        else {
            return (
                <View style={styles.detailContent}>
                    <Text style={styles.contentText}>{item.content}</Text>
                </View>
            );
        }
    }


    /** Configures the detail view. */
    configureDetailView(item) {
        var timePostedAgo = new Date( item.uploadDate );
        var day = timePostedAgo.getDay();
        var dayString = dayNumberToString(day);
        var date = timePostedAgo.getDate();
        var month = timePostedAgo.getMonth();
        var monthString = monthNumberToString(month);
        var year = timePostedAgo.getFullYear();
        var hours = timePostedAgo.getHours() - 12;
        var minutes = "0" + timePostedAgo.getMinutes();
        var amOrPm = "";
        
        if(timePostedAgo.getHours() > 12) { amOrPm = "pm";} else { amOrPm = "am"; }
        var formattedTime = dayString + ', ' + monthString + ' ' + date + ', ' + year + ', ' + hours + ':' + minutes.substr(-2) + amOrPm;


        firebase.database().ref().child('Users').child(item.uploader).once('value', (snap) => {
            const a = snap.val().firstName;
            const b = snap.val().lastName;

            var copy = {
                key: item.key,
                content: item.content,
                title: item.title,
                xPos: item.xCoord,
                yPos: item.yCoord,
                rotation: item.rotation,
                uploader: a + ' ' + b,
                type: item.type,
                id: item.key,
                read: item.read,
                uploadDate: formattedTime
            }

            this.setState({ detail: copy, detailOpen: true });
        })
    }



    /** Returns a random coordinate to place a bulletin post. */
    randomCoordinate = () => {
        var maxX = 700;
        var maxY = 1000;

        var randX = Math.floor((Math.random() * maxX) + 1);
        var randY = Math.floor((Math.random() * maxY) + 1);

        return {x: randX, y: randY};
    }
    


    /** The components for the submit and cancel buttons. */
    submitCancelComponent = <View>
        <TouchableHighlight onPress={this.submitBulletinPost.bind(this)} underlayColor="rgba(0,0,0,0)">
            <View style={styles.submitButtonArea}>
                <Text style={styles.button}>
                    Submit
                </Text>
            </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.setState({ messageOpen: false, photoOpen: false, linkOpen: false })} underlayColor="rgba(0,0,0,0)">
            <View style={styles.cancelButtonArea}>
                <Text style={styles.button}>
                    Cancel
                </Text>
            </View>
        </TouchableHighlight>
    </View>
    
}