if (Meteor.isClient) {


	Template.footer.rendered = function () {

		//define how to update the footer when the window resizes

		var footerFuncForResize = function(winh, winw) {
			var offTop = $('#footer')[0]? $('#footer').offset().top - parseFloat($('#footer').css('margin-top')): 0;
			if ((offTop+72) < (winh)) {
				$('#footer').css('margin-top', (winh - offTop - 72) + 'px');
			}
			else{
				$('#footer').css('margin-top', '0px');
			};
		};

		//append the above function to the list of functions to execute on footer resize
			//--> see container.js
		if (globalResizeFunctionArr.indexOf(footerFuncForResize) == -1) {
			globalResizeFunctionArr.push(footerFuncForResize);
		};

		//run resize functions
		executeResizeFuncs();
	};

	//get current year for the copyright
	Template.footer.helpers({
		currentYear: function () {
			return moment().year();
		}
	});
};