export default class WordSearchSolver {
	constructor(blocks) {
		this.board = [];
		this.wordsToSearch = [];
		this.CONFIDENCE_THRESHOLD = 70;
		this.MIN_SUPPORTED_LENGTH = 5;
		this.generateBoard(blocks);
	}

	generateBoard(blocks) {
		// Provides us with a mapping for parent line ids to full children objects (allows us to get geometry information)
		let parentLineIdsToChildrenGeometry = new Map();

		// Provides us with a mapping for parent line ids to children ids so we can later associate full children objects to parents
		let parentIdsToChildrenIds = {};

		// Allows us to assoicate rows in boards to parent line ids
		let parentLineIds = [];

		for (const block of blocks) {
			// Find all lines with spaces in them
			if (block.BlockType === 'LINE') {
				if (block.Text.indexOf(' ') >= 0 && block.Text.match(/([\s]+)/g).length >= this.MIN_SUPPORTED_LENGTH) {
					this.board.push(block.Text.split(' ').join('').split(''));

					// Store the parent ids so we can associate the word/letter children later
					parentLineIds.push(block.Id);
					parentIdsToChildrenIds[block.Id] = block.Relationships[0].Ids;
				}
			} else if (block.BlockType === 'WORD') {
				// Find all searchable words (Assume for now that they appear towards the bottom half of the screen)
				if (block.Text && block.Text.length > 1) {
					if (block.Confidence >= this.CONFIDENCE_THRESHOLD) {
						this.wordsToSearch[block.Text.toUpperCase()] = block.Geometry.BoundingBox;
					}
				}

				// Find all letters
				if (block.Text && block.Text.length === 1) {
					// Find the matching parent line ID
					for (const key of Object.keys(parentIdsToChildrenIds)) {
						let children = parentIdsToChildrenIds[key];
						if (children.includes(block.Id)) {
							// Add the geometry objects
							if (parentLineIdsToChildrenGeometry.get(key)) {
								let existingValues = parentLineIdsToChildrenGeometry.get(key);
								existingValues.push({ text: block.Text, id: block.Id, geometry: block.Geometry });
								parentLineIdsToChildrenGeometry.set(key, existingValues);
							} else {
								parentLineIdsToChildrenGeometry.set(key, [{ text: block.Text, id: block.Id, geometry: block.Geometry }]);
							}
						}
					}
				}
			}
		}

		this.board = Array.from(parentLineIdsToChildrenGeometry.values());
	}

	/**
	 * Retrieves the boards rows
	 * 
	 * @return	A 2D array representing each row
	 */
	getRows() {
		return this.board;
	}

	/**
	 * Retrieves the boards columns
	 * 
	 * @return	A 2D array representing each column
	 */
	getColumns() {
		let columns = [];

		for (var row = 0; row < this.board.length; row++) {
			for (var col = 0; col < this.board[row].length; col++) {
				if (!columns[col]) {
					columns[col] = [];
				}
				columns[col].push(this.board[row][col]);
			}
		}

		return columns;
	}

	/**
	 * Retrieves the boards diagonal
	 * 
	 * @return	A 2D array representing each diagonal
	 */
	getDiagonals() {
		return this.getBottomLeftDiagonals().concat(this.getBottomRightDiagonals());
	}

	/**
	 * Retrieves the boards bottom left diagonals
	 * 
	 * @return	A 2D array representing each bottom left diagonal
	 */
	getBottomLeftDiagonals() {
		let diagonals = [];

		for (var i = 0; i < this.board[0].length; i++) {
			let diagonal = [this.board[0][i]];

			for (var j = 1; j < this.board.length; j++) {
				if (this.board[j][i - j]) {
					diagonal.push(this.board[j][i - j]);
				}
			}

			diagonals.push(diagonal);
		}

		for (var i = 1; i < this.board[0].length; i++) {
			if (this.board[i]) {
				let counter = this.board[0].length - 1;
				let diagonal = [this.board[i][counter]];

				for (var j = i + 1; j < this.board[0].length; j++) {
					if (this.board[j]) {
						counter--;
						diagonal.push(this.board[j][counter]);
					}
				}

				diagonals.push(diagonal);
			}
		}

		return diagonals;
	}

