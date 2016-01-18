if (Meteor.isClient) {

	//the modal to show when the user decides to share a playlist with someone (once in the playlist's route)

	// animate it in and disable body scrolling
	Template.sharePlaylistModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
		$('.textInputModal').fadeIn(300, function() {
			$('.textInputModal>input').select();
		});
	};

	// give the current playlist's code and generate a qr code url
	Template.sharePlaylistModal.helpers({
		thisPlaylistCode: function () {
			return Router.current().params.playlistId;
		},
		thisPlaylistQr: function() {
			return ("https://api.qrserver.com/v1/create-qr-code/?size=96x96&data="+Router.current().params.playlistId);
		}
	});

	// events to close modal and renable body scrolling
	Template.sharePlaylistModal.events({
		'click .textInputModal>a': function() {
			Session.set('show-sharePlaylistModal', false);
			$('body').attr('class', '');
		},
		'click .modalCont': function(e) {
			if ($(e.target).attr('class') == 'modalCont') {
				Session.set('show-sharePlaylistModal', false);
				$('body').attr('class', '');
			};
		},
		'keydown .textInputModal>input': function(e) {
			if(e.keyCode == 27 || e.keyCode == 13) {
				Session.set('show-sharePlaylistModal', false);
				$('body').attr('class', '');
			}
			else if(e.keyCode !== 17 && e.keyCode !== 67 && e.keyCode !== 224 && e.keyCode !== 17 && e.keyCode !== 91){
				return false;
			};
		}
	});
};