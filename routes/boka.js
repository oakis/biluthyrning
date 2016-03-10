var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');
var loadFile = require('../loadFile.js');
var f = require('../functions.js');
var appendFile = require('../appendFile.js');
var writeFile = require('../writeFile.js');


// JSON
var bilar = './data/bilar.json';
var funktioner = './data/funktioner.json';
var bookings = './data/bokningar.json';

function giveMeCar (needs,db,bokningar) {
	var regnummer;
	var valjBastBil = [];
	var valjBastBil_next_step = [];
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
		var carMatch = '';
		console.log('------------ valjBastBil loop start ------------');
		bokningar.forEach(function(val,ind){
			console.log('<<<<<<<<<<<<< bokningar loop start >>>>>>>>>>>>>>>');
			// Om regnum i valjBastBil[i] finns i bokningar[ind].regnum, kontrollera tider
			if (valjBastBil[i] == bokningar[ind].regnum) {

				// --- user choose date from
				var user_from_year = needs.franDatum.substring(0,4);
				var user_from_month = needs.franDatum.substring(5,7) -1;
				var user_from_day = needs.franDatum.substring(8,10);
				var user_from_full_date = moment().set({'year': user_from_year,'month': user_from_month,'date': user_from_day});

				// --- booked date from
				var book_from_year = bokningar[ind].franDatum.substring(0,4);
				var book_from_month = bokningar[ind].franDatum.substring(5,7) -1;
				var book_from_day = bokningar[ind].franDatum.substring(8,10);
				var book_from_full_date = moment().set({'year': book_from_year,'month': book_from_month,'date': book_from_day});

				// --- user date to
				var user_to_year = needs.tillDatum.substring(0,4);
				var user_to_month = needs.tillDatum.substring(5,7) -1;
				var user_to_day = needs.tillDatum.substring(8,10);
				var user_to_full_date = moment().set({'year': user_to_year,'month': user_to_month,'date': user_to_day});

				// --- booked date tom
				var book_to_year = bokningar[ind].tillDatum.substring(0,4);
				var book_to_month = bokningar[ind].tillDatum.substring(5,7) -1;
				var book_to_day = bokningar[ind].tillDatum.substring(8,10);
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
				var booked_from_time = bokningar[ind].franTid.substring(0,2);
				var booked_from_min = bokningar[ind].franTid.substring(3,7);
				var booked_from_full_time = moment().set({'hour':booked_from_time, 'minute':booked_from_min});
				// --- booked  to time
				var booked_to_time = bokningar[ind].tillTid.substring(0,2);
				var booked_to_min = bokningar[ind].tillTid.substring(3,7);
				var booked_to_full_time = moment().set({'hour':booked_to_time, 'minute':booked_to_min});
				// --------------- user choose time end---------
				/*function isPrivat () {
					if (needs.privat == 'on') {
						if (moment(user_from_full_date).format('dddd') != 'Saturday' ||
								moment(user_from_full_date).format('dddd') != 'Sunday' ||
							  moment(user_to_full_date).format('dddd') != 'Saturday' ||
								moment(user_to_full_date).format('dddd') != 'Sunday') {
							  // ^ Om det inte är helg - Kontrollera att bokning går utanför arbetstid

						} else {
							console.log('Bokning är inte på helgdag')
						}
					}
				}

				privat bokning:

				till < 08:00 || > 17:00
				från < 08:00 || > 17:00*/

				if (user_from_full_date.isSameOrAfter(book_from_full_date) && user_to_full_date.isSameOrBefore(book_to_full_date)) {
					if (user_from_full_time.isSameOrAfter(booked_from_full_time) && user_to_full_time.isSameOrBefore(booked_to_full_time)) {
						carMatch += 'y';
					} else {
						carMatch += 'n';
					}
				} else {
					carMatch += 'y';
				}
			}
		});
		console.log(carMatch);
		if (carMatch.indexOf('n') == -1) { // om carMatch inte inne håller något n så sparas bilen i en array
				valjBastBil_next_step.push(valjBastBil[i]);
		}
	});
	loadFile(bilar, chooseBestCar);
	function chooseBestCar (cars) {
		cars.sort(f.sortArr('lastBooked')); // Sortera array efter senast bokad
		var newBooking = {
			'id': bokningar[bokningar.length -1].id + 1,
			'regnum': cars[0].regnum, // Ta första bilen i sorterade arrayen (stått still längst)
			'franDatum': needs.franDatum,
			'franTid': needs.franTid,
			'tillDatum': needs.tillDatum,
			'tillTid': needs.tillTid,
			'username': needs.username,
			'privat': needs.privat
		}
		appendFile(bookings, newBooking);
	}
}

/* GET home page. */
router.get('/', function(req, res, next) {
  loadFile(funktioner, loadNext);
  function loadNext (data) {
  	loadFile(bookings, renderPage);
	  function renderPage (books) {
	  	var userBooks = [];
	  	books.forEach(function(v,i){
	  		if (req.query.username == books[i].username) {	
	  			userBooks.push(books[i]);
	  		}
	  	});
	  	data.sort(f.sortArr('name'));
	  	res.render('boka', {
	    	funklista: data,
	    	boklista: userBooks,
	    	username: req.query.username
	  	});
  	}
  }
});

router.post('/delete', function(req, res, next) {
	loadFile(bookings, deleteBook);
		function deleteBook (bookArr) {
			bookArr.forEach(function(v,i){
				if (bookArr[i].id == req.body.id) {
					bookArr.splice(bookArr.indexOf(bookArr[i]),1);
				};
			});
			var send = f.stringifyBook(bookArr);
			writeFile(bookings, send);
			res.redirect('/boka?username=' + req.body.username);
		}
})

/* BOKA BIL */
router.post('/', function(req, res, next) {

		var carNeeds = {
			'type': req.body.type,
			'franDatum': req.body.franDatum,
			'franTid': req.body.franTid,
			'tillDatum': req.body.tillDatum,
			'tillTid': req.body.tillTid,
			'tillval': f.tillvalFix(req.body.tillval),
			'username': req.body.username,
			'privat': req.body.privat
		};

	  var carArr = [];
	  fs.readFile(bilar, function(err, data) {
	    if (err) throw err;
	    data = data.toString();
	    var arr = data.split('*');
	    arr.forEach(function(v, i) {
	      carArr.push(JSON.parse(arr[i]));
	    });
	    var bokArr = [];
	    fs.readFile(bookings, function(err, data) {
		    if (err) throw err;
		    data = data.toString();
		    var arr = data.split('*');
		    arr.forEach(function(v, i) {
		      bokArr.push(JSON.parse(arr[i]));
		    });
		    giveMeCar(carNeeds,carArr,bokArr); // kontr vilken bil som passar bäst och returnera regnum.
		  });
	  });
		loadFile(funktioner, loadNext);
	  function loadNext (data) {
	  	loadFile(bookings, renderPage);
		  function renderPage (books) {
		  	var userBooks = [];
		  	books.forEach(function(v,i){
		  		if (req.body.username == books[i].username) {	
		  			userBooks.push(books[i]);
		  		}
		  	});
		  	data.sort(f.sortArr('name'));
		  	res.render('boka', {
		    	funklista: data,
		    	boklista: userBooks,
		    	username: req.body.username,
		    	carBooked: true
		  	});
	  	}
	  }
});

module.exports = router;