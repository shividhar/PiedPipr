if (Meteor.isClient) {
	// the modal when the user clicks 'join playlist'


	Template.joinPlaylistModal.events({

		// --------------------------- submission events -----------------------------------
		'click .textInputModal>a': function () {
			var val = $('.textInputModal>input').val().trim();


			//validate code
			if (val.split(' ').length != 1 || !val.length) {


				$('.textInputModal>p').text('Invalid code!').addClass('redText');
				$('.textInputModal>input').focus().addClass('redText');


			}
			else{
				//if validate, route to playlist associated with code entered and close modal
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

			// if user hits 'enter'
			if (e.keyCode == 13) {

				// code from here is similar to above event
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

			//if user hits 'esc', close modal and enable body scrolling again
			else if(e.keyCode == 27) {
				Session.set('show-joinPlaylistModal', false);
				$('body').attr('class', '');
			};
		},

		// --------------------------- close modal events -----------------------------------
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

	// animate it in and prevent background scrolling
	Template.joinPlaylistModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
		$('.textInputModal').fadeIn(300, function() {
			$('.textInputModal>input').focus();
		});
	};
};