if (Meteor.isClient) {

	// This is the modal which shows when the user clicks 'Viewed tracks' on the navs bars


	Template.historyModal.helpers({

		//get the playlist data which was stored as a cookie in the user's browser

		recentPlaylists: function () {
			return Session.get('localVideosViewedData').sort(function(a, b) {
				return (b.lastViewed - a.lastViewed);
			});
		},
		fromNowOfLastViewed: function() {
			return moment(this.lastViewed).fromNow();
		}
	});

	//events for clearing and hiding the history bodal
	Template.historyModal.events({
		'click #historyModal.modalCont': function () {
			Session.set('show-historyModal', false);
			$('body').attr('class', '');
		},
		'click #historyModal>div a': function() {
			Session.set('show-historyModal', false);
			$('body').attr('class', '');
		},
		'click #historyModal>div>p>span': function() {
			Session.setPersistent('localVideosViewedData', []);
		}
	});

	//animate the modal in and prevent background body scrolling
	Template.historyModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
		$('#historyModal.modalCont>div').fadeIn(300);
	};
};