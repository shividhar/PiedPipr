if(Meteor.isServer){
	Meteor.methods({
		createPlaylist: function(){
			var playlistId;	
			var insertedPlaylistId;
		    while(!Playlists.findOne({"playlistId": playlistId}) && (Playlists.find({}).count() != 2176782336)){
		        playlistId = Random.hexString(6).toUpperCase();
		        if(!Playlists.findOne({"playlistId": playlistId}) && (Playlists.find({}).count() != 2176782336)){
		        	var playlistObject = {
		        		"createdAt": new Date(),
		        		"authorId": Meteor.userId(),
	    		        "playlistId": playlistId,
	    		        "songList": []
		        	}

		            Playlists.insert(playlistObject)
		        }
		    }
		    return playlistId
		},
		addSongToPlaylist: function(playlistData){
		    if(playlistData.videoId == "" || typeof(playlistData.videoId) == 'undefined'){
		        throw new Meteor.Error("Please attach a video id");
		    }
		    if(Playlists.findOne({"playlistId": playlistData.playlistId})){
		        Playlists.update({"playlistId":playlistData. playlistId}, {$push: {"songList": playlistData.videoId}})
		    }else{
		        throw new Meteor.Error("Playlist doesn't exist.")
		    }
		},
		removeSongFromPlaylist: function(playlistData){
			if(typeof(playlistData.songPosition) != 'undefined' && isNaN(playlistData.songPosition)){
		        throw new Meteor.Error("Something went wrong.")
		    }
		    if(Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId})){
		    	var songPositionOperator = "songList." + playlistData.songPosition;
		        Playlists.update({"playlistId": playlistData.playlistId}, {$unset: {songPositionOperator: 1}}, {validate: false})
		        Playlists.update({"playlistId": playlistData.playlistId}, {$pull: {"songList": null}})
		    }else{
		        throw new Meteor.Error("Something went wrong.");
		    }
		},
		moveSongInPlaylist: function(playlistData){
		    if(typeof(playlistData.initalSongPosition) != 'undefined' && isNaN(playlistData.initalSongPosition) && typeof(playlistData.finalSongPosition) != 'undefined' && isNaN(playlistData.finalSongPosition)){
		        throw new Meteor.Error("Something went wrong.")
		    }
		    var playlist = Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId});
		    if(playlist){
		    	if(playlistData.finalSongPosition < playlist.songList){
			    	var songPositionOperator = EJSON.stringify("songList." + playlistData.initalSongPosition + ": 1");
			        Playlists.update({"playlistId": playlistData.playlistId}, {$unset: {songPositionOperator}}, {validate: false})
			        Playlists.update({"playlistId": playlistData.playlistId}, {$pull: {"songList": null}})

			        Playlists.update({"playlistId": playlistData.playlistId}, {$push: {"songList": {$each: [playlistData.videoId], $position: Math.abs(playlistData.finalSongPosition)}}})
			    }
		    }else{
		        throw new Meteor.Error("Playlist doesn't't exist.")
		    }
		}
	})
}