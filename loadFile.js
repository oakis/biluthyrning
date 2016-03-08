var fs = require('fs');

// Tar emot filsökväg, trixar och returnerar en array
function loadFile(file, callback){
	 var returnArr = [];
   fs.readFile(file, 'utf8', function (err, data) {
      if (err) throw err;
      data = data.toString();
		  var arr = data.split('*');
		  arr.forEach(function(v, i) {
		    returnArr.push(JSON.parse(arr[i]));
		  });
		  callback(returnArr);
   });
}

module.exports = loadFile;