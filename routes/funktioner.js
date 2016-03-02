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
	var newArr = [];
	fs.readFile(funktioner, function(err, data) {
		if (err) throw err;
		data = data.toString();
		var arr = data.split('*');
		arr.forEach(function(v,i){
			newArr.push(JSON.parse(arr[i]))
		})
		res.render('funktioner', {funklista: newArr});
	})
});

router.post('/add', function(req, res, next) {
	var newArr = [];
	fs.readFile(funktioner, function(err, data) {
		if (err) throw err;
		data = data.toString();
		var arr = data.split('*');
		arr.forEach(function(v,i){
			newArr.push(JSON.parse(arr[i]))
		})
		var newFunktion = {
			"id": newArr.length + 1,
			"name": req.body.name
		}
		var send = '\n*\n' + JSON.stringify(newFunktion,null,"\t");
		if (checkIfExist(newFunktion, newArr) == true) {
			console.log('Funktionen finns redan registrerad')
			res.render('funktioner', {
				funklista: newArr,
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
