import Canvas, { Image as CanvasImage } from 'react-native-canvas';

class WordSearchSolutionDrawer {
	constructor(canvas, imageUrl, wordsToSearch, width, height) {
		this.wordsToSearch = wordsToSearch;
		this.GLOBAL_ALPHA = 0.45;
		this.PADDING = 80;
		this.SCALE = 1;
		this.COLORS = [
			"aquamarine",
			"black", "blueviolet", "brown",
			"chartreuse", "chocolate", "coral", "cornflowerblue", "crimson",
			"darkblue", "darkgoldenrod", "darkgreen", "darkkhaki",
			"darkolivegreen", "darkorange", "darkred", "darksalmon", "darkseagreen",
			"darkslateblue", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dodgerblue",
			"firebrick", "forestgreen",
			"gold", "goldenrod",
			"hotpink",
			"indianred", "indigo",
			"lightcoral", "lightgreen", "lightsalmon", "lightseagreen",
			"lightskyblue", "lightslategray", "lightsteelblue", "limegreen",
			"mediumaquamarine", "mediumblue", "mediumorchid",
			"mediumseagreen", "mediumslateblue", "mediumturquoise", "mediumvioletred",
			"navy",
			"olive", "olivedrab", "orange", "orangered", "orchid",
			"palegoldenrod", "palegreen", "palevioletred", "peru", "plum",
			"purple",
			"rosybrown", "royalblue",
			"saddlebrown", "salmon", "sandybrown", "seagreen", "sienna",
			"slateblue", "springgreen", "steelblue",
			"tomato",
			"violet",
			"yellowgreen"
		];

		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');
		this.image = new CanvasImage(this.canvas);
		this.image.crossOrigin = "anonymous";
		this.image.src = 'data:image/png;base64,' + imageUrl;
		this.IMAGE_WIDTH = this.canvas.width - 20;
		this.IMAGE_HEIGHT = this.canvas.height - 20;
	}

	/**
	 * Applies the coloring process to all identified word positions on the word search canvas
	 * 
	 * @param	wordLocations	An object representing the locations of each row, column and diagonal words
	 */
	colorBoard(wordLocations) {
		this.image.addEventListener('load', () => {
			this.context.drawImage(this.image, 0, 0, this.IMAGE_WIDTH, this.IMAGE_HEIGHT);

			// Set transparency
			this.context.globalAlpha = this.GLOBAL_ALPHA;

			// Color words
			this.colorRowWords(wordLocations.rows);
			this.colorColumnWords(wordLocations.columns);
			this.colorBottomLeftDiagonalWords(wordLocations.bottomLeftDiagonals);
			this.colorBottomRightDiagonalWords(wordLocations.bottomRightDiagonals);
		});
	}

	/**
	 * Finds the maximum and minimum geometry position for letters of a given word
	 * 
	 * @param	geometryWord 		A word object containing geometry information
	 * 
	 * @returns		An object containing min and max geometry values for the given word
	 */
	getMinMaxGeometryWord(geometryWord) {
		return {
			minLeft: Math.min(...geometryWord.map((letter) => letter.geometry.BoundingBox.Left)),
			maxLeft: Math.max(...geometryWord.map((letter) => letter.geometry.BoundingBox.Left)),
			maxHeight: Math.max(...geometryWord.map((letter) => letter.geometry.BoundingBox.Height)),
			maxWidth: Math.max(...geometryWord.map((letter) => letter.geometry.BoundingBox.Width)),
			minTop: Math.min(...geometryWord.map((letter) => letter.geometry.BoundingBox.Top)),
			maxTop: Math.max(...geometryWord.map((letter) => letter.geometry.BoundingBox.Top))
		}
	}

	/**
	 * Colours all row words from a given list of geometry words
	 * 
	 * @param	words 	A list of geometry words (containing positions of each letter)
	 */
	colorRowWords(words) {
		words.forEach((word) => {
			let geometry = this.getMinMaxGeometryWord(word);
			let randomColorIndex = this.getRandomColorIndex();

			this.drawLine(
				{
					x: (geometry.minLeft * this.IMAGE_WIDTH) * this.SCALE,
					y: ((geometry.minTop * this.IMAGE_HEIGHT) + (geometry.maxHeight * this.IMAGE_HEIGHT) / 2) * this.SCALE
				},
				{
					x: ((geometry.maxLeft + geometry.maxWidth) * this.IMAGE_WIDTH) * this.SCALE,
					y: ((geometry.maxTop * this.IMAGE_HEIGHT) + (geometry.maxHeight * this.IMAGE_HEIGHT) / 2) * this.SCALE
				}, geometry.maxHeight, randomColorIndex
			);

			let wordToColour = this.wordsToSearch[word.map((letter) => letter.text).join('')];
			this.colorWordToSearch(wordToColour, randomColorIndex);
		});
	}

