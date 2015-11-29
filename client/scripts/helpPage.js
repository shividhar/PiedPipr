if (Meteor.isClient) {
	Template.helpPage.rendered = function () {
		$('#footer').show();
		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);
		$(window).scrollTop(0);
		$('#helpPageLink').addClass('isCurrentPageOnNavs');
		executeResizeFuncs();
	};
	Template.helpPage.destroyed = function () {
		$('#bodyItem').removeAttr('style').addClass('isTempNoShow');
		Session.set('bodyTemplateWait', false);
		$('#footer').hide();
		$('#helpPageLink').removeClass('isCurrentPageOnNavs');
	};
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