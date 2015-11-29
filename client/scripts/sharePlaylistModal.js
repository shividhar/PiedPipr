if (Meteor.isClient) {
	Template.sharePlaylistModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
		$('.textInputModal>input').select();
	};
	Template.sharePlaylistModal.helpers({
		thisPlaylistCode: function () {
			return Router.current().params.playlistId;
		}
	});
	Template.sharePlaylistModal.events({
		'click .textInputModal>a': function() {
			Session.set('show-sharePlaylistModal', false);
			$('body').attr('class', '');
		}
	});
};