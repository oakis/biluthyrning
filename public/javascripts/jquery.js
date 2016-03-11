$(document).ready(function(){

	$(".doesExist, .carAdd, .funkAdd .bookFailed").delay(4000).fadeOut(1000);

});

function submitFunction(i) {
	if (i == 1){
		document.car_crud.action = '/fordon/remove';
	}
	if (i == 2) {
		document.car_crud.action = '/fordon/update';
	}
	if (i == 3) {
		document.car_crud.action = '/fordon/add';
	}
}
document.car_crud.submit();