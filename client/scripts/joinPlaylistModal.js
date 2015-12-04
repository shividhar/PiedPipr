if (Meteor.isClient) {
	Template.joinPlaylistModal.events({
		'click .textInputModal>a': function () {
			var val = $('.textInputModal>input').val().trim();
			if (val.split(' ').length != 1 || !val.length) {
				$('.textInputModal>p').text('Invalid code!').addClass('redText');
				$('.textInputModal>input').focus().addClass('redText');
			}
			else{
				if (Router.current().params.playlistId) {
					window.location.href = "/p/" + val;
				}
				else{
					Router.go('/p/'+val);
				};
				Session.set('show-joinPlaylistModal', false);
				$('body').attr('class', '');
			};
		},
		'keydown .textInputModal>input': function(e) {
			if (e.keyCode == 13) {
				var val = $(e.target).val().trim();
				if (val.split(' ').length != 1 || !val.length) {
					$('.textInputModal>p').text('Invalid code!').addClass('redText');
					$(e.target).focus().addClass('redText');
				}
				else{
					if (Router.current().params.playlistId) {
						window.location.href = "/p/" + val;
					}
					else{
						Router.go('/p/'+val);
					};
					Session.set('show-joinPlaylistModal', false);
					$('body').attr('class', '');
				};
			}
			else if(e.keyCode == 27) {
				Session.set('show-joinPlaylistModal', false);
				$('body').attr('class', '');
			};
		},
		'click .textInputModal>span': function() {
			Session.set('show-joinPlaylistModal', false);
			$('body').attr('class', '');
		},
		'click .modalCont': function(e) {
			if ($(e.target).attr('class') == 'modalCont') {
				Session.set('show-joinPlaylistModal', false);
				$('body').attr('class', '');
			};
		}
	});
	Template.joinPlaylistModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
		$('.textInputModal').fadeIn(300, function() {
			$('.textInputModal>input').focus();
		});
	};
};