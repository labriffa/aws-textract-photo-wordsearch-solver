import { StyleSheet } from 'react-native';
import colors from './colors';

const buttonStyles = StyleSheet.create({
	buttonPrimary: {
		position: 'absolute',
		bottom: 18,
		backgroundColor: colors.mint,
		textAlign: 'center',
		color: colors.white,
		borderWidth: 2,
		borderColor: colors.darkMint,
		borderRadius: 5,
		fontSize: 16,
		width: '70%',
		paddingVertical: 8,
		marginHorizontal: '15%'
	}
});

export default buttonStyles;
