import React from 'react';
import { Dimensions, StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';
import Drawer from 'react-native-drawer'
import { createStore } from 'redux';

import Sidebar from './Sidebar';

import Bulletin from './Pages/Bulletin';
import Messaging from './Pages/Messaging';
import TodoShared from './Pages/TodoShared';
import TodoPersonal from './Pages/TodoPersonal';
import Lights from './Pages/Lights';
import Account from './Pages/Account';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';

/**
 * FIREBASE
 */
// FIREBASE
import * as firebase from 'firebase';
var config = {
    apiKey: "AIzaSyDK7Vc9FQHA8en946cabzxues36IpYeyYk",
    authDomain: "iot-dormroom-9558c.firebaseapp.com",
    databaseURL: "https://iot-dormroom-9558c.firebaseio.com",
    projectId: "iot-dormroom-9558c",
    storageBucket: "iot-dormroom-9558c.appspot.com"
};
firebase.initializeApp(config);


/**
 * REDUX
 */
const defaultState = {
	currentPage: <Bulletin />,
	pages: [<Bulletin />, <Messaging />, <TodoPersonal/>, <TodoShared/>, <Lights/>, <Account/> ],
	drawerOpen: false
}
const sidebar = (state = defaultState, action) => {
    switch (action.type) {
        case 'CHANGE_PAGE':
			state.currentPage = state.pages[action.index];
			state.drawerOpen = false;
			break;
		case 'OPEN_SIDEBAR':
			state.drawerOpen = true;
			break;
		case 'CLOSE_SIDEBAR':
			state.drawerOpen = false;
			break;

        default: break;
    }

    return state;
};
const store = createStore(sidebar);


/**
 * NAVIGATION DRAWER
 */
const drawerStyles = {
	drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
	main: {paddingLeft: 3},
}
const openDrawerButtonStyles = {
	main: {
		width: 50,
		height: 50,
		alignItems: 'center',
	},
	text: {
		top: Dimensions.get('window').height / 22,
		left: 5,
		color: 'rgba(0, 0, 0, 0.35)',
		fontSize: 20,
		fontWeight: 'bold'
	}
}
const drawerProps = ({
	custom: {
		open: store.getState().drawerOpen,
		type: 'overlay',
  		content: <Sidebar rStore={store} />,
  		tapToClose: true,
  		openDrawerOffset: 0,
  		panCloseMask: 0.2,
  		closedDrawerOffset: 0,
  		styles: drawerStyles,
  		tweenHandler: (ratio) => ({
    		main: { opacity:(2-ratio)/2 }
  		})
	}
});

export default class App extends React.Component {

	/********************
    *   INITIALIZATION  *
    *********************/

	componentDidMount() {
		store.subscribe(() => this.forceUpdate() );
	}



    /********************
    *      RENDER       *
	*********************/
	  
	render () {
		return (
			<Drawer ref={(ref) => this._drawer = ref} {...drawerProps.custom}>
				{store.getState().currentPage}

				<TouchableHighlight onPress={this.openControlPanel} underlayColor="rgba(0,0,0,0)">
					<View style={openDrawerButtonStyles.main}>
						<Text style={openDrawerButtonStyles.text}>
							|||
						</Text>
					</View>
				</TouchableHighlight>
			</Drawer>
    	);
	  }
	



	/********************
    *      METHODS      *
	*********************/
	
	closeControlPanel = () => {
		this._drawer.close()
  	};
  
	openControlPanel = () => {
    	this._drawer.open()
	};

}