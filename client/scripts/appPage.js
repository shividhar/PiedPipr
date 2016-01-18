if (Meteor.isClient) {

	// The js for the /app route

	Template.appPage.rendered = function () {
		$(window).scrollTop(0); //scroll to the top

		$('#footer').show(); // show the footer (gets hidden on route changes)


		// subtle animation-in for the body
		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);

		// update the navs
		$('#appPageLink').addClass('isCurrentPageOnNavs');

		//see container.js
		executeResizeFuncs();
	};

	Template.appPage.destroyed = function () {
		//temporarily animate the body out (until the new route will animate it back in)
		$('#bodyItem').removeAttr('style').addClass('isTempNoShow');
		Session.set('bodyTemplateWait', false);
		$('#footer').hide();
		$('#appPageLink').removeClass('isCurrentPageOnNavs'); //update the navs
	};
};