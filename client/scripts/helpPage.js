if (Meteor.isClient) {
	Template.helpPage.rendered = function () {
		executeResizeFuncs();
		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'});}, 300);
		$(window).scrollTop(0);
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