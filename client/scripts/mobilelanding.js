if (Meteor.isClient) {
	Template.mobileLanding.events({
		'click #createPlaylistMobile': function () {
			$('#overflowMobile>h2').text('Enter a name for the playlist:');
			$('#overflowMobile>input').attr('placeholder', 'ex. Gettin Westurntt').val('');
			$('#overflowMobile>a').attr('class', 'submitCreatePlaylist');
			$('#overflowMobile').show();
		},
		'click #joinPlaylistMobile': function() {
			$('#overflowMobile>h2').text('Enter code of playlist you\'d like to join:');
			$('#overflowMobile>input').attr('placeholder', 'Ex. RY3472').val('');
			$('#overflowMobile>a').attr('class', 'submitJoinPlaylist');
			$('#overflowMobile').show();
		},
		'click #overflowMobile>span': function() {
			$('#overflowMobile').hide();
		},
		'click #overflowMobile>a': function (e) {
			var inpt = $('#overflowMobile>input').val();
			if ($(e.currentTarget).hasClass('submitCreatePlaylist')) {
				if (inpt.length < 3) {
					alert("Please enter a longer name for your playlist");
				}
				else{
					$('#overflowMobile>a, #overflowMobile>span, #overflowMobile>input').hide();
					$('#overflowMobile>h2').text('Generating...');
					Meteor.call("createPlaylist", {"playlistName": inpt}, function(err, playlistId){
						if(err){
							alert(err);
							$('#overflowMobile>a, #overflowMobile>span, #overflowMobile>input').show();
							return false;
						};
						$('#overflowMobile').hide();
						Router.go("playlist", {"playlistId": playlistId});
					});
				};
			}
			else{
				if (inpt.split(' ').length != 1 || !inpt.length) {
					alert('Invalid code!');
				}
				else{
					$('#overflowMobile').hide();
					Router.go('/p/'+inpt);
				};
			};
		}
	});
};