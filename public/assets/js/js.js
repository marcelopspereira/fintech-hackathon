var config = new Object();

hideAll = function() {
	$('#empty').hide();
	$('#pg').hide();
	$('#user').hide();
}

showProfile = function() {
	hideAll();
	$('#user').show();
	$('.nav li').removeClass('active');
	$('.profile').addClass('active');
}

showItems = function() {
	hideAll();
	$('#pg').show();
	$('.nav li').removeClass('active');
	$('.items').addClass('active');
}

$('.profile').click(function(e) {
	e.stopPropagation();
	if(typeof config.user.token !== 'undefined') {
		showProfile();
	}
});

$('.items').click(function(e) {
	e.stopPropagation();
	if(typeof config.user.token !== 'undefined') {
		showItems();
	}
});

$('#createAccount').click(function(e) {
	e.stopPropagation();

	//validate
	var data = new Object;;
	var notice = '';
	vals = $('#create .validate');
	for (index in vals) {
		if(index % 1 == 0) { 
			if($(vals[index]).val() == 0) { 
				$(vals[index]).addClass('warning');
				notice += $(vals[index]).attr('name')+' is empty.\r';
				var invalid = true;
			}
			else { 
				data[$(vals[index]).attr('name').toLowerCase()] = $(vals[index]).val();
			}
		}
	}
	if(typeof invalid !== 'undefined') {
		alert(notice); 
		return false;
	}
	
	//submit request.
	$.ajax({
		url: '/api/user',
		type: "POST",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		statusCode: {
			409: function () {
				alert("yo' shit busted.");
			}
		},
		success: function(response) {
			showItems();
		}
	});
	
	return false;
});

$('#login-submit').click(function(e) {
	e.stopPropagation();

	//validate
	var data = new Object;;
	var notice = '';
	vals = $('#login .validate');
	for (index in vals) {
		if(index % 1 == 0) { 
			if($(vals[index]).val() == 0) { 
				$(vals[index]).addClass('warning');
				notice += $(vals[index]).attr('name')+' is empty.\r';
				var invalid = true;
			}
			else { 
				data[$(vals[index]).attr('name').toLowerCase()] = $(vals[index]).val();
			}
		}
	}
	if(typeof invalid !== 'undefined') {
		alert(notice); 
		return false;
	}
	
	//submit request.
	data.application = 'fin';
	$.ajax({
		url: '/api/session',
		type: "POST",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		statusCode: {
			409: function () {
				alert("yo' shit busted.");
			}
		},
		success: function(response) {
			showItems();
			config.user = response;
		}
	});
	
	return false;
});
