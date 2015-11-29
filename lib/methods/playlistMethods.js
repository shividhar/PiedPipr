if(Meteor.isServer){
	Meteor.methods({
		createPlaylist: function(playlistData){
			if(Meteor.isServer){
				if(!Meteor.user() && !playlistData.authorId){
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
			    if(Playlists.findOne({"playlistId": playlistData.playlistId})){
			        Playlists.update({"playlistId": playlistData.playlistId}, {$push: {"songList": playlistData.videoId}})
			    }else{
			        throw new Meteor.Error("Playlist doesn't exist.")
			    }
			}else if(Meteor.isServer){
				if(playlistData.videoId == "" || typeof(playlistData.videoId) == 'undefined'){
			        throw new Meteor.Error("Please attach a video id");
			    }
			    if(Playlists.findOne({"playlistId": playlistData.playlistId})){
			        Playlists.update({"playlistId": playlistData.playlistId}, {$push: {"songList": playlistData.videoId}})
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
			    	var updatedSongList = [];
			        _.each(playlist.songList, function(item, index){
			        	if(item != playlistData.videoId && index != playlist.songPosition){
			        		updatedSongList.push(item)
			        	}
			        })
			        Playlists.update({"playlistId": playlistData.playlistId}, {$set: {"songList": updatedSongList}})
			    }else{
			        throw new Meteor.Error("Something went wrong.");
			    }
			}else if(Meteor.isServer){
				if(typeof(playlistData.songPosition) != 'undefined' && isNaN(playlistData.songPosition)){
			        throw new Meteor.Error("Something went wrong.")
			    }
			    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId});
			    if(playlist){
			    	var updatedSongList = [];
			        _.each(playlist.songList, function(item, index){
			        	if(item != playlistData.videoId && index != playlist.songPosition){
			        		updatedSongList.push(item)
			        	}
			        })
			        Playlists.update({"playlistId": playlistData.playlistId}, {$set: {"songList": updatedSongList}})
			    }else{
			        throw new Meteor.Error("Something went wrong.");
			    }
			}
		},
		moveSongInPlaylist: function(playlistData){
			if(Meteor.isClient){
				if(typeof(playlistData.initalSongPosition) != 'undefined' && isNaN(playlistData.initalSongPosition) && typeof(playlistData.finalSongPosition) != 'undefined' && isNaN(playlistData.finalSongPosition)){
			        throw new Meteor.Error("Something went wrong.")
			    }
			    var initalSongPosition = playlistData.initalSongPosition;
			    var finalSongPosition = playlistData.finalSongPosition;

			    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId});
			    if(playlist){
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
			    }else{
			        throw new Meteor.Error("Playlist doesn't't exist.")
			    }
			}else if(Meteor.isServer){
				if(typeof(playlistData.initalSongPosition) != 'undefined' && isNaN(playlistData.initalSongPosition) && typeof(playlistData.finalSongPosition) != 'undefined' && isNaN(playlistData.finalSongPosition)){
			        throw new Meteor.Error("Something went wrong.")
			    }
			    var initalSongPosition = playlistData.initalSongPosition;
			    var finalSongPosition = playlistData.finalSongPosition;

			    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId});
			    if(playlist){
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
			    }else{
			        throw new Meteor.Error("Playlist doesn't't exist.")
			    }
			}
		}
	})
}