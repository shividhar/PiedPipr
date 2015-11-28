if (Meteor.isClient) {
	Template.notFound.rendered = function () {
		$(window).scrollTop(0);
		$(window).resize(executeResizeFuncs);
		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'});}, 300);
	};
	Template.notFound.destroyed = function () {
		$(window).off('resize');
	};
};