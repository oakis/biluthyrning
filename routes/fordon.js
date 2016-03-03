var express = require('express');
var router = express.Router();
var fs = require('fs');

// JSON
var bilar = './data/bilar.json';
var funktioner = './data/funktioner.json';

// Funktioner

checkIfExists = function (req, db) {
  var isItTrue;
  console.log(db[0].regnum)
  db.forEach(function(v,i){
    if (db[i].regnum == req.regnum) {
      isItTrue = true;
    }
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
		res.render('fordon', {funklista: newArr});
	})
});

router.post('/add', function(req, res, next) {
	var newArr = [];
	fs.readFile(bilar, function(err, data) {
		if (err) throw err;
		data = data.toString();
		var arr = data.split('*');
		arr.forEach(function(v,i){
			newArr.push(JSON.parse(arr[i]))
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
		if (checkIfExists(newCar, newArr) == true) {
			res.render('fordon', {
				carExists: 'En bil med regnummer "' + newCar.regnum + '" finns redan registrerad.',
				carErr: true,
				funklista: newArr
			})
		} else {
			fs.appendFile(bilar, send, function(err, data) {
				if (err) throw err;
				else console.log('SUCCESS MOTHERFUCKER: '+send);
				res.redirect('/fordon');
			})
		}
	})
})

router.post('/update', function(req, res, next) {
  res.render('fordon');
})

module.exports = router;
