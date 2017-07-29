import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Drawer from 'react-native-drawer'
import { createStore } from 'redux';

import Sidebar from './Sidebar';
import Bulletin from './Pages/Bulletin';
import Messaging from './Pages/Messaging';


// Setup the redux store.
const defaultState = {
	currentPage: <Bulletin />,
	pages: [<Bulletin />, <Messaging />],
	drawerOpen: false
}
const sidebar = (state = defaultState, action) => {
    switch (action.type) {
        case 'CHANGE_PAGE':
			state.currentPage = state.pages[action.index];
			state.drawerOpen = false;
			break;

        default: break;
    }

    return state;
};
const store = createStore(sidebar);


// The Drawer styles
const drawerStyles = {
	drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
	main: {paddingLeft: 3},
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
		store.subscribe(() => this.forceUpdate());
	}



    /********************
    *      RENDER       *
	*********************/
	  
	render () {
		return (
			<Drawer ref={(ref) => this._drawer = ref} {...drawerProps.custom}>
				<Button title='|||' 
						color='white'
						style={{top:50}}
						onPress={this.openControlPanel} />
				{store.getState().currentPage}
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