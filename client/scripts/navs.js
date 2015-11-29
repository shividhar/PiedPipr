if (Meteor.isClient) {
	Template.navs.helpers({
		currentUserHasViewedVideos: function () {
			return Session.get('localVideosViewedData')? Session.get('localVideosViewedData').length: false;
		},
		modals: function() {
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
			else if(Session.get('thereAreRequests') && Router.current().params.playlistId) {
				if (Session.get('thereAreRequests').length) {
					modalsToRet.push({'modalTemplateToUse': 'trackRecommendationChoiceModal'});
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