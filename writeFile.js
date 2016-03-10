var fs = require('fs');
var f = require('./functions.js');

function writeFile (file, send) {
	fs.writeFile(file, send, function(err) {
		if (err) throw err;
		console.log('File saved.');
	})
}

module.exports = writeFile;