var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.query.username == 'anv') {
		res.redirect('/boka');
	} else if (req.query.username == 'admin'){
		res.redirect('/fordon');
	} else {
		res.render('index');
	};
});

module.exports = router;
