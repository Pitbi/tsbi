$(function () {
	var url = window.location.pathname;
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
		switchToNextFeature();
	});

	$(".previousFeature").click(function () {
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
	
	setInterval(function(){
		switchToNextFeature();
	},12000)

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

