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
				}
			});
			var send = f.stringifyBook(bookArr);
			writeFile(bookings, send);
			res.redirect('/boka?username=' + req.body.username);
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
			'tillval': f.tillvalFix(req.body.tillval),
			'username': req.body.username,
			'privat': req.body.privat
		};

		loadFile(bilar, loadBookings);
		function loadBookings (carArr) {
			carArr.sort(f.sortArr('lastBooked')); // Sortera array efter senast bokad
			loadFile(bookings, getCar);
			function getCar (bokArr) {
				// kontr vilken bil som passar bäst och returnera regnum om bokningen gick igenom, annars false.
				var isItBooked;
				var valjBastBil = [];
				var valjBastBil_next_step = [];
				carArr.forEach(function(v,i){
					if (carArr[i].type == carNeeds.type) { // kontrollera typ av bil
						var carMatch = '';
						// Kontrollerar tillvalen och ger en array med alla regnum som matchar
						carNeeds.tillval.forEach(function(val,ind){
							if (carArr[i].tillval.indexOf(carNeeds.tillval[ind]) != -1) {
								carMatch += 'y'; // tillval finns
							} else {
								carMatch += 'n'; // tillval finns ej
							}
						});
						if (carMatch.indexOf('n') == -1) { // om carMatch inte inne håller något n så sparas bilen i en array
							valjBastBil.push(carArr[i].regnum);
						}
					}
				});
				// Kontrollera att ingen bokning på passande bilar finns vid valt datum.
				valjBastBil.forEach(function(v,i){
					var carMatch = '';
					bokArr.forEach(function(val,ind){
						// Om regnum i valjBastBil[i] finns i bokArr[ind].regnum, kontrollera tider
						if (valjBastBil[i] == bokArr[ind].regnum) {


              // --- user choose date from
							var user_from_year = carNeeds.franDatum.substring(0,4);
							var user_from_month = carNeeds.franDatum.substring(5,7) -1;
							var user_from_day = carNeeds.franDatum.substring(8,10);
							var user_from_full_date = moment().set({'year': user_from_year,'month': user_from_month,'date': user_from_day});

              // --- user date to
							var user_to_year = carNeeds.tillDatum.substring(0,4);
							var user_to_month = carNeeds.tillDatum.substring(5,7) -1;
							var user_to_day = carNeeds.tillDatum.substring(8,10);
							var user_to_full_date = moment().set({'year': user_to_year,'month': user_to_month,'date': user_to_day});
              // --- user choose from time
              var user_from_time = carNeeds.franTid.substring(0,2);
              var user_from_min = carNeeds.franTid.substring(3,7);
              var user_from_full_time = moment().set({'hour':user_from_time, 'minute':user_from_min});
              // --- user choose to time
              var user_to_time = carNeeds.tillTid.substring(0,2);
              var user_to_min = carNeeds.tillTid.substring(3,7);
              var user_to_full_time = moment().set({'hour':user_to_time, 'minute':user_to_min});

              //full time and date
              var user_from_full_time_and_date = moment().set({'year':user_from_year, 'month':user_from_month,'date':user_from_day,'hour':user_from_time, 'minute':user_from_min});
              var user_to_full_time_and_date = moment().set({'year':user_to_year, 'month':user_to_month,'date':user_to_day,'hour':user_to_time, 'minute':user_to_min});




							// --- booked date from
							var book_from_year = bokArr[ind].franDatum.substring(0,4);
							var book_from_month = bokArr[ind].franDatum.substring(5,7) -1;
							var book_from_day = bokArr[ind].franDatum.substring(8,10);
							var book_from_full_date = moment().set({'year': book_from_year,'month': book_from_month,'date': book_from_day});

							// --- booked date tom
							var book_to_year = bokArr[ind].tillDatum.substring(0,4);
							var book_to_month = bokArr[ind].tillDatum.substring(5,7) -1;
							var book_to_day = bokArr[ind].tillDatum.substring(8,10);
							var book_to_full_date = moment().set({'year': book_to_year,'month': book_to_month,'date': book_to_day});


							// --- booked  from time
							var book_from_time = bokArr[ind].franTid.substring(0,2);
							var book_from_min = bokArr[ind].franTid.substring(3,7);
							var book_from_full_time = moment().set({'hour':book_from_time, 'minute':book_from_min});
							// --- booked  to time
							var book_to_time = bokArr[ind].tillTid.substring(0,2);
							var book_to_min = bokArr[ind].tillTid.substring(3,7);
							var book_to_full_time = moment().set({'hour':book_to_time, 'minute':book_to_min});


              //full time and date
              var booked_from_full_time_and_date = moment().set({'year':book_from_year, 'month':book_from_month,'date':book_from_day,'hour':book_from_time, 'minute':book_from_min});
              var booked_to_full_time_and_date = moment().set({'year':book_to_year, 'month':book_to_month,'date':book_to_day,'hour':book_to_time, 'minute':book_to_min});

              console.log(" ----- user from full time and date");
              console.log(user_from_full_time_and_date.format("YYYY-MM-DD HH:mm"));

              console.log(" ----- user to full time and date");
              console.log(user_to_full_time_and_date.format("YYYY-MM-DD HH:mm"));

              console.log(" ----- booked from full time and date");
              console.log(booked_from_full_time_and_date.format("YYYY-MM-DD HH:mm"));

              console.log(" ----- booked to full time and date");
              console.log(booked_to_full_time_and_date.format("YYYY-MM-DD HH:mm"));
              console.log("booked--------------------------");
              console.log(booked_from_full_time_and_date.format("YYYY-MM-DD HH:mm"));



							// --------------- user choose time end---------
              if(user_from_full_time_and_date.isSameOrAfter(booked_from_full_time_and_date) && user_to_full_time_and_date.isSameOrAfter(booked_to_full_time_and_date)) {

                carMatch += 'y';
                console.log("Bil reg num--------------------------");
                console.log("bil reg num");
                console.log(bokArr[ind].regnum);
                console.log(bokArr[ind].tillDatum);
                console.log(bokArr[ind].tillTid);

                console.log("you can book it");

              } else {
                console.log("Bil reg num--------------------------");
                console.log("bil reg num");
                console.log(bokArr[ind].regnum);
                console.log(bokArr[ind].tillDatum);
                console.log(bokArr[ind].tillTid);

                console.log("you cant book it");
                carMatch += 'n';
              }

							/*if (user_from_full_date.isSameOrAfter(book_from_full_date) && user_to_full_date.isSameOrBefore(book_to_full_date)) {
								if (user_from_full_time.isSameOrAfter(booked_from_full_time) && user_to_full_time.isSameOrBefore(booked_to_full_time)) {
									carMatch += 'y';
								} else {
									carMatch += 'n';
								}
							} else {
								carMatch += 'y';// här
							}*/
						}
					});
					console.log(carMatch);
					if (carMatch.indexOf('n') == -1) { // om carMatch inte inne håller något n så sparas bilen i en array
							valjBastBil_next_step.push(valjBastBil[i]);
					}
				});
				if (valjBastBil_next_step.length < 1) {
					isItBooked = false;
				} else {
					isItBooked = true;
				}
				if (isItBooked) {
					var newBooking = {
						'id': bokArr[bokArr.length -1].id + 1,
						'regnum': valjBastBil_next_step[0], // Ta första bilen i sorterade arrayen (stått still längst)
						'franDatum': carNeeds.franDatum,
						'franTid': carNeeds.franTid,
						'tillDatum': carNeeds.tillDatum,
						'tillTid': carNeeds.tillTid,
						'username': carNeeds.username,
						'privat': carNeeds.privat
					};
					appendFile(bookings, newBooking);
				}
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
				    	carBooked: isItBooked
				  	});
			  	}
			  }
			}
		}
});

module.exports = router;
