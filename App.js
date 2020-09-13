import React, { Component } from 'react';
import { StyleSheet, View, Image, Header } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import SolutionScreen from './screens/SolutionScreen'
import CameraScreen from './screens/CameraScreen'

const RootStack = createStackNavigator({
	Home: {
		screen: SolutionScreen,
		navigationOptions: () => ({
			headerTintColor: 'white',
			headerTitle: '',
			headerStyle: {
				backgroundColor: '#353b48'
			},
			headerTitleStyle: {
				textAlign: "center",
				flex: 1,
				fontSize: 19
			},
			headerBackground: () =>
				<Image
					style={StyleSheet.absoluteFill}
					source={{ uri: 'https://res.cloudinary.com/dj7k0lade/image/upload/v1599942924/github/Group_13.png' }}
				/>
		})
	},
	Camera: {
		screen: CameraScreen,
		navigationOptions: () => ({
			headerShown: false
		})
	}
},
	{
		defaultNavigationOptions: {
			...TransitionPresets.SlideFromRightIOS,
		}
	},
);

const App = createAppContainer(RootStack);


export default App;