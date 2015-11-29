Meteor.methods({
	createPlaylist: function(playlistData){
		if(Meteor.isServer){
			if(!Meteor.user() && !playlistData.authorId || !playlistData.playlistName){
				throw new Meteor.Error("Error");
			}
			var playlistId;	
			var insertedPlaylistId;
		    while(!Playlists.findOne({"playlistId": playlistId}) && (Playlists.find({}).count() != 2176782336)){
		        playlistId = Random.hexString(6).toUpperCase();
		        if(!Playlists.findOne({"playlistId": playlistId}) && (Playlists.find({}).count() != 2176782336)){
		        	var playlistObject = {
		        		"createdAt": new Date(),
	    		        "playlistId": playlistId,
	    		        "playlistName": playlistData.playlistName,
	    		        "songList": []
		        	}
		        	if(Meteor.userId()){
		        		_.extend(playlistObject, {"authorId": Meteor.userId()})
		        	}else{
		        		_.extend(playlistObject, {"authorId": playlistData.authorId})
		        	}
		            Playlists.insert(playlistObject)
		        }
		    }
		    return playlistId
		}
	},
	addSongToPlaylist: function(playlistData){
		if(Meteor.isClient){
		    if(playlistData.videoId == "" || typeof(playlistData.videoId) == 'undefined'){
		        throw new Meteor.Error("Please attach a video id");
		    }
		    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId});
		    if(playlist){
		    	if(playlist.authorId == Meteor.userId()){
			        Playlists.update({"playlistId": playlistData.playlistId}, {$push: {"songList": playlistData.videoId}})
		    	}else{
			        Playlists.update({"playlistId": playlistData.playlistId}, {$push: {"songListToApprove": playlistData.videoId}})
		    	}
		    }else{
		        throw new Meteor.Error("Playlist doesn't exist.")
		    }
		}else if(Meteor.isServer){
			if(playlistData.videoId == "" || typeof(playlistData.videoId) == 'undefined'){
		        throw new Meteor.Error("Please attach a video id");
		    }
		    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId});
		    if(playlist){
		    	if(playlist.authorId == Meteor.userId()){
			        Playlists.update({"playlistId": playlistData.playlistId}, {$push: {"songList": playlistData.videoId}})
		    	}else{
			        Playlists.update({"playlistId": playlistData.playlistId}, {$push: {"songListToApprove": playlistData.videoId}})
		    	}
		    }else{
		        throw new Meteor.Error("Playlist doesn't exist.")
		    }
		}
	},
	removeSongFromPlaylist: function(playlistData){
		if(Meteor.isClient){
			if(typeof(playlistData.songPosition) != 'undefined' && isNaN(playlistData.songPosition)){
		        throw new Meteor.Error("Something went wrong.")
		    }
		    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId});
		    if(playlist){
		    	if(playlist.authorId == Meteor.userId()){
			    	var updatedSongList = [];
			        _.each(playlist.songList, function(item, index){
			        	if(item != playlistData.videoId || index != playlistData.songPosition){
			        		updatedSongList.push(item)
			        	}
			        })
			        Playlists.update({"playlistId": playlistData.playlistId}, {$set: {"songList": updatedSongList}})
			    }
		    }else{
		        throw new Meteor.Error("Something went wrong.");
		    }
		}else if(Meteor.isServer){
			if(typeof(playlistData.songPosition) != 'undefined' && isNaN(playlistData.songPosition)){
		        throw new Meteor.Error("Something went wrong.")
		    }
		    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId});
		    if(playlist){
		    	if(playlist.authorId == Meteor.userId()){
			    	var updatedSongList = [];
			        _.each(playlist.songList, function(item, index){
			        	if(item != playlistData.videoId || index != playlistData.songPosition){
			        		updatedSongList.push(item)
			        	}
			        })
			        Playlists.update({"playlistId": playlistData.playlistId}, {$set: {"songList": updatedSongList}})
			    }
		    }else{
		        throw new Meteor.Error("Something went wrong.");
		    }
		}
	},
	removeUnapprovedSong: function(playlistData){
		if(Meteor.isClient){
			if(typeof(playlistData.songPosition) != 'undefined' && isNaN(playlistData.songPosition)){
				throw new Meteor.Error("Something went wrong.")
		    }
		    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId, "songListToApprove": playlistData.videoId});
		    if(playlist){
		    	if(playlist.authorId == Meteor.userId()){
			    	var updatedSongListToBeApproved = [];
			        _.each(playlist.songListToApprove, function(item, index){
			        	if(item != playlistData.videoId || index != playlistData.songPosition){
			        		updatedSongList.push(item)
			        	}
			        })
			        Playlists.update({"playlistId": playlistData.playlistId}, {$set: {"songListToApprove": updatedSongListToBeApproved}})
			    }
			}else{
		        throw new Meteor.Error("Something went wrong.");
		    }
		}else if(Meteor.isServer){
			if(typeof(playlistData.songPosition) != 'undefined' && isNaN(playlistData.songPosition)){
				throw new Meteor.Error("Something went wrong.")
		    }
		    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId, "songListToApprove": playlistData.videoId});
		    if(playlist){
		    	if(playlist.authorId == Meteor.userId()){
			    	var updatedSongListToBeApproved = [];
			        _.each(playlist.songListToApprove, function(item, index){
			        	if(item != playlistData.videoId || index != playlistData.songPosition){
			        		updatedSongList.push(item)
			        	}
			        })
			        Playlists.update({"playlistId": playlistData.playlistId}, {$set: {"songListToApprove": updatedSongListToBeApproved}})
			    }
			}else{
		        throw new Meteor.Error("Something went wrong.");
		    }
		}
	},
	moveSongInPlaylist: function(playlistData){
		if(Meteor.isClient){
		    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId});
		    if(playlist){
		    	if(playlist.authorId == Meteor.userId()){
					if(typeof(playlistData.initalSongPosition) != 'undefined' && isNaN(playlistData.initalSongPosition) && typeof(playlistData.finalSongPosition) != 'undefined' && isNaN(playlistData.finalSongPosition)){
				        throw new Meteor.Error("Something went wrong.")
				    }
				    var initalSongPosition = playlistData.initalSongPosition;
				    var finalSongPosition = playlistData.finalSongPosition;

			    	if(finalSongPosition >= 0 && finalSongPosition < playlist.songList.length){
			    		if(initalSongPosition > finalSongPosition){
	    					var tempSongId = playlist.songList[finalSongPosition];
	    					playlist.songList[finalSongPosition] = playlist.songList[initalSongPosition];
	    					playlist.songList[initalSongPosition] = tempSongId
	    				}else if(initalSongPosition < finalSongPosition){
	    					var tempSongId = playlist.songList[finalSongPosition];
	    					playlist.songList[finalSongPosition] = playlist.songList[initalSongPosition];
	    					playlist.songList[initalSongPosition] = tempSongId
	    				}
				        Playlists.update({"playlistId": playlistData.playlistId}, {$set: {"songList": playlist.songList}})
				    }
				}
		    }else{
		        throw new Meteor.Error("Playlist doesn't exist.")
		    }
		}else if(Meteor.isServer){
			var playlist = Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId});
		    if(playlist){
		    	if(playlist.authorId == Meteor.userId()){
					if(typeof(playlistData.initalSongPosition) != 'undefined' && isNaN(playlistData.initalSongPosition) && typeof(playlistData.finalSongPosition) != 'undefined' && isNaN(playlistData.finalSongPosition)){
				        throw new Meteor.Error("Something went wrong.")
				    }
				    var initalSongPosition = playlistData.initalSongPosition;
				    var finalSongPosition = playlistData.finalSongPosition;

			    	if(finalSongPosition >= 0 && finalSongPosition < playlist.songList.length){
			    		if(initalSongPosition > finalSongPosition){
	    					var tempSongId = playlist.songList[finalSongPosition];
	    					playlist.songList[finalSongPosition] = playlist.songList[initalSongPosition];
	    					playlist.songList[initalSongPosition] = tempSongId
	    				}else if(initalSongPosition < finalSongPosition){
	    					var tempSongId = playlist.songList[finalSongPosition];
	    					playlist.songList[finalSongPosition] = playlist.songList[initalSongPosition];
	    					playlist.songList[initalSongPosition] = tempSongId
	    				}
				        Playlists.update({"playlistId": playlistData.playlistId}, {$set: {"songList": playlist.songList}})
				    }
				}
		    }else{
		        throw new Meteor.Error("Playlist doesn't exist.")
		    }
		}
	},
	clearAllSongRequests: function(playlistData) {
		if(Meteor.isClient){
		    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId});
		    if(playlist){
		    	if(playlist.authorId == Meteor.userId()){
			        Playlists.update({"playlistId": playlistData.playlistId}, {$set: {"songListToApprove": []}})
			    }
			}else{
		        throw new Meteor.Error("Something went wrong.");
		    }
		}else if(Meteor.isServer){
		    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId});
		    if(playlist){
		    	if(playlist.authorId == Meteor.userId()){
			        Playlists.update({"playlistId": playlistData.playlistId}, {$set: {"songListToApprove": []}})
			    }
			}else{
		        throw new Meteor.Error("Something went wrong.");
		    }
		}
	}
})