import React from 'react';
import { StyleSheet, View, Button, TouchableWithoutFeedback, Text } from 'react-native';
import { WordsearchSolver } from './wordSearchSolver.js';
import { WordsearchSolutionDrawer } from './wordSearchSolutionDrawer.js';
let awsTextractResponse = require('./tests/mock-textract-response.json');
import { Dimensions } from 'react-native';
import Canvas from 'react-native-canvas';
import { SafeAreaView } from 'react-navigation'
import { StatusBar } from 'expo-status-bar';
import Spinner from 'react-native-loading-spinner-overlay';
import getEnvVars from './environment';
const { apiUrl } = getEnvVars();

export default class HomeScreen extends React.Component {
	constructor() {
		super();
		this.canvas = null;
	}

	state = {
		uri: '',
		spinner: false
	}

	componentWillReceiveProps() {
		this.setState({ spinner: true });
		let uriParam = this.props.navigation.getParam('uri');
		if (uriParam) {
			this.setState({ uri: uriParam }, () => {
				fetch(TEXTRACT_API_URL, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					mode: 'no-cors',
					method: 'POST',
					body: JSON.stringify({
						base64: uriParam
					})
				}).then(response => response.json())
					.then(json => {
						console.log(json.Blocks);
						awsTextractResponse = json;
						this.handleCanvas();
						this.setState({ spinner: false });
					});
			});
		}
	}

	handleCanvas = () => {
		this.forceUpdate();
		if (this.canvas != null) {
			this.canvas.width = 516 / 1.35 - 60;
			this.canvas.height = 766 / 1.35 - 60;
			const solver = new WordsearchSolver(awsTextractResponse.Blocks);
			const words = solver.getWordsToSearch();
			const foundWords = solver.findWords(Object.keys(words));
			var drawer = new WordsearchSolutionDrawer(
				this.canvas,
				this.state.uri,
				words
			);
			drawer.colorBoard({
				rows: foundWords.rows,
				columns: foundWords.columns,
				bottomLeftDiagonals: foundWords.bottomLeftDiagonals,
				bottomRightDiagonals: foundWords.bottomRightDiagonals
			});
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Spinner
					visible={this.state.spinner}
					textContent={'Loading...'}
					textStyle={styles.spinnerTextStyle}
					color='#10ac84'
				/>
				<View style={styles.view}>
					<Canvas ref={canvas => { this.canvas = canvas; }} style={styles.canvas} />
					<StatusBar style="light" />
				</View>
				<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Camera')}>
					<Text style={styles.text}>Solve</Text>
				</TouchableWithoutFeedback>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#2f3640',
		alignItems: 'center',
		justifyContent: 'center'
	},
	view: {
		backgroundColor: '#E8E8E8',
		margin: 10,
		marginTop: 0,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5,
		borderWidth: 5,
		borderColor: '#242931',
		position: 'absolute',
		top: 20
	},
	canvas: {
		top: 0,
		padding: 10,
		marginBottom: 'auto',
		height: 500
	},
	text: {
		position: 'absolute',
		bottom: 18,
		backgroundColor: '#10ac84',
		textAlign: 'center',
		borderRadius: 5,
		paddingTop: 8,
		paddingBottom: 8,
		color: 'white',
		borderWidth: 2,
		borderColor: '#08B287',
		fontSize: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 1,
		width: '70%',
		marginLeft: '15%',
		marginRight: '15%'
	}
});