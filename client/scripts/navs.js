if (Meteor.isClient) {
	Template.navs.helpers({
		currentUserHasViewedVideos: function () {
			return Session.get('localVideosViewedData')? Session.get('localVideosViewedData').itemsLen: false;
		}
	});
};