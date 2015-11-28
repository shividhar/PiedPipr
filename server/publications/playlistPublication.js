if(Meteor.isServer){
	Meteor.publish("playlist", function(playlistId) {
 		return Playlists.find({"playlistId": playlistId})
	});
	Meteor.publish("userPlaylist", function(){
	    return Playlists.find({"authorId": this.userId});
	})
}