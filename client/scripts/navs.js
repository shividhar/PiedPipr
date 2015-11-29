if (Meteor.isClient) {
	var tempClearRequestsTimeout;
	Template.navs.helpers({
		currentUserHasViewedVideos: function () {
			return Session.get('localVideosViewedData')? Session.get('localVideosViewedData').length: false;
		},
		modals: function() {
			clearTimeout(tempClearRequestsTimeout);
			
			var modalsToRet = [];
			if (Session.get('show-historyModal')) {
				modalsToRet.push({'modalTemplateToUse': 'historyModal'});
			}
			else if(Session.get('show-joinPlaylistModal')){
				modalsToRet.push({'modalTemplateToUse': 'joinPlaylistModal'});
			}
			else if(Session.get('show-createPlaylistModal')) {
				modalsToRet.push({'modalTemplateToUse': 'createPlaylistModal'});
			}
			else if(Session.get('show-sharePlaylistModal') && Router.current().params.playlistId) {
				modalsToRet.push({'modalTemplateToUse': 'sharePlaylistModal'});
			}
			else if(Session.get('thisPlaylistData') && Session.get('thisPlaylistData').songListToApprove && Session.get('thisPlaylistData').authorId == Meteor.userId() && Router.current().params.playlistId) {
				if (Session.get('thisPlaylistData').songListToApprove.length) {
					if (!Session.get('enableAutoAcceptingTrackRecomms')) {
						modalsToRet.push({'modalTemplateToUse': 'trackRecommendationChoiceModal'});
					}
					else{
						tempClearRequestsTimeout = setInterval(function() {
							for (var i = Session.get('thisPlaylistData').songListToApprove.length - 1; i >= 0; i--) {
								var videoId = Session.get('thisPlaylistData').songListToApprove[i];
								Meteor.call('addSongToPlaylist', {"videoId": videoId, playlistId: Router.current().params.playlistId});
							};
							Meteor.call('clearAllSongRequests', {playlistId: Router.current().params.playlistId});
						}, 1200);
					};
				}
				else{
					$('body').attr('class', '');
				};
			}
			else{
				$('body').attr('class', '');
			};
			return modalsToRet;
		}
	});
	Template.navs.events({
		'click #joinPlaylist': function () {
			Session.set('show-joinPlaylistModal', true);
		},
		'click #toHistoryModal': function() {
			Session.set('show-historyModal', true);
		},
		'click #createPlaylist': function() {
			Session.set('show-createPlaylistModal', true);
		}
	});
};