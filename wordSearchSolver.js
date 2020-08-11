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

		for (var row = 0; row < board.length; row++) {
			for (var i = 0; i < words.length; i++) {
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

		for (var row = 0; row < board.length; row++) {
			for (var i = 0; i < words.length; i++) {
				const regexp = new RegExp(words[i]);
				let match = regexp.exec(board[row].reverse().join(''));
				if (match) {
					foundWordPositions[words[i]] = {
						rowIndex: row,
						startIndex: (14 - (match.index + words[i].length)) + 1,
						endIndex: 14 - match.index
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
	findWordLocations(foundWordPositions) {
		let geometryWords = [];

		for (const key of Object.keys(foundWordPositions)) {
			let foundWordPosition = foundWordPositions[key];
			// for each word position find the corresponding parent id
			let parentId = this.parentLineIds[foundWordPosition.rowIndex];
			geometryWords.push(this.parentLineIdsToChildrenGeometry[parentId].slice(foundWordPosition.startIndex, foundWordPosition.endIndex + 1));
		}

		return geometryWords;
	}
}

export const WordsearchSolver = WordSearchSolver;