$(function () {
	Modernizr.load();
	var d=300;
	var url = window.location.pathname;
    $('#navigation a').each(function(){
        var $this = $(this);
        var r=Math.floor(Math.random()*41)-20;

    		if(url !== $(this).attr("href")){
	        $this.stop().animate({
	            'marginTop':'-70px'
	        },d+=150);
	      }
    });
    $('#navigation > li').hover(

      
        function () {
            var $this = $(this);
            $('a',$this).stop().animate({
                'marginTop':'-40px'
            },200);
        },
        function () {
        	if(url !== $(this).children().attr("href")) {
            var $this = $(this);
	            $('a',$this).stop().animate({
	                'marginTop':'-70px'
	            },200);
	        }
      }
    );


	if (url != "/") {
		$("#wrapper").css("height", "100%");
	} else {
			var homeCarouselTimer = 0;
			setInterval(function(){
				if (homeCarouselTimer >= 20) {
					switchToNextFeature();
					homeCarouselTimer = 0;
				} else {
					homeCarouselTimer = homeCarouselTimer + 1;
				}
			},1000)
	}
	$("#subnav li a").click(function () {
		var parent = $(this).parent().parent().parent();

		$('#subnav li a').each(function(){
  		$(this).removeClass('active');
    	var pageId = $(this).attr("href");
    	$(pageId).css("display", "none");
		});
		$(this).addClass("active");
    var pageId = $(this).attr("href");
    $(pageId).css("display", "block");
		if(parent.is("li")) {
			var parentA = $(parent).children("a");
			parentA.addClass('active');
		}
	});

	if (url === "/techniques" && location.search) {
		$('#subnav li a').each(function(){
  		$(this).removeClass('active');
    	var pageId = $(this).attr("href");
    	$(pageId).css("display", "none");
		});
		var tech = "#" + location.search.substring(1);
		if ($(tech)) {
			$('a[href$="' + tech + '"]').addClass("active");
			$(".works").each(function () {
				$(this).hide();
			});
			$(tech).show();
		}
	}

	$(".sub-sub-nav").click(function () {
		var firstChild = $(this).siblings("ul");
		var firstChildA = $(firstChild).children("li").children("a.sub-sub-nav-first");
		$(firstChildA).addClass("active");
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
			featureIndex = 5;
			$("#feature5").css("display", "block");
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



  if (url.match("references")) {
  	$("#carousel").hide();
  	setTimeout(function() {
  		$("#carousel").fadeIn("slow");
  	}, 300)
  	Shadowbox.init();
  	$(".reference-link").each(function () {
  		if ($(this).attr("href") === url) {
  			$(this).addClass("active");
  		} else {
  			$(this).removeClass("active");
  		}
  	});
  }
});

