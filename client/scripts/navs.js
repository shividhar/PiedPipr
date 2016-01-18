if (Meteor.isClient) {

	//desktop navigation bars
	var tempClearRequestsTimeout;


	Template.navs.helpers({
		currentUserHasViewedVideos: function () {
			//check if user has already viewed some videos, if so, show the 'Viewed tracks' button
			return Session.get('localVideosViewedData')? Session.get('localVideosViewedData').length: false;
		},
		modals: function() {

			//figure out which modal to show --> this enables the stacking of modals

			clearTimeout(tempClearRequestsTimeout);
			
			var modalsToRet = [];

			//the order of these statements will deterimine modal heirarchy

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

				//if user has track addition requests to his/her playlist but at the same time has decided to auto-add tracks to that playlist, it'll accept the track in the background
					//otherwise show the option modal

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


	//events to show/hdie specific modals
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