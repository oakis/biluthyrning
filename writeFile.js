var fs = require('fs');
var f = require('./functions.js');

function appendFile (file, send, callback) {
	var save = send.toString();
	fs.writeFile(file, save, function(err) {
		if (err) throw err;
		console.log('File saved.');
	})
}

module.exports = writeFile;