import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import SolutionScreen from './screens/SolutionScreen'
import CameraScreen from './screens/CameraScreen'
import logoBg from './assets/logo-bg.png';

const RootStack = createStackNavigator({
	Home: {
		screen: SolutionScreen,
		navigationOptions: () => ({
			headerTitle: '',
			headerBackground: () =>
				<Image
					style={styles.logoBg}
					source={logoBg}
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

const styles = StyleSheet.create({
	logoBg: {
		width: '100%',
		height: '100%'
	}
});

const App = createAppContainer(RootStack);

export default App;
