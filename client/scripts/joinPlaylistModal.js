if (Meteor.isClient) {
	Template.joinPlaylistModal.events({
		'click .textInputModal>a': function () {
			var val = $('.textInputModal>input').val().trim();
			if (val.split(' ').length != 1) {
				$('.textInputModal>p').text('Invalid code!');
			}
			else{
				Router.go('/p/'+val);
				Session.set('show-joinPlaylistModal', false);
				$('body').attr('class', '');
			};
		},
		'click .textInputModal>span': function() {
			Session.set('show-joinPlaylistModal', false);
			$('body').attr('class', '');
		}
	});
	Template.joinPlaylistModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
	};
};