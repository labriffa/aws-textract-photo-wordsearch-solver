import WordSearchSolver from '../services/WordSearchSolver';

const assert = require('assert');
const fs = require('fs');
let awsTextractResponse;
const WORDS_TO_SEARCH = [
	'EARTH',
	'JUPITER',
	'MARS',
	'MERCURY',
	'NEPTUNE',
	'PLANET',
	'SATURN',
	'SUN',
	'URANUS',
	'VENUS'
]

before(function () {
	// Fetch the AWS mock textract response
	awsTextractResponse = fs.readFileSync(process.cwd() + '/tests/mock-textract-response.json', 'utf8');
});

describe('WordsearchSolver', function () {
	describe('#extractDirections()', function () {
		// Rows
		it('should extract all rows', function () {
			let blocks = JSON.parse(awsTextractResponse).Blocks;
			const solver = new WordSearchSolver(blocks);
			const rows = solver.getRows();
			const expectedRows = [
				['Y', 'Q', 'H', 'Y', 'B', 'V', 'S', 'E', 'P', 'N'],
				['E', 'R', 'M', 'Q', 'E', 'G', 'N', 'T', 'L', 'U'],
				['B', 'Z', 'U', 'A', 'C', 'U', 'A', 'R', 'A', 'S'],
				['H', 'Q', 'R', 'C', 'T', 'P', 'H', 'E', 'N', 'K'],
				['Q', 'T', 'U', 'P', 'R', 'N', 'W', 'T', 'E', 'X'],
				['H', 'V', 'E', 'R', 'G', 'E', 'E', 'I', 'T', 'Q'],
				['P', 'N', 'F', 'S', 'A', 'L', 'M', 'P', 'O', 'D'],
				['S', 'A', 'T', 'U', 'R', 'N', 'W', 'U', 'A', 'R'],
				['S', 'U', 'N', 'E', 'V', 'A', 'U', 'J', 'Q', 'K'],
				['R', 'A', 'V', 'I', 'Q', 'F', 'M', 'S', 'Z', 'S'],
			];

			assert.equal(rows.length, expectedRows.length);
			for (let i = 0; i < expectedRows.length; i++) {
				for (let j = 0; j < expectedRows[i].length; j++) {
					assert.equal(expectedRows[i][j], rows[i][j].text);
				}
			}
		});

		// Columns
		it('should extract all columns', function () {
			let blocks = JSON.parse(awsTextractResponse).Blocks;
			const solver = new WordSearchSolver(blocks);
			const columns = solver.getColumns();
			const expectedColumns = [
				['Y', 'E', 'B', 'H', 'Q', 'H', 'P', 'S', 'S', 'R'],
				['Q', 'R', 'Z', 'Q', 'T', 'V', 'N', 'A', 'U', 'A'],
				['H', 'M', 'U', 'R', 'U', 'E', 'F', 'T', 'N', 'V'],
				['Y', 'Q', 'A', 'C', 'P', 'R', 'S', 'U', 'E', 'I'],
				['B', 'E', 'C', 'T', 'R', 'G', 'A', 'R', 'V', 'Q'],
				['V', 'G', 'U', 'P', 'N', 'E', 'L', 'N', 'A', 'F'],
				['S', 'N', 'A', 'H', 'W', 'E', 'M', 'W', 'U', 'M'],
				['E', 'T', 'R', 'E', 'T', 'I', 'P', 'U', 'J', 'S'],
				['P', 'L', 'A', 'N', 'E', 'T', 'O', 'A', 'Q', 'Z'],
				['N', 'U', 'S', 'K', 'X', 'Q', 'D', 'R', 'K', 'S'],
			];

			assert.equal(Object.keys(columns).length, expectedColumns.length);
			for (let i = 0; i < expectedColumns.length; i++) {
				for (let j = 0; j < expectedColumns[i].length; j++) {
					assert.equal(expectedColumns[i][j], columns[i][j].text);
				}
			}
		})

		// Bottom Right Diagonals
		it('should extract all diagonals originating from the bottom right', function () {
			let blocks = JSON.parse(awsTextractResponse).Blocks;
			const solver = new WordSearchSolver(blocks);
			let diagonals = solver.getBottomRightDiagonals();
			const expectedDiagonals = [
				['Y', 'R', 'U', 'C', 'R', 'E', 'M', 'U', 'Q', 'S'],
				['Q', 'M', 'A', 'T', 'N', 'E', 'P', 'A', 'K'],
				['H', 'Q', 'C', 'P', 'W', 'I', 'O', 'R'],
				['Y', 'E', 'U', 'H', 'T', 'T', 'D'],
				['B', 'G', 'A', 'E', 'E', 'Q'],
				['V', 'N', 'R', 'N', 'X'],
				['S', 'T', 'A', 'K'],
				['E', 'L', 'S'],
				['P', 'U'],
				['N'],
				['E', 'Z', 'R', 'P', 'G', 'L', 'W', 'J', 'Z'],
				['B', 'Q', 'U', 'R', 'A', 'N', 'U', 'S'],
				['H', 'T', 'E', 'S', 'R', 'A', 'M'],
				['Q', 'V', 'F', 'U', 'V', 'F'],
				['H', 'N', 'T', 'E', 'Q'],
				['P', 'A', 'N', 'I'],
				['S', 'U', 'V'],
				['S', 'A'],
				['R']
			];

			assert.equal(diagonals.length, expectedDiagonals.length);
			for (let i = 0; i < expectedDiagonals.length; i++) {
				for (let j = 0; j < expectedDiagonals[i].length; j++) {
					assert.equal(expectedDiagonals[i][j], diagonals[i][j].text);
				}
			}
		});

		// Bottom Left Diagonals
		it('should extract all diagonals originating from the bottom left', function () {
			let blocks = JSON.parse(awsTextractResponse).Blocks;
			const solver = new WordSearchSolver(blocks);
			let diagonals = solver.getBottomLeftDiagonals();

			const expectedDiagonals = [
				['Y'],
				['Q', 'E'],
				['H', 'R', 'B'],
				['Y', 'M', 'Z', 'H'],
				['B', 'Q', 'U', 'Q', 'Q'],
				['V', 'E', 'A', 'R', 'T', 'H'],
				['S', 'G', 'C', 'C', 'U', 'V', 'P'],
				['E', 'N', 'U', 'T', 'P', 'E', 'N', 'S'],
				['P', 'T', 'A', 'P', 'R', 'R', 'F', 'A', 'S'],
				['N', 'L', 'R', 'H', 'N', 'G', 'S', 'T', 'U', 'R'],
				['U', 'A', 'E', 'W', 'E', 'A', 'U', 'N', 'A'],
				['S', 'N', 'T', 'E', 'L', 'R', 'E', 'V'],
				['K', 'E', 'I', 'M', 'N', 'V', 'I'],
				['X', 'T', 'P', 'W', 'A', 'Q'],
				['Q', 'O', 'U', 'U', 'F'],
				['D', 'A', 'J', 'M'],
				['R', 'Q', 'S'],
				['K', 'Z'],
				['S']
			];

			assert.equal(diagonals.length, expectedDiagonals.length);
			for (let i = 0; i < expectedDiagonals.length; i++) {
				for (let j = 0; j < expectedDiagonals[i].length; j++) {
					assert.equal(expectedDiagonals[i][j], diagonals[i][j].text);
				}
			}
		})
	});

	describe('#findWords()', function () {
		// Rows
		it('should find all possible words on each row', function () {
			let blocks = JSON.parse(awsTextractResponse).Blocks;
			const solver = new WordSearchSolver(blocks);
			const foundWords = solver.findWordsInRows(WORDS_TO_SEARCH);
			const expectedWords = [
				['S', 'A', 'T', 'U', 'R', 'N'],
				['S', 'U', 'N'],
				['V', 'E', 'N', 'U', 'S']
			];

			assert.equal(Object.keys(foundWords).length, expectedWords.length);
			for (let i = 0; i < expectedWords.length; i++) {
				for (let j = 0; j < expectedWords[i].length; j++) {
					assert.equal(expectedWords[i][j], foundWords[i][j].text);
				}
			}
		});

		//Columns
		it('should find all possible words on each column', function () {
			let blocks = JSON.parse(awsTextractResponse).Blocks;
			const solver = new WordSearchSolver(blocks);
			const foundWords = solver.findWordsInColumns(WORDS_TO_SEARCH);
			const expectedWords = [
				['J', 'U', 'P', 'I', 'T', 'E', 'R'],
				['P', 'L', 'A', 'N', 'E', 'T'],
				['S', 'U', 'N']
			];

			assert.equal(Object.keys(foundWords).length, expectedWords.length);
			for (let i = 0; i < expectedWords.length; i++) {
				for (let j = 0; j < expectedWords[i].length; j++) {
					assert.equal(expectedWords[i][j], foundWords[i][j].text);
				}
			}
		});

		// Diagonals
		it('should find all possible words on each diagonal', function () {
			let blocks = JSON.parse(awsTextractResponse).Blocks;
			const solver = new WordSearchSolver(blocks);
			const foundWords = solver.findWordsInDiagonals(WORDS_TO_SEARCH);
			const expectedWords = [
				['E', 'A', 'R', 'T', 'H'],
				['N', 'E', 'P', 'T', 'U', 'N', 'E'],
				['M', 'E', 'R', 'C', 'U', 'R', 'Y'],
				['S', 'U', 'N'],
				['U', 'R', 'A', 'N', 'U', 'S'],
				['M', 'A', 'R', 'S']
			];

			assert.equal(Object.keys(foundWords).length, expectedWords.length);
			for (let i = 0; i < expectedWords.length; i++) {
				for (let j = 0; j < expectedWords[i].length; j++) {
					assert.equal(expectedWords[i][j], foundWords[i][j].text);
				}
			}
		});
	});
});
