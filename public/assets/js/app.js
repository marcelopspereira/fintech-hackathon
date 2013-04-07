String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};

$(function () {
	var productNumber = 0;

	$('#addImage').on('click', function () {
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
		});
	});

	$('#main').on('click', '#publish', function () {
		$(this).parent().remove();
		$('#publishDialog').fadeIn(100);
		$("html, body").animate({ scrollTop: $("#publishDialog").offset().top });
	});

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
