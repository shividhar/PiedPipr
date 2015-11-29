if (Meteor.isClient) {
  Template.teamPage.rendered = function () {
  		$(window).scrollTop(0);
  		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);
  		$('#footer').show();
  		executeResizeFuncs();
	};
	Template.teamPage.destroyed = function () {
		$('#bodyItem').removeAttr('style').addClass('isTempNoShow');
		Session.set('bodyTemplateWait', false);
		$('#footer').hide();
	};
}