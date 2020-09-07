import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WordsearchSolver } from './wordSearchSolver.js';
import { WordsearchSolutionDrawer } from './wordSearchSolutionDrawer.js';
const awsTextractResponse = require('./tests/mock-textract-response.json');

export default class App extends React.Component {
	componentDidMount() {
		this.updateCanvas();
	}
	updateCanvas() {
		const context = this.refs.canvas.getContext('2d');
		let blocks = awsTextractResponse.Blocks;
		const solver = new WordsearchSolver(blocks);
		const wordsToSearch = solver.getWordsToSearch();
		const foundWordsInRows = solver.findWordsInRows(Object.keys(wordsToSearch));
		const foundWordsInColumns = solver.findWordsInColumns(Object.keys(wordsToSearch));
		const foundWordsInBottomLeftDiagonals = solver.findWordsInBottomLeftDiagonals(Object.keys(wordsToSearch));
		const foundWordsInBottomRightDiagonals = solver.findWordsInBottomRightDiagonals(Object.keys(wordsToSearch));

		var drawer = new WordsearchSolutionDrawer(context, 'https://res.cloudinary.com/dj7k0lade/image/upload/v1599496791/github/solar-system-word-search.png', wordsToSearch);
		drawer.colorBoard({
			rows: foundWordsInRows,
			columns: foundWordsInColumns,
			bottomLeftDiagonals: foundWordsInBottomLeftDiagonals,
			bottomRightDiagonals: foundWordsInBottomRightDiagonals
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<canvas ref="canvas" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	}
});