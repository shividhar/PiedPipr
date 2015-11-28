if (Meteor.isClient) {
  Template.teamPage.rendered = function () {
  		executeResizeFuncs();
		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'});}, 300);
	};
}