	/**
	 * Retrieves the boards bottom right diagonals
	 * 
	 * @return	A 2D array representing each bottom right diagonal
	 */
	getBottomRightDiagonals() {
		let diagonals = [];

		for (var i = 0; i < this.board[0].length; i++) {
			let diagonal = [this.board[0][i]];

			for (var j = 1; j < this.board[0].length - i; j++) {
				if (this.board[j]) {
					diagonal.push(this.board[j][j + i]);
				}
			}

			diagonals.push(diagonal);
		}

		for (var i = 1; i < this.board[0].length; i++) {
			if (this.board[i]) {
				let diagonal = [this.board[i][0]];

				for (var j = i + 1; j < this.board[0].length; j++) {
					if (this.board[j]) {
						diagonal.push(this.board[j][j - i]);
					}
				}

				diagonals.push(diagonal);
			}
		}

		return diagonals;
	}

	/**
	 * Finds words in a given direction both forwards and backwards
	 *
	 * @param		A 2D array holding contents of the direction
	 * @param		A list of words to check against
	 * 
	 * @returns		A 2D array representing the found letters of each identified word
	 */
	findWordsInDirection(direction, words) {
		let foundWords = [];

		for (let i = 0; i < direction.length; i++) {
			for (let j = 0; j < words.length; j++) {
				let directionText = direction[i].map((el) => el.text);
				let wordIndex = directionText.join('').indexOf(words[j]);
				let wordIndexReversed = directionText.join('').indexOf(words[j].split('').reverse().join(''));

				if (wordIndex >= 0) {
					foundWords.push(direction[i].slice(wordIndex, wordIndex + words[j].length));
				}
				if (wordIndexReversed >= 0) {
					foundWords.push(direction[i].slice(wordIndexReversed, wordIndexReversed + words[j].length).reverse());
				}
			}
		}

		return foundWords;
	}

	/**
	 * Looks through the entire board to find any matching words
	 * 
	 * @param		A list of words to check against
	 * 
	 * @returns		An object array comprised of 2D direction arrays representing the found letters of each identified word
	 */
	findWords(words) {
		return {
			rows: this.findWordsInRows(words),
			columns: this.findWordsInColumns(words),
			bottomLeftDiagonals: this.findWordsInBottomLeftDiagonals(words),
			bottomRightDiagonals: this.findWordsInBottomRightDiagonals(words),
		};
	}

	/**
	 * Looks through the boards rows to find any matching words
	 * 
	 * @param		A list of words to check against
	 * 
	 * @returns		A 2D array representing the found letters of each identified word
	 */
	findWordsInRows(words) {
		return this.findWordsInDirection(this.getRows(), words);
	}

	/**
	 * Looks through the boards columns to find any matching words
	 * 
	 * @param		A list of words to check against
	 * 
	 * @returns		A 2D array representing the found letters of each identified word
	 */
	findWordsInColumns(words) {
		return this.findWordsInDirection(this.getColumns(), words);
	}

	/**
	 * Looks through the boards diagonals to find any matching words
	 * 
	 * @param		A list of words to check against
	 * 
	 * @returns		A 2D array representing the found letters of each identified word
	 */
	findWordsInDiagonals(words) {
		return this.findWordsInDirection(this.getDiagonals(), words);
	}

	/**
	 * Looks through the boards bottom left diagonals to find any matching words
	 * 
	 * @param		A list of words to check against
	 * 
	 * @returns		A 2D array representing the found letters of each identified word
	 */
	findWordsInBottomLeftDiagonals(words) {
		return this.findWordsInDirection(this.getBottomLeftDiagonals(), words);
	}

	/**
	 * Looks through the boards bottom right diagonals to find any matching words
	 * 
	 * @param		A list of words to check against
	 * 
	 * @returns		A 2D array representing the found letters of each identified word
	 */
	findWordsInBottomRightDiagonals(words) {
		return this.findWordsInDirection(this.getBottomRightDiagonals(), words);
	}

	/**
	 * Retrieves the words to find on this board
	 * 
	 * @return	A 2D array representing each searchable word
	 */
	getWordsToSearch() {
		return this.wordsToSearch;
	}
}