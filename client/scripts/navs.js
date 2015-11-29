if (Meteor.isClient) {
	Template.navs.helpers({
		currentUserHasViewedVideos: function () {
			return Session.get('localVideosViewedData')? Session.get('localVideosViewedData').length: false;
		}
	});
	Template.navs.events({
		'click #joinPlaylist': function () {
			
		}
	});
};