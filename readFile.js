var fs = require('fs');
var f = require('./functions.js')

// Tar emot filsökväg, trixar och returnerar en array
function writeFile(read, write, callback){
	 var returnArr = [];
   fs.readFile(read, 'utf8', function (err, data) {
      if (err) throw err;
      data = data.toString();
		  var arr = data.split('*');
		  arr.forEach(function(v, i) {
		    returnArr.push(JSON.parse(arr[i]));
		  });
		  var send = f.stringify(f.updateFunk(funkObj));
		  fs.writeFile(write, send, function(err) {
	      if (err) throw err;
	      console.log("File saved");
	      var returnArr = [];
	      fs.readFile(read, function(err, data) {
					if (err) throw err;
					data = data.toString();
					var arr = data.split('*');
					arr.forEach(function(v,i){
						returnArr.push(JSON.parse(arr[i]))
					});
					callback(returnArr);
	      });
	    });
		  
   });
}

module.exports = writeFile;