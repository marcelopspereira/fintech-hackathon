	$('.profile').click(function(e) {
		e.stopPropagation();
		$('#empty').hide();
		$('#pg').hide();
		$('#user').show();
		$('.nav li').removeClass('active');
		$('.profile').addClass('active');
	});
	$('#login-submit, .items').click(function(e) {
		e.stopPropagation();
		$('#empty').hide();
		$('#user').hide();
		$('#pg').show();
		$('.nav li').removeClass('active');
		$('.items').addClass('active');
	});
