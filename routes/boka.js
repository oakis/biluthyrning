var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');
var loadFile = require('../loadFile.js')


// JSON
var bilar = './data/bilar.json';
var funktioner = './data/funktioner.json';
var bokningar = './data/bokningar.json';

// Funktioner

function tillvalFix (req) { // Om bara ett tillval, gör om till en array med 1 index.
	var tillval = [];
	if (typeof req != 'undefined') {
		if (typeof req != 'string') {
			req.forEach(function(v,i){
				tillval.push(parseFloat(req[i]));
			})
		} else {
			tillval.push(parseFloat(req));
		}
	}
	return tillval;
}

function giveMeCar (needs,db,bokningar) {
	var regnummer;
	var valjBastBil = [];
	db.forEach(function(v,i){
		if (db[i].type == needs.type) { // kontrollera typ av bil
			var carMatch = '';
			// Kontrollerar tillvalen och ger en array med alla regnum som matchar
			needs.tillval.forEach(function(val,ind){
				if (db[i].tillval.indexOf(needs.tillval[ind]) != -1) {
					carMatch += 'y'; // tillval finns
				} else {
					carMatch += 'n'; // tillval finns ej
				}
			});
			if (carMatch.indexOf('n') == -1) { // om carMatch inte inne håller något n så sparas bilen i en array
				valjBastBil.push(db[i].regnum);
			}
		}
	});
	// Kontrollera att ingen bokning på passande bilar finns vid valt datum.
	valjBastBil.forEach(function(v,i){

			// --- user choose date from
			var user_from_year = needs.franDatum.substring(0,4);
			var user_from_month = needs.franDatum.substring(5,7) -1;
			var user_from_day = needs.franDatum.substring(8,10);
			var user_from_full_date = moment().set({'year': user_from_year,'month': user_from_month,'date': user_from_day});

			// --- booked date from
			var book_from_year = bokningar[i].franDatum.substring(0,4);
			var book_from_month = bokningar[i].franDatum.substring(5,7) -1;
			var book_from_day = bokningar[i].franDatum.substring(8,10);
			var book_from_full_date = moment().set({'year': book_from_year,'month': book_from_month,'date': book_from_day});

			// --- user date to
			var user_to_year = needs.tillDatum.substring(0,4);
			var user_to_month = needs.tillDatum.substring(5,7) -1;
			var user_to_day = needs.tillDatum.substring(8,10);
			var user_to_full_date = moment().set({'year': user_to_year,'month': user_to_month,'date': user_to_day});

			// --- booked date tom
			var book_to_year = bokningar[i].tillDatum.substring(0,4);
			var book_to_month = bokningar[i].tillDatum.substring(5,7) -1;
			var book_to_day = bokningar[i].tillDatum.substring(8,10);
			var book_to_full_date = moment().set({'year': book_to_year,'month': book_to_month,'date': book_to_day});

			// --------------- user choose time start---------
				// --- user choose from time
				var user_from_time = needs.franTid.substring(0,2);
				var user_from_min = needs.franTid.substring(3,7);
				var user_from_full_time = moment().set({'hour':user_from_time, 'minute':user_from_min});
				// --- user choose to time
				var user_to_time = needs.tillTid.substring(0,2);
				var user_to_min = needs.tillTid.substring(3,7);
				var user_to_full_time = moment().set({'hour':user_to_time, 'minute':user_to_min});


				// --- booked  from time
				var booked_from_time = bokningar[i].franTid.substring(0,2);
				var booked_from_min = bokningar[i].franTid.substring(3,7);
				var booked_from_full_time = moment().set({'hour':booked_from_time, 'minute':booked_from_min});
				// --- booked  to time
				var booked_to_time = bokningar[i].tillTid.substring(0,2);
				var booked_to_min = bokningar[i].tillTid.substring(3,7);
				var booked_to_full_time = moment().set({'hour':booked_to_time, 'minute':booked_to_min});
			// --------------- user choose time end---------


			if (user_from_full_date.isSameOrAfter(book_from_full_date) && user_to_full_date.isSameOrBefore(book_to_full_date)) {
				if (user_from_full_time.isSameOrAfter(booked_from_full_time) && user_to_full_time.isSameOrBefore(booked_to_full_time)) {
					console.log(valjBastBil[i] + ' går att boka!!!!!!!!!!!!!!!!!');
				} else {
					console.log(valjBastBil[i] + ' går EJ att boka');
				};
			} else {
				console.log(valjBastBil[i] + ' går att boka');
			}
	});
	console.log('\nEfter datum/tid kontroll:\n'+valjBastBil+'\n');
	//console.log(regnummer);
}

/*
 Lagra alla bilar som inte är bokade valt datum, sortera efter när den användes senast och
 returnera array[0]
 splice(valjBastBil.indexOf(nånting),1)
*/

/*
v Gör en matchning på vald biltyp (type)
v Gör en matchning på valda funktioner (tillval)
v Gör en matchning på från och till datum (fromDate - toDate)
v Gör en matching på från och till tid eller hela dagen
- Privat användning, utanför arbetstid endast (08.00-17.00)
- Ändra status på första lediga fordon med inmatad information
- Visa en bekräftelse av bokningen
*/


/* GET home page. */
router.get('/', function(req, res, next) {
  loadFile(funktioner, renderPage);
  function renderPage (data) {
  	res.render('boka', {
    	funklista : data
  	});
  }
});



/* BOKA BIL */
router.post('/', function(req, res, next) {

	var carNeeds = {
		'type': req.body.type,
		'franDatum': req.body.franDatum,
		'franTid': req.body.franTid,
		'tillDatum': req.body.tillDatum,
		'tillTid': req.body.tillTid,
		'tillval': tillvalFix(req.body.tillval),
		'privat': req.body.privat
	}

  var carArr = [];
  fs.readFile(bilar, function(err, data) {
    if (err) throw err;
    data = data.toString();
    var arr = data.split('*');
    arr.forEach(function(v, i) {
      carArr.push(JSON.parse(arr[i]));
    });
    var bokArr = [];
    fs.readFile(bokningar, function(err, data) {
	    if (err) throw err;
	    data = data.toString();
	    var arr = data.split('*');
	    arr.forEach(function(v, i) {
	      bokArr.push(JSON.parse(arr[i]));
	    });
	    giveMeCar(carNeeds,carArr,bokArr); // kontr vilken bil som passar bäst och returnera regnum.
	  });
  });


	loadFile(funktioner, renderPage);
  function renderPage (data) {
  	res.render('boka', {
    	funklista : data
  	});
  }
});

module.exports = router;
