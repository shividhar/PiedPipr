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
	    		        "playlistId": playlistId,
	    		        "songList": []
		        	}
		        	if(Meteor.userId()){
		        		playlistObject.push(Meteor.userId())
		        	}
		            insertedPlaylistId = Playlists.insert(playlistObject)
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
		    if(Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId})){
		        Playlists.update({"playlistId":playlistData. playlistId}, {$pull: {"songList": playlistData.videoId}})
		    }else{
		        throw new Meteor.Error("Something went wrong.");
		    }
		},
		moveSongInPlaylist: function(playlistData){
		    if(typeof(playlistData.songPosition) != 'undefined' && isNaN(playlistData.songPosition)){
		        throw new Meteor.Error("Something went wrong.")
		    }
		    if(Playlists.findOne({"playlistId": playlistData.playlistId, "songList": playlistData.videoId})){
		        Playlists.update({"playlistId": playlistData. playlistId}, {$pull: {"songList": playlistData.videoId}})
		        Playlists.update({"playlistId": playlistData.playlistId}, {$push: {"songList": {$each: [playlistData.videoId], $position: Math.abs(playlistData.songPosition)}}})
		    }else{
		        throw new Meteor.Error("Playlist doens't exist.")
		    }
		}
	})
}