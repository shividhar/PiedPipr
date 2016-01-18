


//this is the template for the list of songs in the playlist

Template.musyncSongListItem.helpers({

    // api call for getting song data
    apiCall : function(){
        Session.set("songData" + this.videoId, { title: "", author: "", thumb: "", songPosition: this.songPosition });
        
        if(dataApiReady.get() || MdataApiReady.get())
        {
            var request = gapi.client.youtube.videos.list({part: 'snippet', id: this.videoId, maxResults: 1 });
            request.execute(
                function(response)
                {
                    if(response.items && response.items.length > 0)
                    {
                        var data = Session.get("songData" + response.items[0].id);
                        if(!data){
                            data = {};
                        }
                        data.title = response.items[0].snippet.title;
                        data.author = response.items[0].snippet.channelTitle;
                        data.thumb = response.items[0].snippet.thumbnails.default.url;

                        Session.set("songData" + response.items[0].id, data);
                    }
                }
            );
            
        }
       
        return this;
    },

    // check if current user is authoer; if so the user will have access to buttons that modify the playlist
    currentUserIsAuthor: function() {
        var playlist = Playlists.findOne({"playlistId": Router.current().params.playlistId});
        if(playlist){
            if(playlist.authorId == Meteor.userId()){
                return true
            }else{
                return false
            }
        }
    },
    videoId : function() {
        return this.videoId;
    },
    songPosition : function() {
        return this.songPosition;
    }, 
    songOriginPlaylist : function(){
        return Router.current().params.playlistId;
    }, 

    //video title
    songName: function(){
        return Session.get("songData" + this.videoId).title;
    },

    //video thumbnail
    songThumb : function(){
        return Session.get("songData" + this.videoId).thumb;
    },


    //video author
    songAuthor : function(){
        return Session.get("songData" + this.videoId).author;
    },

    //see if this video is currently being played
    isCurrentVideoItem: function() {
        var a = Session.get('updatedShits');
        return ((this.songPosition == Session.get('currentlyPlayedVideo'))? 'isCurrentVideoItem': '');
    }
});

Template.musyncSongListItem.rendered = function () {

    //show the player and let the user know the player is ready
    $('.songNotReadyShowThis').hide();
    $('.songReadyShowThis').show();
};



Template.musyncSongListItem.events({

    //move the song up on the playlist
    'click .songlistMoveUp': function(e){
        e.stopPropagation();
        if(this.songPosition !== 0){
            Session.set('updatedShits', true);
            Meteor.call("moveSongInPlaylist", { "videoId": this.videoId, "playlistId": Router.current().params.playlistId, "initalSongPosition": this.songPosition, "finalSongPosition": this.songPosition - 1 }, function(err) {
                Session.set('updatedShits', false);
            });
            Session.set('currentlyPlayedVideo', Session.get('currentlyPlayedVideo')-1);
        };
    }, 

    //move the song down on the playlist
    'click .songlistMoveDown': function(e){
        e.stopPropagation();
        if (this.songPosition+1 !== Session.get('thisPlaylistData').songList.length) {
            Session.set('updatedShits', true);
            Meteor.call("moveSongInPlaylist", { "videoId": this.videoId, "playlistId": Router.current().params.playlistId, "initalSongPosition": this.songPosition, "finalSongPosition": this.songPosition + 1 }, function(err) {
                setTimeout(function(){Session.set('updatedShits', true);Session.set('updatedShits', false);}, 1200);
            });
            Session.set('currentlyPlayedVideo', Session.get('currentlyPlayedVideo')+1);
        };
    }, 

    //remove the song from the playlist
    'click .songlistRemove': function(e){
        e.stopPropagation();
        Session.set('updatedShits', true);
        Meteor.call("removeSongFromPlaylist", { "videoId": this.videoId, "songPosition": this.songPosition, "playlistId": Router.current().params.playlistId}, function(err) {
            setTimeout(function(){Session.set('updatedShits', true);Session.set('updatedShits', false);}, 1200);
        });
    },

    //play this clicked song in the player
    'click .songlistButton': function(e){
        if(iframeApiReady.get()){
            Session.set('updatedShits', true);
            player.loadVideoById(this.videoId);
            Session.set('currentlyPlayedVideo', this.songPosition);
            Session.set('updatedShits', false);
        }
        else if(MiframeApiReady.get()){
            Session.set('updatedShits', true);
            Mplayer.loadVideoById(this.videoId);
            Session.set('currentlyPlayedVideo', this.songPosition);
            Session.set('updatedShits', false);
        }
    }
});