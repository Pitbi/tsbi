$(function () {
	var url = window.location.pathname;
	$('#nav li a').each(function(){
    if(url === ($(this).attr("href"))){
      $(this).addClass('active');
    }
	});
});