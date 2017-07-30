import React from 'react';
import * as firebase from 'firebase';
import { Dimensions, StyleSheet, View, Text, Button, Image, FlatList, WebView } from 'react-native';

import Page from './Page';

const styles = StyleSheet.create({
    pageStyles: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgb(188, 139, 75)'
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

    list: {
        top: Dimensions.get('window').height / 24,
        marginBottom: Dimensions.get('window').height / 24
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
    }
});

export default class Bulletin extends Page {

    /********************
    *   INITIALIZATION  *
    *********************/

    constructor() {
        super();
        this.state = {
            posts: []
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

                <FlatList style={styles.list}
                        data={this.state.posts} 
                        renderItem={this.bulletinCell}/>
            </View>
        );
    }


    /********************
    *      METHODS      *
    *********************/

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







    /** What should be rendered in the list view cell for the bulletin page. */
    bulletinCell = ({item}) => {
        return (
            <View style={styles.cell}>
                {this.getBulletinCellContent(item)}
                <Text style={styles.cellTitle}>{item.title.substring(0,25)}</Text>
            </View>
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
    
}