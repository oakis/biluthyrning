var express = require('express');
var router = express.Router();
var fs = require('fs');
var loadFile = require('../loadFile.js')
var f = require('../functions.js')


var funktioner = './data/funktioner.json';


/* GET home page. */
router.get('/', function(req, res, next) {
  loadFile(funktioner, renderPage);
  function renderPage (data) {
  	data.sort(f.sortArr('name')); // Sortera efter 'name' innan arrayen skickas till render
  	res.render('funktioner', {
    	funklista : data
  	});
  }
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
		funkArr.sort(f.sortArr('name')); // Sortera efter 'name' innan arrayen skickas till render
		var send = '\n*\n' + JSON.stringify(newFunktion,null,"\t");
		if (f.checkIfExist(newFunktion, funkArr) == true) {
			console.log('Funktionen finns redan registrerad')
			res.render('funktioner', {
				funklista: funkArr.sort(f.sortArr('name')), // Sortera efter 'name' innan arrayen skickas till render
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

		merged.sort(f.sortArrNum('id'));
		funkArr.sort(f.sortArr('name'));
		
		var funkObj = {
			'merged': merged,
			'deleteId': req.body.deleteId
		}

		var send = f.stringify(f.updateFunk(funkObj));
		
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
					funklista: funkArr.sort(f.sortArr('name')), // Sortera efter 'name' innan arrayen skickas till render
					funkAdded: 'Funktioner uppdaterade.',
					funkAdd: true
				})
      });
    });
  });
})

module.exports = router;
