let AWS = require("aws-sdk");
let textract = new AWS.Textract();

exports.handler = async (event, context) => {
	let base64 = JSON.parse(event.body).base64;
	let base64Buff = new Buffer.from(base64, 'base64');

	let params = {
		Document: {
			Bytes: base64Buff
		}
	};

	let detectDocumentText = await textract.detectDocumentText(params).promise();
	context.done(null, {
		statusCode: 200,
		body: JSON.stringify(detectDocumentText)
	});
};
