var express = require('express');
var router = express.Router();
var fs = require('fs');

// JSON
var bilar = './data/bilar.json';
var funktioner = './data/funktioner.json';

// Funktioner

checkIfExists = function (req, db) {
  var isItTrue;
  db.forEach(function(v,i){
    if (db[i].regnum == req.regnum) {
      isItTrue = true;
    }
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
		res.render('fordon', {funklista: funkArr});
	})
});

router.post('/add', function(req, res, next) {
	var carArr = [];
	var funkArr = [];
	fs.readFile(bilar, function(err, data) {
		if (err) throw err;
		data = data.toString();
		var arr = data.split('*');
		arr.forEach(function(v,i){
			carArr.push(JSON.parse(arr[i]))
		})
		var newCar = {
			"regnum": req.body.regnum.toUpperCase(),
			"brand": req.body.brand,
			"model": req.body.model,
			"type": req.body.type,
			"year": req.body.year,
			"passenger": req.body.passenger,
			"tillval": req.body.tillval,
			"service": req.body.service,
			"serviceDate": req.body.serviceDate
		}
		var send = '\n*\n' + JSON.stringify(newCar,null,"\t");
		if (checkIfExists(newCar, carArr) == true) {
			fs.readFile(funktioner, function(err, data) {
				if (err) throw err;
				data = data.toString();
				var arr = data.split('*');
				arr.forEach(function(v,i){
					funkArr.push(JSON.parse(arr[i]))
				})
				res.render('fordon', {
					carExists: 'En bil med regnummer "' + newCar.regnum + '" finns redan registrerad.',
					carErr: true,
					funklista: funkArr
				})
			})
		} else {
			fs.appendFile(bilar, send, function(err, data) {
				/*if (err) throw err;
				else console.log('SUCCESS MOTHERFUCKER: '+send);*/
				fs.readFile(funktioner, function(err, data) {
					if (err) throw err;
					data = data.toString();
					var arr = data.split('*');
					arr.forEach(function(v,i){
						funkArr.push(JSON.parse(arr[i]))
					})
					res.render('fordon', {
						carAdded: 'Bilen med regnummer "' + newCar.regnum + '" registrerades utan problem.',
						carAdd: true,
						funklista: funkArr
					})
				})
			})
		}
	})
})

router.post('/update', function(req, res, next) {
  res.render('fordon');
})

module.exports = router;
