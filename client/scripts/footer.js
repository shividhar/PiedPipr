if (Meteor.isClient) {
	Template.footer.rendered = function () {
		var footerFuncForResize = function(winh, winw) {
			var offTop = $('#footer').offset().top - parseFloat($('#footer').css('margin-top'));
			if ((offTop+102) < (winh-24)) {
				$('#footer').css('margin-top', (winh - offTop - 102) + 'px');
			}
			else{
				$('#footer').css('margin-top', '24px');
			};
		};
		globalResizeFunctionArr.push(footerFuncForResize);
		executeResizeFuncs();
	};

};