	/**
	 * Colours all columns words from a given list of geometry words
	 * 
	 * @param	words 	A list of geometry words (containing positions of each letter)
	 */
	colorColumnWords(words) {
		words.forEach((word) => {
			let geometry = this.getMinMaxGeometryWord(word);
			let randomColorIndex = this.getRandomColorIndex();

			this.drawLine(
				{
					x: ((geometry.minLeft * this.IMAGE_WIDTH) + (geometry.maxWidth * this.IMAGE_WIDTH / 2)) * this.SCALE,
					y: geometry.minTop * this.IMAGE_HEIGHT * this.SCALE
				},
				{
					x: ((geometry.minLeft * this.IMAGE_WIDTH) + (geometry.maxWidth * this.IMAGE_WIDTH / 2)) * this.SCALE,
					y: ((geometry.maxTop * this.IMAGE_HEIGHT) + (geometry.maxHeight * this.IMAGE_HEIGHT)) * this.SCALE
				}, geometry.maxHeight, randomColorIndex
			);

			let wordToColour = this.wordsToSearch[word.map((letter) => letter.text).join('')];
			this.colorWordToSearch(wordToColour, randomColorIndex);
		});
	}

	/**
	 * Colours all bottom left diagonal words from a given list of geometry words
	 * 
	 * @param	words 	A list of geometry words (containing positions of each letter)
	 */
	colorBottomLeftDiagonalWords(words) {
		words.forEach((word) => {
			let geometry = this.getMinMaxGeometryWord(word);
			let randomColorIndex = this.getRandomColorIndex();

			this.drawLine(
				{
					x: (geometry.minLeft * this.IMAGE_WIDTH) * this.SCALE,
					y: (geometry.maxTop + geometry.maxHeight) * this.IMAGE_HEIGHT * this.SCALE
				},
				{
					x: (geometry.maxLeft * this.IMAGE_WIDTH * this.SCALE) + (geometry.maxHeight * this.IMAGE_HEIGHT * this.SCALE),
					y: (geometry.minTop * this.IMAGE_HEIGHT * this.SCALE)
				}, geometry.maxHeight, randomColorIndex
			);

			let wordToColour = this.wordsToSearch[word.map((letter) => letter.text).join('')];
			this.colorWordToSearch(wordToColour, randomColorIndex);
		});
	}

	/**
	 * Colours all bottom right diagonal words from a given list of geometry words
	 * 
	 * @param	words 	A list of geometry words (containing positions of each letter)
	 */
	colorBottomRightDiagonalWords(words) {
		words.forEach((word) => {
			let geometry = this.getMinMaxGeometryWord(word);
			let randomColorIndex = this.getRandomColorIndex();

			this.drawLine(
				{
					x: (geometry.minLeft * this.IMAGE_WIDTH) * this.SCALE,
					y: (geometry.minTop * this.IMAGE_HEIGHT) * this.SCALE
				},
				{
					x: (geometry.maxLeft * this.IMAGE_WIDTH) * this.SCALE + (geometry.maxHeight * this.IMAGE_HEIGHT * this.SCALE),
					y: (geometry.maxTop) * this.IMAGE_HEIGHT * this.SCALE + (geometry.maxHeight * this.IMAGE_HEIGHT * this.SCALE)
				}, geometry.maxHeight, randomColorIndex
			);

			let wordToColour = this.wordsToSearch[word.map((letter) => letter.text).join('')];
			this.colorWordToSearch(wordToColour, randomColorIndex);
		});
	}

	/**
	 * Colours a 'word to search'
	 * 
	 * @param	wordToColour 	An object representing the geometry word to colour
	 * @param	colorIndex		The corresponding colour index to use for the given word
	 */
	colorWordToSearch(wordToColour, colorIndex) {
		this.drawLine(
			{
				x: (wordToColour.Left * this.IMAGE_WIDTH) * this.SCALE,
				y: ((wordToColour.Top * this.IMAGE_HEIGHT) + (wordToColour.Height * this.IMAGE_HEIGHT) / 2) * this.SCALE
			},
			{
				x: ((wordToColour.Left * this.IMAGE_WIDTH) + (wordToColour.Width * this.IMAGE_WIDTH)) * this.SCALE,
				y: ((wordToColour.Top * this.IMAGE_HEIGHT) + (wordToColour.Height * this.IMAGE_HEIGHT) / 2) * this.SCALE
			}, wordToColour.Height, colorIndex);

		this.COLORS.splice(colorIndex, 1);
	}

	/**
	 * Draws a line on the canvas
	 * 
	 * @param	from 			The 'x' and 'y' positions to use for the starting position of the line
	 * @param	to				The 'x' and 'y' positions to use for the end position of the line
	 * @param	lineWidth		The width size of the line
	 * @param	colorIndex		The corresponding colour index to use for the given line
	 */
	drawLine(from, to, lineWidth, colorIndex) {
		this.context.beginPath();
		this.context.moveTo(
			from.x,
			from.y
		);
		this.context.lineTo(
			to.x,
			to.y
		);

		this.context.lineWidth = lineWidth * this.IMAGE_HEIGHT * this.SCALE;
		this.context.strokeStyle = this.COLORS[colorIndex];
		this.context.stroke();
		this.context.closePath();
	}

	/**
	 * Retrieves a random colour index
	 * 
	 * @return		A random integer between 0 and the length of the colors array
	 */
	getRandomColorIndex() {
		return Math.floor(Math.random() * this.COLORS.length);
	}
}

export const WordsearchSolutionDrawer = WordSearchSolutionDrawer;