Template.musyncSongListItem.helpers({
    apiCall : function(){
        Session.set("songData" + this.videoId, { title: "", author: "", thumb: "", songPosition: this.songPosition });
        
        if(dataApiReady.get())
        {
            var request = gapi.client.youtube.videos.list({part: 'snippet', id: this.videoId, maxResults: 1 });
            request.execute(
                function(response)
                {
                    if(response.items.length > 0)
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
        //Session.set("song" + this.songPosition, this);
        //return Session.get("song" + this.songPosition);
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
    songName : function(){
        return Session.get("songData" + this.videoId).title;
    }, 
    songThumb : function(){
        return Session.get("songData" + this.videoId).thumb;
    }, 
    songAuthor : function(){
        return Session.get("songData" + this.videoId).author;
    },
    isCurrentVideoItem: function() {
        var a = Session.get('updatedShits');
        return ((this.songPosition == Session.get('currentlyPlayedVideo'))? 'isCurrentVideoItem': '');
    }
});

Template.musyncSongListItem.rendered = function () {
    $('.songNotReadyShowThis').hide();
    $('.songReadyShowThis').show();
};

Template.musyncSongListItem.events({
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
    'click .songlistRemove': function(e){
        e.stopPropagation();
        Session.set('updatedShits', true);
        Meteor.call("removeSongFromPlaylist", { "videoId": this.videoId, "songPosition": this.songPosition, "playlistId": Router.current().params.playlistId}, function(err) {
            setTimeout(function(){Session.set('updatedShits', true);Session.set('updatedShits', false);}, 1200);
        });
    },
    'click .songlistButton': function(e){
        if(iframeApiReady.get()){
            Session.set('updatedShits', true);
            player.loadVideoById(this.videoId);
            Session.set('currentlyPlayedVideo', this.songPosition);
            Session.set('updatedShits', false);
        }
    }
});