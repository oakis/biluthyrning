exports.checkIfExist = function (req, db) {
  var isItTrue;
  db.forEach(function(v,i){
    if (db[i].name == req.name)
      isItTrue = true;
  })
  return isItTrue;
}

exports.sortArr = function (key) {
	return function(a, b){
		var valA=a[key].toLowerCase(), valB=b[key].toLowerCase();
			if (valA < valB)
				return -1;
			if (valA > valB)
				return 1;
			return 0;
		};
}

exports.sortArrNum = function (key) {
	return function (a, b) {
		var a = a[key], b = b[key];
  	return a - b;
	};
};

exports.updateFunk = function (req) {
	var deleteId = [];
	if (typeof req.deleteId != 'undefined') {
		if (typeof req.deleteId != 'string') {
			req.deleteId.forEach(function(v,i){
				deleteId.push(parseFloat(req.deleteId[i]));
			})
		} else {
			deleteId.push(parseFloat(req.deleteId));
		}
	  deleteId.forEach(function(v,i){
	  	req.merged.forEach(function(v,ind){
	  		if (req.merged[ind].id == deleteId[i]) {
	  			req.merged.splice(req.merged.indexOf(req.merged[ind]),1)
	  		}
	  	})
	  })
	}
  return req.merged;
}

exports.stringify = function (updateFunk) {
			var str = "";
			updateFunk.forEach(function(v,i){
				str += '{\n\t"id": ' + updateFunk[i].id + ',\n\t"name": "' + updateFunk[i].name + '"\n}\n*\n';
			})
			str = str.slice(0, -3);
			return str;
}