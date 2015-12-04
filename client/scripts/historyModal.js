if (Meteor.isClient) {
	Template.historyModal.helpers({
		recentPlaylists: function () {
			return Session.get('localVideosViewedData').sort(function(a, b) {
				return (b.lastViewed - a.lastViewed);
			});
		},
		fromNowOfLastViewed: function() {
			return moment(this.lastViewed).fromNow();
		}
	});
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
	Template.historyModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
		$('#historyModal.modalCont>div').fadeIn(300);
	};
};