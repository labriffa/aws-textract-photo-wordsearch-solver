import React, { Component } from 'react';
import { StyleSheet, View, Image, Header } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import HomeScreen from './screens/HomeScreen'
import CameraScreen from './screens/CameraScreen'

const RootStack = createStackNavigator({
	Home: {
		screen: HomeScreen,
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
			headerBackground: (
				<Image
					style={StyleSheet.absoluteFill}
					source={{ uri: 'https://res.cloudinary.com/dj7k0lade/image/upload/v1599773321/github/wordsearch-photo-solver-logo-bg.png' }}
				/>
			)
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