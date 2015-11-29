if (Meteor.isClient) {
	Template.createPlaylistModal.events({
		'click .textInputModal>a': function () {
			var val = $('.textInputModal>input').val().trim();
			if (val.length < 3) {
				$('.textInputModal>p').text('Please enter a longer playlist name.');
			}
			else{
				Meteor.call("createPlaylist", {"playlistName": val}, function(err, playlistId){
					if(err){
						alert(err);
						return false;
					}
					Router.go("playlist", {"playlistId": playlistId});
					Session.set('show-createPlaylistModal', false);
					$('body').attr('class', '');
				});
			};
		},
		'click .textInputModal>span': function() {
			Session.set('show-createPlaylistModal', false);
			$('body').attr('class', '');
		}
	});
	Template.createPlaylistModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
	};
};