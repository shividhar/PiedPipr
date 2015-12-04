if (Meteor.isClient) {
	Template.footer.rendered = function () {
		var footerFuncForResize = function(winh, winw) {
			var offTop = $('#footer').offset().top - parseFloat($('#footer').css('margin-top'));
			if ((offTop+72) < (winh)) {
				$('#footer').css('margin-top', (winh - offTop - 72) + 'px');
			}
			else{
				$('#footer').css('margin-top', '0px');
			};
		};
		if (globalResizeFunctionArr.indexOf(footerFuncForResize) == -1) {
			globalResizeFunctionArr.push(footerFuncForResize);
		};
		executeResizeFuncs();
	};
	Template.footer.helpers({
		currentYear: function () {
			return moment().year();
		}
	});
};