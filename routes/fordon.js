var express = require('express');
var router = express.Router();
var fs = require('fs');
var papa = require('babyparse');



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
            res.render('fordon',{
              'bilar': ny_bil
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
  res.render('fordon', {

    'bilar': ny_bil
  });
});

module.exports = router;
