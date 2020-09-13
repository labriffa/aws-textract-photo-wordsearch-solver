<img height="31.95" width="270" src="https://res.cloudinary.com/dj7k0lade/image/upload/v1599939007/github/wordsearch-photo-solver-logo.png" alt="Wordsearch to Solve" />
Attempts to identify words from a given word search photo. Uses AWS Amplify and Expo to provide a cross platform solution allowing individuals to take photos using their mobiles. The application uses AWS Textract to find corresponding letter locations and uses the React Native Canvas component to apply colouring over the given photo.
  
## Photo to Solution
<p align="center">
  <img height="440" src="https://res.cloudinary.com/dj7k0lade/image/upload/v1599666608/github/download_5.png" alt="Word Search to Solve" />
  <img height="440" src="https://res.cloudinary.com/dj7k0lade/image/upload/v1599666811/github/download_6.png" alt="Word Search Solved" />
  <img height="420" src="https://res.cloudinary.com/dj7k0lade/image/upload/v1600027415/github/word-search-photo-solver-mockup.png" alt="Word Search Solved Mobile" />
</p>

## Possible Improvements
* Add support for search items that contain multiple words
* Consider cross-referencing with other machine learning extraction services
* Mitigate noise on photos (consider using ImageManipulator and allow users to identify both the board and the searchable words through cropped regions)
* Attempt to fix skewed photos or allow users to apply skewing functionality to flatten out board photos

## Authors

* **Lewis Alberto Briffa**
