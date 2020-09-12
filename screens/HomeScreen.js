import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text, Image } from 'react-native';
import { WordsearchSolver } from '../services/wordSearchSolver';
import { WordsearchSolutionDrawer } from '../services/wordSearchSolutionDrawer';
let awsTextractResponse = require('../tests/mock-textract-response.json');
import Canvas from 'react-native-canvas';
import { SafeAreaView } from 'react-navigation'
import { StatusBar } from 'expo-status-bar';
import Spinner from 'react-native-loading-spinner-overlay';
import buttonStyles from '../config/buttons';
import colors from '../config/colors';
import TextractAPI from '../services/textractAPI';

export default class HomeScreen extends React.Component {
	constructor() {
		super();
		this.CANVAS_PADDING = 10;
		this.textractApi = new TextractAPI();
	}

	state = {
		width: 0,
		height: 0,
		canvas: null,
		base64: '',
		spinner: false,
	}

	handleCanvas() {
		if (this.state.canvas != null) {
			this.setState({ spinner: true });
			this.state.canvas.width = this.state.width - this.CANVAS_PADDING;
			this.state.canvas.height = this.state.height - this.CANVAS_PADDING;
			this.textractApi.detectDocumentText(this.state.base64, (data) => {
				awsTextractResponse = data;
				const solver = new WordsearchSolver(awsTextractResponse.Blocks);
				const words = solver.getWordsToSearch();
				const foundWords = solver.findWords(Object.keys(words));
				var drawer = new WordsearchSolutionDrawer(
					this.state.canvas,
					this.state.base64,
					words
				);
				drawer.colorBoard({
					rows: foundWords.rows,
					columns: foundWords.columns,
					bottomLeftDiagonals: foundWords.bottomLeftDiagonals,
					bottomRightDiagonals: foundWords.bottomRightDiagonals
				}, () => {
					this.setState({ spinner: false });
				});
			});
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (props && props.navigation && props.navigation.state && props.navigation.state.params) {
			return {
				base64: props.navigation.state.params.base64,
			};
		}

		return null;
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.base64 !== this.state.base64) {
			this.handleCanvas();
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.view} onLayout={(event) => {
					this.state.width = event.nativeEvent.layout.width;
					this.state.height = event.nativeEvent.layout.height;
				}}>
					<Spinner
						visible={this.state.spinner}
						textContent={'Loading...'}
						textStyle={styles.spinnerTextStyle}
						color='#10ac84'
					/>
					<Image style={[StyleSheet.absoluteFillObject, { borderRadius: 5 }]}
						source={{
							uri: 'https://res.cloudinary.com/dj7k0lade/image/upload/v1599776241/github/Group.png',
						}}
					/>
					<Canvas ref={canvas => { this.state.canvas = canvas; }} style={styles.canvas} />
					<StatusBar style="light" />
				</View>
				<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Camera')}>
					<Text style={buttonStyles.buttonPrimary}>Solve</Text>
				</TouchableWithoutFeedback>
			</SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.slateGrey,
		alignItems: 'center',
		justifyContent: 'center'
	},
	view: {
		backgroundColor: colors.lightGrey,
		position: 'absolute',
		top: 15,
		borderRadius: 20,
		width: '95%',
		height: '85%',
		padding: 5
	}
});
