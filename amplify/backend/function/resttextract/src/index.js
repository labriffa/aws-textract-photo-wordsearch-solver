let AWS = require("aws-sdk");
let textract = new AWS.Textract();

exports.handler = async (event, context) => {
	let params = {
		Document: {
			S3Object: {
				Bucket: 'test-image-for-aws-rekognition',
				Name: 'TreesWordSearch.png'
			}
		}
	};

	await textract.detectDocumentText(params).promise().then(function (data) {
		context.done(null, {
			statusCode: 200,
			body: JSON.stringify(data)
		});
	});
};