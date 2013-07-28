$(function () {

	var url = window.location.pathname;
	if (url != "/") {
		$("#wrapper").css("height", "100%");
	} else {
			var homeCarouselTimer = 0;
			setInterval(function(){
				if (homeCarouselTimer >= 15) {
					switchToNextFeature();
					homeCarouselTimer = 0;
				} else {
					homeCarouselTimer = homeCarouselTimer + 1;
				}
			},1000)
	}
	$("#subnav li a").click(function () {
		$('#subnav li a').each(function(){
    	$(this).removeClass('active');
    	var pageId = $(this).attr("href");
    	$(pageId).css("display", "none");
		});
		$(this).addClass("active");
    var pageId = $(this).attr("href");
    $(pageId).css("display", "block");
	});

	$('#nav li a').each(function(){
    if(url === ($(this).attr("href"))){
      $(this).addClass('active');
    }
	});

	var featureIndex = 1;
	$(".nextFeature").click(function () {
					homeCarouselTimer = 0;
		switchToNextFeature();
	});

	$(".previousFeature").click(function () {
					homeCarouselTimer = 0;
		var currentFeature = "#feature" + featureIndex;
		featureIndex = featureIndex - 1;
		var nextFeature =  "#feature" + (featureIndex);

		$(currentFeature).css("display", "none");
		if ($(nextFeature).is("div")) {
			$(nextFeature).css("display", "block");	
		} else {
			featureIndex = 3;
			$("#feature3").css("display", "block");
		}
	});
	


	var switchToNextFeature = function () {
		var currentFeature = "#feature" + featureIndex;
		featureIndex = featureIndex + 1;
		var nextFeature =  "#feature" + (featureIndex);

		$(currentFeature).css("display", "none");
		if ($(nextFeature).is("div")) {
			$(nextFeature).css("display", "block");	
		} else {
			featureIndex = 1;
			$("#feature1").css("display", "block");
		}
	}
});

