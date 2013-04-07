String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};

var config = new Object();
function password()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var productNumber = 0;
var progressAmount = 0;
var currentProgress = 0;

function advanceProgressBar()
{
	progressAmount++;
	currentProgress = currentProgress + (100/productNumber)*progressAmount;
	$('#publishProgress').css({width: currentProgress+'%'});

	if(progressAmount==productNumber)
	{
		$('#publishingDialog').delay(500).fadeOut(100, function () {
			$('#doneDialog').delay(500).fadeIn(100);
		});
	}
}

function publishProduct(productNumber,token)
{
	var productDetails = {
		url: $("#product_number_"+productNumber+' .productImage').attr('src'),
		name: $("#product_number_"+productNumber+' .productName').attr('value'),
		description: $("#product_number_"+productNumber+' .productDescription').attr('value'),
		price: eval($("#product_number_"+productNumber+' .productPrice').attr('value'))
	};
}

$(function () {
	$('#addImage').click(function () {
		$('body').css("background", "url('/assets/img/grey_wash_wall.png')");
		//Hide the add image dialog.
		$('#addImageDialog').fadeOut(100,function () {
			//Show the image.
			var productTemplate = $("#productTemplate").html();
			var product = productTemplate.format($('#imageURL').val(),productNumber);
			$("#main").append(product);
			$("#product_number_"+productNumber).fadeIn(100);
			$("html, body").animate({ scrollTop: $("#product_number_"+productNumber).offset().top });
			productNumber++;
			$('#imageURL').val('');
		});
	});

	$('#main').on('click', '#publish', function () {
		$(this).parent().remove();
		$('#publishDialog').fadeIn(100);
		$("html, body").animate({ scrollTop: $("#publishDialog").offset().top });
	});

	$('#publishButton').click(function () {
		var userPassword = password();
		$.ajax({
			url: '/api/user',
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({
				'name': "Sample Name",
				'email': $('#emailAddress').val(),
				'password': userPassword
			}),
			statusCode: {
				409: function () {
					alert("Failure registering a new account for this email address.");
					return;
				},
				200: function () {
					//Now get a session token by logging in.
					$.ajax({
						url: '/api/session',
						type: "POST",
						dataType: "json",
						contentType: "application/json",
						data: JSON.stringify({
							'application': "web",
							'email': $('#emailAddress').val(),
							'password': userPassword
						}),
						statusCode: {
							409: function () {
								alert("Failure logging in.");
							}
						},
						success: function(response) {
							$('#publishDialog').fadeOut(100);
							$('.productDiv').fadeOut(100);
							$('#publishingDialog').fadeIn(100);
							$("html, body").animate({ scrollTop: $("#publishingDialog").offset().top });
							$('#passwordOutput').text(userPassword);
							//Now use the session token to add each product.
							for(var counter=0; counter<productNumber; counter++)
							{
								publishProduct(counter,response.token);
							}
						}
					});
				}
			}
		});
	});

$('#login-submit').click(function(e) {
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
			config.user = response;
			showProducts();
		}
	});
	
	return false;
});

	showProducts = function() {
		$.ajax({
			url: '/api/products',
			type: "GET",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({
				'token': config.user.token,
				'user': config.user.user
			}),
			statusCode: {
				409: function () {
					alert("Failure querying products.");
				}
			},
			success: function(response) {
				//Now use the session token to add each product.
				for(var counter=0; counter<productNumber; counter++)
				{
					publishProduct(counter,config.user.token);
				}
			}
		});
	};

	$('#main').on('click', '#nextItem', function () {
		$(this).parent().remove();
		$('#addImageDialog').fadeIn(100);
		$("html, body").animate({ scrollTop: $("#addImageDialog").offset().top });
	});

	$('.signIn').on('click', function(e) {
		$('#welcome').hide(); $('#login').show();
	});
	$('.continue').on('click', function(e) {
		$('#entry').hide(); $('#addImageDialog').show();
	});
});
