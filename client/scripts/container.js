if (Meteor.isClient) {
	globalResizeFunctionArr = [];
	executeResizeFuncs = function() {
		var winh = $(window).height();
		var winw = $(window).width();
		for (var i = globalResizeFunctionArr.length - 1; i >= 0; i--) {
			globalResizeFunctionArr[i](winh, winw);
		};
	};
	Template.container.rendered = function () {
		$(window).resize(executeResizeFuncs);
		executeResizeFuncs();
	};
	Template.container.destroyed = function () {
		$(window).off('resize');
	};
};