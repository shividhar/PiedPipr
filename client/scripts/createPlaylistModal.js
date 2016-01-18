if (Meteor.isClient) {

	Template.createPlaylistModal.events({

		// --------------------------- submission events -----------------------------------



		'click .textInputModal>a:not(.disabledButton)': function (e) { //if user clicks the 'continue button' and it isn't disabled
			
			var val = $('.textInputModal>input').val().trim();
			

			if (val.length < 3) { //if the name is less than 3 characters, give an error message

				$('.textInputModal>p').text('Please enter a longer playlist name.').addClass('redText');
				$('.textInputModal>input').focus().addClass('redText');

			}
			else{ //otherwise create the playlist

				var $this = $(e.currentTarget);
				$this.addClass('disabledButton').text('Loading...'); //let the user know server is loading stuff

				Meteor.call("createPlaylist", {"playlistName": val}, function(err, playlistId){
					//if there is an error, reset stuff and alert the error
					if(err){
						alert(err);
						$this.removeClass('disabledButton').text('Continue');
						return false;
					}

					//otherwise reroute to the new playlist and hide the modal
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

			if (e.keyCode == 13) { //if the user hits 'enter'


				var val = $(e.target).val().trim();

				//validate input length
				if (val.length < 3) {
					$('.textInputModal>p').text('Please enter a longer playlist name.').addClass('redText');
					$(e.target).focus().addClass('redText');
				}
				else{

					//if valid create playlist --> similar to code for above event

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

			// if the user hits the 'esc' key, close the modal
			else if(e.keyCode == 27) {
				Session.set('show-createPlaylistModal', false);
				$('body').attr('class', '');
			};
		},


		// --------------------------- close modal events -----------------------------------

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

	
	//animate the modal in and disable background body scrolling

	Template.createPlaylistModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
		$('.textInputModal').fadeIn(300, function() {
			$('.textInputModal>input').focus();
		});
	};
};