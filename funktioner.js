checkIfExist = function (req, bilDb) {
  var isItTrue;
  bilDb.forEach(function(v,i){
    if (bilDb[i].regnum == req.regnum)
      isItTrue = true;
  })
  return isItTrue;
}

module.exports = funk;