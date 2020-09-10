import React, { Component } from 'react';
import { StyleSheet, View, Button, TouchableWithoutFeedback, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { BlurView } from 'expo-blur';


// 
import HomeScreen from './HomeScreen'
import CameraScreen from './CameraScreen'

const RootStack = createStackNavigator({
	Home: {
		screen: HomeScreen,
		navigationOptions: ({ navigation }) => ({
			headerTintColor: 'white',
			headerTitle: 'Word Search Solver',
			headerStyle: {
				backgroundColor: '#353b48'
			},
			headerTitleStyle: {
				textAlign: "center",
				flex: 1,
				fontSize: 19
			}
		})
	},
	Camera: {
		screen: CameraScreen,
		navigationOptions: ({ navigation }) => ({
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

const styles = StyleSheet.create({
	text: {
		backgroundColor: '#e84118',
		textAlign: 'center',
		borderRadius: 5,
		paddingTop: 5,
		paddingBottom: 5,
		color: 'white',
		borderWidth: 2,
		borderColor: '#e84118',
		fontSize: 16,
		width: 100,
		marginRight: 15
	}
});


const App = createAppContainer(RootStack);


export default App;