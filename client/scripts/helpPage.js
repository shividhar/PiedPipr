if (Meteor.isClient) {

	//the /help route

	Template.helpPage.rendered = function () {

		//animate the help page in
		$('#footer').show();
		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);

		//scroll window to the top
		$(window).scrollTop(0);

		//update navs
		$('#helpPageLink').addClass('isCurrentPageOnNavs');

		//update dom styling incase any resize has executed --> see container.js
		executeResizeFuncs();
	};



	Template.helpPage.destroyed = function () {
		//animate the help page body out
		$('#bodyItem').removeAttr('style').addClass('isTempNoShow');
		Session.set('bodyTemplateWait', false);
		$('#footer').hide();

		//update the navs
		$('#helpPageLink').removeClass('isCurrentPageOnNavs');
	};

	//scroll to a certain help paragraph on the help page based on which link was clicked --
		// -- on the help page navigation list
	Template.helpPage.events({
		'click .toItem1Help': function () {
			var frmtop = $('.helpPage>div:nth-of-type('+1+')').offset().top;
			$('document, body').animate({scrollTop: frmtop}, 300);
		},
		'click .toItem2Help': function () {
			var frmtop = $('.helpPage>div:nth-of-type('+2+')').offset().top;
			$('document, body').animate({scrollTop: frmtop}, 300);
		},
		'click .toItem3Help': function () {
			var frmtop = $('.helpPage>div:nth-of-type('+3+')').offset().top;
			$('document, body').animate({scrollTop: frmtop}, 300);
		},
		'click .toItem4Help': function () {
			var frmtop = $('.helpPage>div:nth-of-type('+4+')').offset().top;
			$('document, body').animate({scrollTop: frmtop}, 300);
		},
		'click .toItem5Help': function () {
			var frmtop = $('.helpPage>div:nth-of-type('+5+')').offset().top;
			$('document, body').animate({scrollTop: frmtop}, 300);
		},
		'click .toItem6Help': function () {
			var frmtop = $('.helpPage>div:nth-of-type('+6+')').offset().top;
			$('document, body').animate({scrollTop: frmtop}, 300);
		}
	});
};