import React from 'react';
import { Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Spinner from 'react-native-loading-spinner-overlay';

// Styles
import buttonStyles from '../config/buttons';
import colors from '../config/colors';

export default class CameraScreen extends React.Component {
	camera = null;

	state = {
		hasCameraPermission: null,
		spinner: false,
		base64: ''
	};

	async componentDidMount() {
		const camera = await Permissions.askAsync(Permissions.CAMERA);
		const hasCameraPermission = (camera.status === 'granted');

		this.setState({ hasCameraPermission });
	};

	takePicture = async () => {
		this.spinner = true;

		if (this.camera) {
			this.setState({ spinner: true });
			const options = {
				quality: 0.4, base64: true, onPictureSaved: (photo) => {
					this.setState({ spinner: false, base64: photo.base64 }, () => {
						this.props.navigation.navigate('Home', {
							base64: this.state.base64
						});
					});
				}
			};
			await this.camera.takePictureAsync(options);
			await this.camera.pausePreview();
		}
	};

	render() {
		const { hasCameraPermission } = this.state;

		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return <Text>Access to camera has been denied.</Text>;
		}

		return (
			<View style={styles.cameraView}>
				<Spinner
					visible={this.state.spinner}
					textContent={'Loading...'}
					textStyle={styles.spinnerTextStyle}
					color='#10ac84'
				/>

				<Camera style={styles.camera} type={Camera.Constants.Type.back} ref={camera => this.camera = camera} flashMode={'auto'}></Camera>
				<Text style={buttonStyles.buttonPrimary} onPress={() => { this.takePicture() }}>
					Take Photo
				</Text>
			</View>
		);
	};
};

const styles = {
	cameraView: {
		flex: 1
	},
	camera: {
		flex: 1
	},
	spinnerTextStyle: {
		color: colors.white
	}
}