if (Meteor.isClient) {
	Template.appPage.rendered = function () {
		$(window).scrollTop(0);
		$('#footer').show();
		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);
		$('#appPageLink').addClass('isCurrentPageOnNavs');
		executeResizeFuncs();
	};
	Template.appPage.destroyed = function () {
		$('#bodyItem').removeAttr('style').addClass('isTempNoShow');
		Session.set('bodyTemplateWait', false);
		$('#footer').hide();
		$('#appPageLink').removeClass('isCurrentPageOnNavs');
	};
};