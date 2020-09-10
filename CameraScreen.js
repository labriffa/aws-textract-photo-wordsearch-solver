import React, { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Spinner from 'react-native-loading-spinner-overlay';

export default class CameraScreen extends React.Component {
	camera = null;

	state = {
		hasCameraPermission: null,
		spinner: false
	};

	async componentDidMount() {
		const camera = await Permissions.askAsync(Permissions.CAMERA);
		const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
		const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

		this.setState({ hasCameraPermission });
	};

	takePicture = () => {
		this.spinner = true;

		if (this.camera) {
			const options = { quality: 0.8, base64: true };
			this.setState({ spinner: true });
			this.camera.takePictureAsync(options).then((photo) => {
				this.setState({ spinner: false });
				this.props.navigation.navigate('Home', {
					uri: photo.base64
				});
			});;
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
			<View style={{ flex: 1 }}>
				<Spinner
					visible={this.state.spinner}
					textContent={'Loading...'}
					textStyle={styles.spinnerTextStyle}
					color='#10ac84'
				/>
				<Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={camera => this.camera = camera}></Camera>
				<Text style={styles.text} onPress={() => { this.takePicture() }}>Take Photo</Text>
			</View>
		);
	};
};

const styles = {
	text: {
		position: 'absolute',
		bottom: 18,
		backgroundColor: '#10ac84',
		textAlign: 'center',
		borderRadius: 5,
		paddingTop: 8,
		paddingBottom: 8,
		color: 'white',
		borderWidth: 2,
		borderColor: '#10ac84',
		fontSize: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 1,
		width: '70%',
		marginLeft: '15%',
		marginRight: '15%'
	},
	spinnerTextStyle: {
		color: 'white'
	}
}