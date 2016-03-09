var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');

// JSON
var bilar = './data/bilar.json';
var funktioner = './data/funktioner.json';

// Funktioner

checkIfExists = function(req, db) {
  var isItTrue;
  db.forEach(function(v, i) {
    if (db[i].regnum == req.regnum) {
      isItTrue = true;
    }
  });
  return isItTrue;
};



/* GET home page. */

router.post('/', function(req, res) {
  var search_text = "";
  var file = __dirname + '/../data/bilar.json';
  /*bilar = {};*/
  var bilar = './data/bilar.json';
  var newArr = [];

  var besikt_bilar = [];
  /* ----- besiktnings information ----- */
  fs.readFile(bilar, function(err, data) {
    if (err) throw err;
    data = data.toString();
    var arr = data.split('*');
    arr.forEach(function(v, i) {
      besikt_bilar.push(JSON.parse(arr[i]));
    });


  });



  fs.readFile(bilar, function(err, data) {
    if (err) throw err;
    data = data.toString();
    var arr = data.split('*');
    arr.forEach(function(v, i) {
      newArr.push(JSON.parse(arr[i]));
    });


    var funkArr = [];
    /* var empty_search = "no search"; */
    for (var i = 0; i < newArr.length; i++) {
      if (search_text === "") {
        funkArr = [];
        ny_bil = {};
        ny_bil = {
          "regnum": "Empty search",
          "brand": "",
          "model": "",
          "type": "",
          "year": "",
          "passenger": "",
          "service": "",
          "serviceDate": ""
        };


        /*console.log(empty_search);

        res.render('fordon',{
          'bilar': ny_bil,
          'funklista': funkArr,
          'no_search' : empty_search
        });*/
        } else if (newArr[i].regnum == search_text) {
          console.log('match');
          ny_bil = {};
          ny_bil = {
            "regnum": newArr[i].regnum,
            "brand": newArr[i].brand,
            "model": newArr[i].model,
            "type": newArr[i].type,
            "year": newArr[i].year,
            "passenger": newArr[i].passenger,
            "service": newArr[i].service,
            "serviceDate": newArr[i].serviceDate
          };
          console.log(typeof ny_bil);
          funkArr = [];
          fs.readFile(funktioner, function(err, data) {
            if (err) throw err;
            data = data.toString();
            var arr = data.split('*');
            arr.forEach(function(v, i) {
              funkArr.push(JSON.parse(arr[i]));
            });

            /*res.render('fordon', {
              'bilar': ny_bil,
              'funklista': funkArr
            });*/

            console.log(funkArr);
          });
          console.log(ny_bil);
        } else {
          console.log('no match');
          funkArr = [];
          ny_bil = {};
          ny_bil = {
            "regnum": "no match",
            "brand": "",
            "model": "",
            "type": "",
            "year": "",
            "passenger": "",
            "service": "",
            "serviceDate": ""
          };
          /*res.render('fordon',{
            'error': true
          });*/
        }
        res.render('fordon', {
          'bilar': ny_bil,
          'funklista': funkArr,
          'no_search' : "Empty search",
          'besikt_bilar': besikt_bilar
        });
      }


    /*console.log(newArr[1].regnum);*/
  });

  search_text = req.body.search_text.toUpperCase();
  /*console.log("last : " + search_text);*/

  /*console.log(search_text);*/





});

router.get('/', function(req, res, next) {

/* ---------- read file ------ */
  var inspection = './data/bilar.json';
  var besikt_bilar = [];
  var data1 = [];
  var arr;
  var aallArr;
  // ------------ ---------------- ------------


  // ------------ ---------------- ------------


  ny_bil = {};
  ny_bil = {
    "regnum": "",
    "brand": "",
    "model": "",
    "type": "",
    "year": "",
    "passenger": "",
    "service": "",
    "serviceDate": ""
  };


  var funkArr = [];
  fs.readFile(funktioner, function(err, data) {
    if (err) throw err;
    data = data.toString();
    var arr = data.split('*');
    arr.forEach(function(v, i) {
      funkArr.push(JSON.parse(arr[i]));
    });
    /*console.log("------- line 173------");
    console.log(besikt_bilar);*/
    fs.readFile(inspection, function(err, data) {
      if (err) throw err;
      data = data.toString();
      var arr = data.split('*');
      arr.forEach(function(v, i) {

        //dagens år, månad och dag
        var today_year = moment();
        //bilens sista siffra minus 1 månad
        var car_reg_full = JSON.parse(arr[i]);
        console.log(typeof car_reg_full);
        console.log("#######  car_reg_full");
        console.log(car_reg_full);
        var car_reg = car_reg_full.regnum.charAt(5) - 1;
        console.log("#######  car_reg");
        console.log(car_reg);
        //bilens datum
        var car_date = moment().set({'year': (moment().get('year')), 'month': car_reg, 'date':1});
        //bilens från datum
        var car_date_from = moment(car_date).subtract(2, 'months').startOf('month');
        //bilens till datum
        var car_date_after = moment(car_date).add(2, 'months').endOf('month');
        var car_is_before =  moment(car_date).subtract(2, 'months').startOf('month');
        var car_is_after =  moment(car_date).add(2, 'months').endOf('month');

        console.log("-------- today month mars");
        console.log(today_year.format('YYYY-MM-DD'));
        console.log("-------- car date");
        console.log(car_date.format('YYYY-MM-DD'));
        console.log("-------- two months before today month mars is december");
        console.log(car_date_from.format('YYYY-MM-DD'));
        console.log("-------- two months after today month mars is december");
        console.log(car_date_after.format('YYYY-MM-DD'));

        if (car_is_before.isBefore(today_year) && car_is_after.isAfter(today_year)) {
          besikt_bilar.push(car_reg_full);
          console.log("this will be shown in march");
        } else {
          console.log("sorry, not this month");
          console.log("this will not be shown in march");
        }
        /* ----------   inspection section end ------*/
      });
      res.render('fordon', {
        funklista : funkArr,
        'bilar': ny_bil,
        'besikt_bilar' : besikt_bilar

      });
    });
  });
});



router.post('/add', function(req, res, next) {

  var carArr = [];
  var funkArr = [];
  fs.readFile(bilar, function(err, data) {
    if (err) throw err;
    data = data.toString();
    var arr = data.split('*');
    arr.forEach(function(v, i) {
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
    var send = '\n*\n' + JSON.stringify(newCar, null, "\t");
    if (checkIfExists(newCar, carArr) === true) {
      fs.readFile(funktioner, function(err, data) {
        if (err) throw err;
        data = data.toString();
        var arr = data.split('*');
        arr.forEach(function(v, i) {
          funkArr.push(JSON.parse(arr[i]));
        });
        ny_bil = {
          "regnum": "",
          "brand": "",
          "model": "",
          "type": "",
          "year": "",
          "passenger": "",
          "service": "",
          "serviceDate": ""
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
          arr.forEach(function(v, i) {
            funkArr.push(JSON.parse(arr[i]));
          });
          ny_bil = {
            "regnum": "",
            "brand": "",
            "model": "",
            "type": "",
            "year": "",
            "passenger": "",
            "service": "",
            "serviceDate": ""
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
  console.log("oooooooooooooooooooooooooo");
  console.log("Button update is pressed");

  var bilar = './data/bilar.json';
  var newArr = {};
  var regnum = req.body.regnum;

  console.log("update");
  res.render('fordon');
});




router.post('/remove', function(req, res, next) {
  console.log("oooooooooooooooooooooooooo");
  console.log("Button delete is pressed");
  res.render('fordon');
});

module.exports = router;
