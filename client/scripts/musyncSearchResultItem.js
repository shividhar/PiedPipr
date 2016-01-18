


//the search results template events

//self explanatory
Template.musyncSearchResultItem.helpers({
    resultName: function(){
        return this.resultName;
    }, 
    resultAuthor: function(){
        return this.resultAuthor;
    }, 
    resultThumb: function(){
        return this.resultThumb;
    },
    videoId: function(){
        return this.videoId;
    }
});




Template.musyncSearchResultItem.events({

    //if the user wants to add the song to the playlist
    'click .songlistAdd': function(e) {
        var $this = $(e.currentTarget);
        var videoId = this.videoId;
        if ($this.children('span').is(':visible')) {
            return;
        }
        else{
            $this.children('span').show();
        };
        Meteor.call('addSongToPlaylist', {"videoId": videoId, playlistId: Router.current().params.playlistId}, function(err){
            $this.children('span').hide();
            if(!err){

                // if successful and this is the author, do the following
                if (Session.get('thisPlaylistData').authorId == Meteor.userId()) {
                    var playlist = Playlists.findOne({"playlistId": Router.current().params.playlistId});
                    if(playlist){
                        if(playlist.songList.length == 1){
                            Session.set("firstSongId", playlist.songList[0])
                        }
                    }
                }

                //otherwise let the user know that the recommendation has been sent to the playlist author
                else{
                    alert("Track recommendation sent!");
                };

                //hide search overlay that has been shown if the device is mobile
                if (Meteor.Device.isPhone()) {
                    $('#MsearchPanel').hide(); $('#MsearchArea>input').val('');
                    Session.set('results', []);
                    Session.set('searchQ', '');
                };
            }
        });
    }
});