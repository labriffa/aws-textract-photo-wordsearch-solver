import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text, Image, Alert } from 'react-native';
import Canvas from 'react-native-canvas';
import { SafeAreaView } from 'react-navigation'
import { StatusBar } from 'expo-status-bar';
import Spinner from 'react-native-loading-spinner-overlay';

// Services
import TextractAPI from '../services/TextractAPI';
import WordSearchSolver from '../services/WordSearchSolver';
import WordSearchSolutionDrawer from '../services/WordSearchSolutionDrawer';

// Styles
import buttonStyles from '../config/buttons';
import colors from '../config/colors';
import preload from '../assets/preload.png';

export default class SolutionScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			spinner: false
		}
	}

	static get CANVAS_PADDING() {
		return 10;
	}

	handleCanvas() {
		if (this.canvas != null) {
			this.setState({ spinner: true });
			this.canvas.width = this.state.width - SolutionScreen.CANVAS_PADDING;
			this.canvas.height = this.state.height - SolutionScreen.CANVAS_PADDING;
			const textractApi = new TextractAPI();
			textractApi.detectDocumentText(this.state.base64, (data) => {
				if (data && data.Blocks) {
					const solver = new WordSearchSolver(data.Blocks);
					const searchableWords = solver.getWordsToSearch();
					const foundWords = solver.findWords(Object.keys(searchableWords));
					const drawer = new WordSearchSolutionDrawer(this.canvas, this.state.base64, searchableWords);
					drawer.colorBoard({
						rows: foundWords.rows,
						columns: foundWords.columns,
						bottomLeftDiagonals: foundWords.bottomLeftDiagonals,
						bottomRightDiagonals: foundWords.bottomRightDiagonals
					}, () => {
						this.setState({ spinner: false });
					});
				} else {
					Alert.alert(
						"Unrecognised Word Search",
						"There was a problem processing your word search please try again.",
						[
							{ text: "OK" }
						]
					);
				}
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
				<Spinner
					visible={this.state.spinner}
					textContent={'Loading...'}
					textStyle={styles.spinnerTextStyle}
					color={colors.mint}
				/>

				<View style={styles.canvasView} onLayout={(event) => {
					this.state.width = event.nativeEvent.layout.width;
					this.state.height = event.nativeEvent.layout.height;
				}}>
					<Image style={styles.preload}
						source={preload}
					/>
					<Canvas ref={canvas => { this.canvas = canvas; }} style={styles.canvas} />
				</View>
				<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Camera')}>
					<Text style={buttonStyles.buttonPrimary}>Solve</Text>
				</TouchableWithoutFeedback>
				<StatusBar style="light" />
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
	canvasView: {
		backgroundColor: colors.lightGrey,
		position: 'absolute',
		top: 15,
		borderRadius: 5,
		width: '90%',
		height: '85%',
		padding: 5
	},
	preload: {
		position: 'absolute',
		borderRadius: 5,
		resizeMode: 'cover',
		width: '100%',
		height: '100%'
	}
});
