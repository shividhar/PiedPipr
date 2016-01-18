if (Meteor.isClient) {

	//animate the 404 page in
	Template.notFound.rendered = function () {
		$(window).scrollTop(0);
		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);
		$(window).resize(executeResizeFuncs);
		document.title = "404 - Page not found";
	};

	//animate it out
	Template.notFound.destroyed = function () {
		$(window).off('resize');
		$('#bodyItem').removeAttr('style').addClass('isTempNoShow');
		Session.set('bodyTemplateWait', false);
	};
};