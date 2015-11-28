if (Meteor.isClient) {
  Template.teamPage.rendered = function () {
  		$(window).scrollTop(0);
  		executeResizeFuncs();
		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'});}, 300);
	};
}