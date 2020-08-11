class WordSearchSolver {
	constructor() {
		// Allows us to assoicate rows in boards to parent line ids
		this.parentLineIds = [];

		// Provides us with a mapping for parent line ids to children ids so we can later associate full children objects to parents
		this.parentLineIdsToChildren = {};

		// Provides us with a mapping for parent line ids to children ids so we can later associate full children objects to parents
		this.parentIdsToChildrenIds = {};

		// Provides us with a mapping for parent line ids to full children objects (allows us to get geometry information)
		this.parentLineIdsToChildrenGeometry = {};

		// The board comprised of rows
		this.board = [];
	}

	generateBoard(blocks) {
		for (const block of blocks) {
			// Find all lines with spaces in them
			if (block.BlockType === 'LINE') {
				if (block.Text.indexOf(' ') >= 0) {

					// Ensure split line is only comprised of single letters
					let isValidRow = this.isValidRow(block.Text);

					// Aggregate the rows into the board
					if (isValidRow) {
						this.board.push(block.Text.split(' '));

						// Store the parent ids so we can associate the word/letter children later
						this.parentLineIds.push(block.Id);
						this.parentIdsToChildrenIds[block.Id] = block.Relationships[0].Ids;
					}
				}
			} else if (block.BlockType === 'WORD') {

				// Find all letters
				if (block.Text && block.Text.length === 1) {

					// Find the matching parent line ID
					for (const key of Object.keys(this.parentIdsToChildrenIds)) {
						let children = this.parentIdsToChildrenIds[key];
						if (children.includes(block.Id)) {

							// Add the geometry objects
							if (this.parentLineIdsToChildrenGeometry[key]) {
								this.parentLineIdsToChildrenGeometry[key].push(block.Geometry.BoundingBox);
							} else {
								this.parentLineIdsToChildrenGeometry[key] = [block.Geometry.BoundingBox];
							}
						}
					}
				}
			}
		}

		return this.board;
	}

	/**
	 * From a given row string comprised of spaces determines if the row is comprised of singular letters
	 */
	isValidRow(rowStr) {
		return rowStr.split(' ').every((x) => x.length === 1);
	}

	/**
	 * When given a board along with a list of rows it finds the start and end indexes of found words along with their corresponding
	 * row index
	 * 
	 * @param		The board we want to check
	 * @param		The list of words we want to check against
	 * 
	 * @returns		A mapping of found words along with their row index and start/end index positions
	 */
	findWordsInRows(board, words) {
		let foundWordPositions = {};

		for (let row = 0; row < board.length; row++) {
			for (let i = 0; i < words.length; i++) {
				const regexp = new RegExp(words[i]);
				let match = regexp.exec(board[row].join(''));
				if (match) {
					foundWordPositions[words[i]] = {
						rowIndex: row,
						startIndex: match.index,
						endIndex: match.index + words[i].length - 1
					};
				}
			}
		}

		for (let row = 0; row < board.length; row++) {
			for (let i = 0; i < words.length; i++) {
				const regexp = new RegExp(words[i]);
				let match = regexp.exec(board[row].slice().reverse().join(''));
				if (match) {
					foundWordPositions[words[i]] = {
						rowIndex: row,
						startIndex: ((board.length - 1) - (match.index + words[i].length)) + 1,
						endIndex: (board.length - 1) - match.index
					};
				}
			}
		}

		return foundWordPositions;
	}

	/**
	 * When given a board along with a list of rows it finds the start and end indexes of found words along with their corresponding
	 * row index
	 * 
	 * @param		The board we want to check
	 * @param		The list of words we want to check against
	 * 
	 * @returns		A mapping of found words along with their row index and start/end index positions
	 */
	findWordsInColumns(board, words) {
		let columns = [];
		let foundWordPositions = {};

		for (var row = 0; row < board.length; row++) {
			for (var col = 0; col < board[row].length; col++) {
				if (!columns[col]) {
					columns[col] = [board[row][col]];
				} else {
					columns[col].push(board[row][col]);
				}
			}
		}


		for (var col = 0; col < columns.length; col++) {
			for (var i = 0; i < words.length; i++) {
				const regexp = new RegExp(words[i]);
				let match = regexp.exec(columns[col].join(''));
				if (match) {
					foundWordPositions[words[i]] = {
						colIndex: col,
						startIndex: match.index,
						endIndex: match.index + words[i].length
					};
				}
			}
		}

		for (var col = 0; col < columns.length; col++) {
			for (var i = 0; i < words.length; i++) {
				const regexp = new RegExp(words[i]);
				let match = regexp.exec(columns[col].slice().reverse().join(''));
				if (match) {
					foundWordPositions[words[i]] = {
						colIndex: col,
						startIndex: 14 - match.index - words[i].length + 1,
						endIndex: 14 - match.index + 1
					};
				}
			}
		}

		return foundWordPositions;
	}

	/**
	 * Finds the corresponding geometry values from a given list of word positions
	 * 
	 * @param	foundWordPositions 
	 */
	findWordLocationsInRows(foundWordPositions) {
		let geometryWords = [];

		for (const key of Object.keys(foundWordPositions)) {
			let foundWordPosition = foundWordPositions[key];
			// for each word position find the corresponding parent id
			let parentId = this.parentLineIds[foundWordPosition.rowIndex];
			geometryWords.push(this.parentLineIdsToChildrenGeometry[parentId].slice(foundWordPosition.startIndex, foundWordPosition.endIndex + 1));
		}

		return geometryWords;
	}

	/**
	 * Finds the corresponding geometry values from a given list of word positions
	 * 
	 * @param	foundWordPositions 
	 */
	findWordLocationsInColumns(foundWordPositions) {
		let geometryWords = [];

		for (const key of Object.keys(foundWordPositions)) {
			let foundWordPosition = foundWordPositions[key];
			let colWords = [];
			for (var i = foundWordPosition.startIndex; i < foundWordPosition.endIndex; i++) {
				// for each word position find the corresponding parent id
				let parentId = this.parentLineIds[i];
				colWords.push(...this.parentLineIdsToChildrenGeometry[parentId].slice(foundWordPosition.colIndex, foundWordPosition.colIndex + 1));
			}
			geometryWords.push(colWords);
		}

		return geometryWords;
	}
}

export const WordsearchSolver = WordSearchSolver;