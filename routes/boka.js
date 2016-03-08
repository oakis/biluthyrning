var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');


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
	console.log(bokningar);
	db.forEach(function(v,i){
		if (db[i].type == needs.type) {
			//console.log('Type Match');
			var carMatch = '';
			// Kontrollerar tillvalen och ger en array med alla regnum som matchar
			needs.tillval.forEach(function(val,ind){
				if (db[i].tillval.indexOf(needs.tillval[ind]) != -1) {
					carMatch += 'y';
				} else {
					carMatch += 'n';
				};
			});
			if (carMatch.indexOf('n') == -1) {
				//console.log(db[i].regnum + ' YES');
				valjBastBil.push(db[i].regnum);
			} else {
				//console.log(db[i].regnum + ' NO');
			};
		}
	})
	//console.log('\nTill - Från Datum\n'+needs.franDatum+' - '+needs.tillDatum)
	//console.log('\nFöre datum/tid kontroll:\n'+valjBastBil);
	//console.log(needs.franDatum + ' - ' + needs.tillDatum);

	// Kontrollera att ingen bokning på passande bilar finns vid valt datum.
	valjBastBil.forEach(function(v,i){ // abc123, bcd234
		bokningar.forEach(function(v,ind){ // abc123, bcd234

			/*var nfD = needs.franDatum;
			var ntD = needs.tillDatum;
			var bfD = bokningar[ind].franDatum;
			var btD = bokningar[ind].tillDatum;*/

			var user_from_year = needs.franDatum.substring(0,4);
			var user_from_month = needs.franDatum.substring(5,7) -1;
			var user_from_day = needs.franDatum.substring(8,10);
			var user_from_full_date = moment().set({'year': user_from_year,'month': user_from_month,'date': user_from_day});
			var book_from_year = bokningar[ind].franDatum.substring(0,4);
			var book_from_month = bokningar[ind].franDatum.substring(5,7) -1;
			var book_from_day = bokningar[ind].franDatum.substring(8,10);
			var book_from_full_date = moment().set({'year': book_from_year,'month': book_from_month,'date': book_from_day});
			var user_to_year = needs.tillDatum.substring(0,4);
			var user_to_month = needs.tillDatum.substring(5,7) -1;
			var user_to_day = needs.tillDatum.substring(8,10);
			var user_to_full_date = moment().set({'year': user_to_year,'month': user_to_month,'date': user_to_day});
			var book_to_year = bokningar[ind].tillDatum.substring(0,4);
			var book_to_month = bokningar[ind].tillDatum.substring(5,7) -1;
			var book_to_day = bokningar[ind].tillDatum.substring(8,10);
			var book_to_full_date = moment().set({'year': book_to_year,'month': book_to_month,'date': book_to_day});

			console.log('test');
			console.log(user_from_full_date.isSameOrAfter(book_from_full_date));
			if (user_from_full_date.isSameOrAfter(book_from_full_date) && user_to_full_date.isSameOrBefore(book_to_full_date)) {
				//console.log('fail');
			} else {
				//console.log(valjBastBil[i] + ' är ok att boka')
			}
			//console.log(book_to_full_date.format('YYYY-MM-DD'));
			//console.log(needs.franDatum >= bokningar[ind].franDatum);
			//console.log(nfD < bfD && nfD < bfD || nfD > bfD && nfD > bfD);
			

		});
	});
	//console.log('\nEfter datum/tid kontroll:\n'+valjBastBil+'\n');
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
- Gör en matchning på från och till datum (fromDate - toDate)
- Gör en matching på från och till tid eller hela dagen
- Privat användning, utanför arbetstid endast (08.00-17.00)
- Ändra status på första lediga fordon med inmatad information
- Visa en bekräftelse av bokningen
*/
function loadFile(file, callback){
	 var returnArr = [];
   fs.readFile(file, 'utf8', function (err, data) {
      if (err) throw err;
      data = data.toString();
		  var arr = data.split('*');
		  arr.forEach(function(v, i) {
		    returnArr.push(JSON.parse(arr[i]));
		  });
		  callback(returnArr);
   });
}


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

	var bokArr = [];
	fs.readFile(bokningar, function(err, data) {
    if (err) throw err;
    data = data.toString();
    var arr = data.split('*');
    arr.forEach(function(v, i) {
      bokArr.push(JSON.parse(arr[i]));
    });
  });

  var carArr = [];
  fs.readFile(bilar, function(err, data) {
    if (err) throw err;
    data = data.toString();
    var arr = data.split('*');
    arr.forEach(function(v, i) {
      carArr.push(JSON.parse(arr[i]));
    });
    giveMeCar(carNeeds,carArr,bokArr); // kontr vilken bil som passar bäst och returnera regnum.
  });


	var funkArr = [];
	fs.readFile(funktioner, function(err, data) {
    if (err) throw err;
    data = data.toString();
    var arr = data.split('*');
    arr.forEach(function(v, i) {
      funkArr.push(JSON.parse(arr[i]));
    });
    res.render('boka', {
      funklista : funkArr
    });
  });
})

module.exports = router;
