var express = require('express');
var router = express.Router();
var fs = require('fs');

var funktioner = './data/funktioner.json';

checkIfExist = function (req, db) {
  var isItTrue;
  db.forEach(function(v,i){
    if (db[i].name == req.name)
      isItTrue = true;
  })
  return isItTrue;
}

sortArr = function (key) {
	return function(a, b){
		var valA=a[key].toLowerCase(), valB=b[key].toLowerCase();
			if (valA < valB)
				return -1;
			if (valA > valB)
				return 1;
			return 0;
		};
}


/* GET home page. */
router.get('/', function(req, res, next) {
	var funkArr = [];
	fs.readFile(funktioner, function(err, data) {
		if (err) throw err;
		data = data.toString();
		var arr = data.split('*');
		arr.forEach(function(v,i){
			funkArr.push(JSON.parse(arr[i]));
		})
		funkArr.sort(sortArr('name')); // Sortera efter 'name' innan arrayen skickas till render
		res.render('funktioner', {funklista: funkArr});
	})
});

router.post('/add', function(req, res, next) {
	var funkArr = [];
	fs.readFile(funktioner, function(err, data) {
		if (err) throw err;
		data = data.toString();
		var arr = data.split('*');
		arr.forEach(function(v,i){
			funkArr.push(JSON.parse(arr[i]))
		})
		var newFunktion = {
			"id": funkArr[funkArr.length - 1].id + 1, // Titta på sista element.id och lägg till 1.
			"name": req.body.name
		}
		funkArr.sort(sortArr('name')); // Sortera efter 'name' innan arrayen skickas till render
		var send = '\n*\n' + JSON.stringify(newFunktion,null,"\t");
		if (checkIfExist(newFunktion, funkArr) == true) {
			console.log('Funktionen finns redan registrerad')
			res.render('funktioner', {
				funklista: funkArr,
				funkExists: 'Funktionen "' + newFunktion.name + '" finns redan registrerad.',
				funkErr: true
			})
		} else {
			fs.appendFile(funktioner, send, function(err, data) {
				if (err) throw err;
				else console.log('SUCCESS MOTHERFUCKER: '+send);
					res.redirect('/funktioner');
				})
		}
	})
});

updateFunk = function (req) {
	var deleteId = [];
	if (req.deleteId.length > 1) {
		req.deleteId.forEach(function(v,i){
			deleteId.push(parseFloat(req.deleteId[i]));
		})
	} else {
		deleteId.push(parseFloat(req.deleteId));
	}
  deleteId.forEach(function(v,i){
  	req.merged.forEach(function(v,ind){
  		if (req.merged[ind].id == deleteId[i]) {
  			req.merged.splice(req.merged.indexOf(req.merged[ind]),1)
  		}
  	})
  })
  return req.merged;
}

stringify = function (updateFunk) {
			var str = "";
			updateFunk.forEach(function(v,i){
				str += '{\n\t"id": ' + updateFunk[i].id + ',\n\t"name": "' + updateFunk[i].name + '"\n}\n*\n';
			})
			str = str.slice(0, -3);
			return str;
		}

router.post('/update', function(req,res,next){
	var funkArr = [];
	fs.readFile(funktioner, 'utf8', (err, data) => {
    if (err) throw err
    data = data.toString();
		var arr = data.split('*');
		arr.forEach(function(v,i){
			funkArr.push(JSON.parse(arr[i]));
		})
		var merged = req.body.tillval.map( (element, i) => {
 			return {id: parseFloat(req.body.tillvalId[i]), name: element}
		});
		merged.sort(sortArr('name'));
		funkArr.sort(sortArr('name'));
		
		var funkObj = {
			'merged': merged,
			'deleteId': req.body.deleteId
		}

		var send = stringify(updateFunk(funkObj));
		
    fs.writeFile(funktioner, send, function(err) {
      if (err) throw err;
      console.log("File saved");
      var funkArr = [];
      fs.readFile(funktioner, function(err, data) {
				if (err) throw err;
				data = data.toString();
				var arr = data.split('*');
				arr.forEach(function(v,i){
					funkArr.push(JSON.parse(arr[i]))
				});
				res.render('funktioner', {
					funklista: funkArr,
					funkAdded: 'Funktioner uppdaterade.',
					funkAdd: true
				})
      });
    });
  });
})

module.exports = router;
