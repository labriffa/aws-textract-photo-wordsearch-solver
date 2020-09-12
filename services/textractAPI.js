import getEnvVars from '../environment';
const { TEXTRACT_API_URL } = getEnvVars();

export default class TextractAPI {
	detectDocumentText(base64, resolve) {
		fetch(TEXTRACT_API_URL, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'no-cors',
			method: 'POST',
			body: JSON.stringify({
				base64: base64
			})
		})
			.then(response => response.json())
			.then(json => {
				resolve(json);
			});
	}
}