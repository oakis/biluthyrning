var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');
var f = require('../functions.js');
var loadFile = require('../loadFile.js');
var appendFile = require('../appendFile.js');
var writeFile = require('../writeFile.js');

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

function objectFindByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return "no match";
}

function checkBesikt (array) {
  var besikt_bilar = [];
  array.forEach(function(v, i) {
    //dagens år, månad och dag
    var today_year = moment();
    //bilens sista siffra minus 1 månad
    var car_reg_full = array[i];
    var car_reg = car_reg_full.regnum.charAt(5) - 1;
    //bilens datum
    var car_date = moment().set({'year': (moment().get('year')), 'month': car_reg, 'date':1});
    //bilens från datum
    var car_date_from = moment(car_date).subtract(2, 'months').startOf('month');
    //bilens till datum
    var car_date_after = moment(car_date).add(2, 'months').endOf('month');
    var car_is_before =  moment(car_date).subtract(2, 'months').startOf('month');
    var car_is_after =  moment(car_date).add(2, 'months').endOf('month');
    // Om bilen snart behöver besiktigas, skicka till array som sen skickas till render
    if (car_is_before.isBefore(today_year) && car_is_after.isAfter(today_year)) {
      besikt_bilar.push(car_reg_full);
    }
  });
  return besikt_bilar;
}

var empty_car = {
  "regnum": "",
  "brand": "",
  "model": "",
  "type": "",
  "year": "",
  "passenger": "",
  "tillval": [],
  "service": "",
  "serviceDate": "",
  "lastBooked": ""
};

/* LOAD PAGE */
router.get('/', function(req, res, next) {
  loadFile(funktioner, loadNext);
  function loadNext (funkArr) {
    loadFile(bilar, doStuff);
    function doStuff (carArr) {
      res.render('fordon', {
        'funklista': funkArr,
        'bilar': empty_car,
        'besikt_bilar' : checkBesikt(carArr)
      });
    };
  };
});

/* SEARCH CAR */
router.post('/', function(req, res, next) {
  var search_text = req.body.search_text.toUpperCase();

  loadFile(bilar, loadFunk);
  function loadFunk (carArr) {
    loadFile(funktioner, doStuff);
    function doStuff (funkArr) {
      var findCar = objectFindByKey(carArr, 'regnum', search_text);
      if(search_text == findCar.regnum) {
        var ny_bil = {
          "regnum": findCar.regnum,
          "brand": findCar.brand,
          "model": findCar.model,
          "type": findCar.type,
          "year": findCar.year,
          "passenger": findCar.passenger,
          "tillval" : f.tillvalFix(findCar.tillval),
          "service": findCar.service,
          "serviceDate": findCar.serviceDate,
          "inspection": findCar.inspection,
          "inspectionDate": findCar.inspectionDate,
          "lastBooked": findCar.lastBooked
        };
      } else {
        var ny_bil = {
          "regnum": "Not found",
          "brand": "",
          "model": "",
          "type": "",
          "year": "",
          "passenger": "",
          "tillval" : [],
          "service": "",
          "serviceDate": "",
          "inspection": "",
          "inspectionDate": "",
          "lastBooked": ""
        };
      }
      res.render('fordon', {
        'bilar': ny_bil,
        'funklista': funkArr,
        'besikt_bilar': checkBesikt(carArr)
      });
      }
    };
});

/* ADD CAR */
router.post('/add', function(req, res, next) {
  loadFile(bilar, loadNext);
  function loadNext (carArr) {
    var newCar = {
      "regnum": req.body.regnum.toUpperCase(),
      "brand": req.body.brand,
      "model": req.body.model,
      "type": req.body.type,
      "year": req.body.year,
      "passenger": req.body.passenger,
      "tillval": f.tillvalFix(req.body.tillval),
      "service": req.body.service,
      "serviceDate": req.body.serviceDate,
      "inspection": "",
      "inspectionDate": "",
      "lastBooked": ""
    };
    if (checkIfExists(newCar, carArr) === true) {
      loadFile(funktioner, errorPage);
      function errorPage (funkArr) {
        res.render('fordon', {
          carExists: 'En bil med regnummer "' + newCar.regnum + '" finns redan registrerad.',
          carErr: true,
          funklista: funkArr,
          bilar: empty_car,
          besikt_bilar: checkBesikt(carArr)
        });
      }
    } else {
      if (typeof newCar.tillval == 'undefined') {
        newCar.tillval = [];
      }
      if (typeof newCar.service == 'undefined') {
        newCar.service = "off";
      }
      appendFile(bilar, newCar);
      loadFile(funktioner, successPage);
      function successPage (funkArr) {
        res.render('fordon', {
          carAdded: 'Bilen med regnummer "' + newCar.regnum + '" registrerades utan problem.',
          carAdd: true,
          funklista: funkArr,
          bilar: empty_car,
          besikt_bilar: checkBesikt(carArr)
        });
      }
    }
  }
});

/* UPDATE CAR */
router.post('/update', function(req, res, next) {
  loadFile(bilar, doStuff);
  function doStuff (carArr) {
    for(i = 0; i < carArr.length; i++){
      if(carArr[i].regnum == req.body.regnum) {

        carArr[i].regnum = req.body.regnum;
        carArr[i].brand = req.body.brand;
        carArr[i].model = req.body.model;
        carArr[i].type = req.body.type;
        carArr[i].year = req.body.year;
        carArr[i].passenger = req.body.passenger;
        carArr[i].tillval  = f.tillvalFix(req.body.tillval);
        carArr[i].service = req.body.service;
        carArr[i].serviceDate = req.body.serviceDate;
        carArr[i].inspection = req.body.inspection;
        carArr[i].inspectionDate = req.body.inspectionDate;
        carArr[i].lastBooked = req.body.lastBooked;
      }
    }
    var updateCar = "";
    carArr.forEach(function(v,i){
      updateCar += JSON.stringify(carArr[i], null, "\t") + '\n*\n';
    })
    updateCar = updateCar.slice(0, -3);
    writeFile(bilar, updateCar, function(){
      loadFile(funktioner, renderPage);
      function renderPage (funkArr) {
        res.render('fordon', {
          bilar: empty_car,
          funklista: funkArr,
          besikt_bilar : checkBesikt(carArr)
        });
      }
    });
  }
});


/* DELETE CAR */
router.post('/remove', function(req, res, next) {
  loadFile(bilar, doStuff);
  function doStuff (carArr) {
    for(i = 0; i < carArr.length; i++){
      if (carArr[i].regnum == req.body.regnum) {
        carArr.splice(i,1);
      }
    }
    var deleteCar = "";
    carArr.forEach(function(v,i){
      deleteCar += JSON.stringify(carArr[i], null, "\t") + '\n*\n';
    })
    deleteCar = deleteCar.slice(0, -3);
    writeFile(bilar, deleteCar, loadFunk);
    function loadFunk () {
      loadFile(funktioner, renderPage);
      function renderPage (funkArr) {
        res.render('fordon', {
          bilar: empty_car,
          funklista: funkArr,
          besikt_bilar : checkBesikt(carArr)
        });
      }
    }
  }
});


module.exports = router;
