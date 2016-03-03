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
  });
  return isItTrue;
};



/* GET home page. */

router.post('/',function(req,res){
  var search_text = "";
  var file = __dirname + '/../data/bilar.json';
  /*bilar = {};*/
  var bilar = './data/bilar.json';
  var newArr = [];

    fs.readFile(bilar, function(err, data) {
      if (err) throw err;
      data = data.toString();
      var arr = data.split('*');
      arr.forEach(function(v, i) {
        newArr.push(JSON.parse(arr[i]));
      });
      /* -------------- */

      /* ------------- */


      for(var i = 0;i < newArr.length;i++) {
          if(newArr[i].regnum == search_text) {
            console.log('match');
            ny_bil = {};
            ny_bil = {
              "regnum": newArr[i].regnum,
              "brand": newArr[i].brand,
              "model": newArr[i].model,
              "type": newArr[i].type,
              "year": newArr[i].year,
              "passenger": newArr[i].passenger
            };
            console.log(typeof ny_bil);
            var funkArr = [];
          	fs.readFile(funktioner, function(err, data) {
          		if (err) throw err;
          		data = data.toString();
          		var arr = data.split('*');
          		arr.forEach(function(v,i){
          			funkArr.push(JSON.parse(arr[i]));
          		});

              res.render('fordon',{
                'bilar': ny_bil,
                'funklista': funkArr
              });
              console.log(funkArr);
          	});


            console.log(ny_bil);



          }
          else {
            console.log('no match');
            /*res.render('fordon',{
              'error': true
            });*/
          }

      }
      console.log();
      /*console.log(newArr[1].regnum);*/
    });

  search_text = req.body.search_text;
  /*console.log("last : " + search_text);*/
  console.log('-----------------');
  /*console.log(search_text);*/





});

router.get('/', function(req, res, next) {

    ny_bil = {};
    ny_bil = {
      "regnum": "",
      "brand":  "",
      "model":  "",
      "type":  "",
      "year":  "",
      "passenger":  ""
    };


	var funkArr = [];
	fs.readFile(funktioner, function(err, data) {
		if (err) throw err;
		data = data.toString();
		var arr = data.split('*');
		arr.forEach(function(v,i){
			funkArr.push(JSON.parse(arr[i]));
		});
    console.log(funkArr);
		res.render('fordon', {funklista: funkArr,'bilar': ny_bil});
	});

});

router.post('/add', function(req, res, next) {
	var carArr = [];
	var funkArr = [];
	fs.readFile(bilar, function(err, data) {
		if (err) throw err;
		data = data.toString();
		var arr = data.split('*');
		arr.forEach(function(v,i){
			carArr.push(JSON.parse(arr[i]));
		});
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
		};
		var send = '\n*\n' + JSON.stringify(newCar,null,"\t");
		if (checkIfExists(newCar, carArr) === true) {
			fs.readFile(funktioner, function(err, data) {
				if (err) throw err;
				data = data.toString();
				var arr = data.split('*');
				arr.forEach(function(v,i){
					funkArr.push(JSON.parse(arr[i]));
				});
				ny_bil = {
		      "regnum": "",
		      "brand":  "",
		      "model":  "",
		      "type":  "",
		      "year":  "",
		      "passenger":  ""
		    };
				res.render('fordon', {
					carExists: 'En bil med regnummer "' + newCar.regnum + '" finns redan registrerad.',
					carErr: true,
					funklista: funkArr,
					bilar: ny_bil
				});
			});
		} else {
			fs.appendFile(bilar, send, function(err, data) {
				/*if (err) throw err;
				else console.log('SUCCESS MOTHERFUCKER: '+send);*/
				fs.readFile(funktioner, function(err, data) {
					if (err) throw err;
					data = data.toString();
					var arr = data.split('*');
					arr.forEach(function(v,i){
						funkArr.push(JSON.parse(arr[i]));
					});
					ny_bil = {
			      "regnum": "",
			      "brand":  "",
			      "model":  "",
			      "type":  "",
			      "year":  "",
			      "passenger":  ""
			    };
					res.render('fordon', {
						carAdded: 'Bilen med regnummer "' + newCar.regnum + '" registrerades utan problem.',
						carAdd: true,
						funklista: funkArr,
						bilar: ny_bil
					});
				});
			});
		}
	});
});

router.post('/update', function(req, res, next) {
  res.render('fordon');
});

module.exports = router;
