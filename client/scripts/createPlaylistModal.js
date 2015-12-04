if (Meteor.isClient) {
	Template.createPlaylistModal.events({
		'click .textInputModal>a:not(.disabledButton)': function (e) {
			var val = $('.textInputModal>input').val().trim();
			if (val.length < 3) {
				$('.textInputModal>p').text('Please enter a longer playlist name.').addClass('redText');
				$('.textInputModal>input').focus().addClass('redText');
			}
			else{
				var $this = $(e.currentTarget);
				$this.addClass('disabledButton').text('Loading...');
				Meteor.call("createPlaylist", {"playlistName": val}, function(err, playlistId){
					if(err){
						alert(err);
						$this.removeClass('disabledButton').text('Continue');
						return false;
					}
					if (Router.current().params.playlistId) {
						window.location.href = "/p/" + playlistId;
					}
					else{
						Router.go("playlist", {"playlistId": playlistId});
					};
					Session.set('show-createPlaylistModal', false);
					$('body').attr('class', '');
				});
			};
		},
		'keydown .textInputModal>input': function(e) {
			if (e.keyCode == 13) {
				var val = $(e.target).val().trim();
				if (val.length < 3) {
					$('.textInputModal>p').text('Please enter a longer playlist name.').addClass('redText');
					$(e.target).focus().addClass('redText');
				}
				else{
					var $this = $('.textInputModal>a');
					$this.addClass('disabledButton').text('Loading...');
					Meteor.call("createPlaylist", {"playlistName": val}, function(err, playlistId){
						if(err){
							alert(err);
							$this.removeClass('disabledButton').text('Continue');
							return false;
						}
						if (Router.current().params.playlistId) {
							window.location.href = "/p/" + playlistId;
						}
						else{
							Router.go("playlist", {"playlistId": playlistId});
						};
						Session.set('show-createPlaylistModal', false);
						$('body').attr('class', '');
					});
				};
			}
			else if(e.keyCode == 27) {
				Session.set('show-createPlaylistModal', false);
				$('body').attr('class', '');
			};
		},
		'click .textInputModal>span': function() {
			Session.set('show-createPlaylistModal', false);
			$('body').attr('class', '');
		},
		'click .modalCont': function(e) {
			if ($(e.target).attr('class') == 'modalCont') {
				Session.set('show-createPlaylistModal', false);
				$('body').attr('class', '');
			};
		}
	});
	Template.createPlaylistModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
		$('.textInputModal').fadeIn(300, function() {
			$('.textInputModal>input').focus();
		});
	};
};