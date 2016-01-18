if (Meteor.isClient) {

	// functions to execute when the window resizes --> you can globally modify them
	globalResizeFunctionArr = [];
	executeResizeFuncs = function() {
		var winh = $(window).height();
		var winw = $(window).width();
		for (var i = globalResizeFunctionArr.length - 1; i >= 0; i--) {
			globalResizeFunctionArr[i](winh, winw);
		};
	};


	// the overal template that wraps over everything is the container
	Template.container.rendered = function () {
		$(window).resize(executeResizeFuncs);
		executeResizeFuncs();
	};
	Template.container.destroyed = function () {
		$(window).off('resize');
	};
};