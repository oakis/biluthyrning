var fs = require('fs');

function writeFile (file, send, callback) {
	fs.writeFile(file, send, function(err) {
		if (err) throw err;
		console.log('File saved.');
	})
	callback()
}

module.exports = writeFile;