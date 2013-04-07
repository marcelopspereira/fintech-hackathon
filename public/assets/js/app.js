String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};

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

	$.ajax({
		url: '/api/product',
		type: "POST",
		dataType: "json",
		contentType: "application/json",
		headers: {
			token: token,
			application: 'web'
		},
		data: JSON.stringify(productDetails),
		statusCode: {
			409: function () {
				alert("Failure saving product "+productNumber);
			}
		},
		success: function(response) {

			//Now use the session token to add each product.
			advanceProgressBar();
		}
	});
}

$(function () {
	$('#addImage').click(function () {
		//Hide the add image dialog.
		$('#addImageDialog').fadeOut(100,function () {
			//Show the image.
			var productTemplate = $("#productTemplate").html();
			var product = productTemplate.format($('#imageURL').val(),productNumber);
			$("#main").append(product);
			$("#product_number_"+productNumber).fadeIn(100);
			$("html, body").animate({ scrollTop: $("#product_number_"+productNumber).offset().top });
			productNumber++;
		});
	});

	$('#main').on('click', '#publish', function () {
		$(this).parent().remove();
		$('#publishDialog').fadeIn(100);
		$("html, body").animate({ scrollTop: $("#publishDialog").offset().top });
	});

	$('#publishButton').click(function () {
		$('#publishDialog').fadeOut(100);
		$('.productDiv').fadeOut(100);
		$('#publishingDialog').fadeIn(100);
		$("html, body").animate({ scrollTop: $("#publishingDialog").offset().top });
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

	$('#main').on('click', '#nextItem', function () {
		$(this).parent().remove();
		$('#addImageDialog').fadeIn(100);
		$("html, body").animate({ scrollTop: $("#addImageDialog").offset().top });
	});
});