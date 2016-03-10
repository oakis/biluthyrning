var fs = require('fs');

function appendFile (file, send) {
	var save = '\n*\n' + JSON.stringify(send, null, "\t");
	fs.appendFile(file, save, function(err, data) {
		if (err) throw err;
		console.log('File saved.');
	})
}

module.exports = appendFile;