Template.musyncSongListItem.helpers({
    "apiCall" : function()
    {
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
    }
    , "videoId" : function()
    {
        return this.videoId;
    }
    , "songPosition" : function()
    {
        return this.songPosition;
    }
    , "songOriginPlaylist" : function()
    {
        return Playlists.findOne().playlistId;
    }
    , "songName" : function()
    {
        return Session.get("songData" + this.videoId).title;
    }
    , "songThumb" : function()
    {
        return Session.get("songData" + this.videoId).thumb;
    }
    , "songAuthor" : function()
    {
        return Session.get("songData" + this.videoId).author;
    }
});

Template.musyncSongListItem.events({
    'click .songlistMoveUp': function(e)
    {
        if(this.songPosition !== 0)
        {
            Meteor.call("moveSongInPlaylist", { videoId: this.videoId, playlistId: Playlists.findOne().playlistId, songPosition: this.songPosition - 1 } );
        }
    }
    
    , 'click .songlistMoveDown': function(e)
    {
        Meteor.call("moveSongInPlaylist", { videoId: this.videoId, playlistId: Playlists.findOne().playlistId, songPosition: this.songPosition + 1 } );
    }
    
    , 'click .songlistRemove': function(e)
    {
        Meteor.call("removeSongFromPlaylist", { videoId: this.videoId, playlistId: Playlists.findOne().playlistId});
    },
    'click .songlistButton': function(e){
        if(iframeApiReady.get()){
            player.loadVideoById(this.videoId);
            currentlyPlayedVideo = this.songPosition;
        }
    }
});