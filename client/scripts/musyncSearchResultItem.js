Template.musyncSearchResultItem.helpers({
    resultName: function(){
        return this.resultName;//'test2';
    }, 
    resultAuthor: function(){
        return this.resultAuthor;//'test3';
    }, 
    resultThumb: function(){
        return this.resultThumb;//'http://wac.450f.edgecastcdn.net/80450F/hudsonvalleycountry.com/files/2015/01/cat4.jpg';
    },
    videoId: function(){
        return this.videoId;
    }
});

Template.musyncSearchResultItem.events({
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
                if (Session.get('thisPlaylistData').authorId == Meteor.userId()) {
                    var playlist = Playlists.findOne({"playlistId": Router.current().params.playlistId});
                    if(playlist){
                        if(playlist.songList.length == 1){
                            Session.set("firstSongId", playlist.songList[0])
                        }
                    }
                }
                else{
                    alert("Track recommendation sent!");
                };
                if (Meteor.Device.isPhone()) {
                    $('#MsearchPanel').hide(); $('#MsearchArea>input').val('');
                    Session.set('results', []);
                    Session.set('searchQ', '');
                };
            }
        });
    }
});