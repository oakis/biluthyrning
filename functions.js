exports.checkIfExist = function (req, db) {
  var isItTrue;
  db.forEach(function(v,i){
    if (db[i].name == req.name)
      isItTrue = true;
  });
  return isItTrue;
};

exports.sortArr = function (key) {
	return function(a, b){
		var valA=a[key].toLowerCase(), valB=b[key].toLowerCase();
			if (valA < valB)
				return -1;
			if (valA > valB)
				return 1;
			return 0;
		};
};

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
			});
		} else {
			deleteId.push(parseFloat(req.deleteId));
		}
	  deleteId.forEach(function(v,i){
	  	req.merged.forEach(function(v,ind){
	  		if (req.merged[ind].id == deleteId[i]) {
	  			req.merged.splice(req.merged.indexOf(req.merged[ind]),1);
	  		}
	  	});
	  });
	}
  return req.merged;
};

exports.tillvalFix = function(req) { // Om bara ett tillval, gör om till en array med 1 index.
	var tillval = [];
	if (typeof req != 'undefined') {
		if (typeof req != 'string') {
			req.forEach(function(v,i){
				tillval.push(parseFloat(req[i]));
			});
		} else {
			tillval.push(parseFloat(req));
		}
	}
	return tillval;
};

exports.stringify = function (updateFunk) {
			var str = "";
			updateFunk.forEach(function(v,i){
				str += '{\n\t"id": ' + updateFunk[i].id + ',\n\t"name": "' + updateFunk[i].name + '"\n}\n*\n';
			});
			str = str.slice(0, -3);
			return str;
};

exports.stringifyBook = function (arr) {
			var str = "";
			arr.forEach(function(v,i){
				str += '{\n\t"id": ' + arr[i].id + ',\n\t"regnum": "' + arr[i].regnum + '",\n\t"franDatum": "' + arr[i].franDatum + '",\n\t"franTid": "' + arr[i].franTid + '",\n\t"tillDatum": "' + arr[i].tillDatum + '",\n\t"tillTid": "' + arr[i].tillTid + '",\n\t"username": "' + arr[i].username + '",\n\t"privat": "' + arr[i].privat + '"\n}\n*\n';
			});
			str = str.slice(0, -3);
			return str;
};

exports.stringWrite = function (array) {
			var str = "";
			array.forEach(function(v,i){
				str += '{\n\t"regnum": "' + array[i].regnum + '",\n\t"brand": "' + array[i].brand + '",\n\t"model": "' + array[i].model + '",\n\t"type": "' + array[i].type + '",\n\t"year": "' + array[i].year + '",\n\t"passenger": "' + array[i].passenger + '",\n\t"tillval": [' + array[i].tillval + '],\n\t"service": "' + array[i].service + '",\n\t"serviceDate": "' + array[i].serviceDate + '"\n}\n*\n';
			});
			str = str.slice(0, -3);
			return str;
};
