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



/* GET home page. */
router.get('/', function(req, res, next) {
	var funkArr = [];
	fs.readFile(funktioner, function(err, data) {
		if (err) throw err;
		data = data.toString();
		var arr = data.split('*');
		arr.forEach(function(v,i){
			funkArr.push(JSON.parse(arr[i]))
		})
		funkArr.sort(function(a, b){
		var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
			if (nameA < nameB) //sort string ascending
				return -1;
			if (nameA > nameB)
				return 1;
			return 0; //default return value (no sorting)
		});
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
			"id": funkArr.length + 1,
			"name": req.body.name
		}
		funkArr.sort(function(a, b){
		var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
			if (nameA < nameB) //sort string ascending
				return -1;
			if (nameA > nameB)
				return 1;
			return 0; //default return value (no sorting)
		});
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

module.exports = router;
