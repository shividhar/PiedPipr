if(Meteor.isClient){
    var apiKey = "AIzaSyD-29IN9uHhfvIVgQw9foPpz31bMc0bGE0";
  
    player = undefined;
    dataApiReady = new ReactiveVar(false);
    iframeApiReady = new ReactiveVar(false);
    // currentlyPlayedVideo = 0;
    var queuedVideo;
    
    function youtubeDataApiLoaded(){
        dataApiReady.set(true);
    };
    
    // YouTube API will call onYouTubeIframeAPIReady() when API ready.
    // Make sure it's a global variable.
    onYouTubeIframeAPIReady = function (){
        // New Video Player, the first argument is the id of the div.
        // Make sure it's a global variable.
        player = new YT.Player("player", {

            height: "240", 
            width: "520", 

            // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
            videoId: Session.get("firstSongId"), 

            // Events like ready, state change, 
            events: {
                onReady: function (event) {
                    Session.set('updatedShits', true);
                    iframeApiReady.set(true);
                    if (Session.get('thisPlaylistData').songList.length) {
                        $('.songNotReadyShowThis').hide();
                        $('.songReadyShowThis').show();
                        event.target.playVideo();
                    };
                    Session.set('updatedShits', false);
                },
                onStateChange: function(event){
                    Session.set('updatedShits', true);
                    if(event.data == 0){
                        if(Session.get('currentlyPlayedVideo') + 1 < Session.get('thisPlaylistData').songList.length){
                            Session.set('currentlyPlayedVideo', Session.get('currentlyPlayedVideo')+1);
                        }
                        else if(Session.get('loopThisShit')){
                            Session.set('currentlyPlayedVideo', 0);
                        }
                        else{
                            var vids = $('#player').get(0);
                            if(vids)
                                vids.stopVideo();
                            return;
                        };
                        player.loadVideoById(Session.get('thisPlaylistData').songList[Session.get('currentlyPlayedVideo')]);


                        if (Session.get('thisPlaylistData').songList.length == 0) {
                            player.stopVideo();
                            $('.songNotReadyShowThis').show();
                            $('.songReadyShowThis').hide();
                            var vids = $('#player').get(0);
                            if(vids)
                                vids.stopVideo();
                        }
                        else{
                            $('.songNotReadyShowThis').hide();
                            $('.songReadyShowThis').show();
                        };
                    }
                    Session.set('updatedShits', false);
                }

            }

        });
    };
    YT.load();
    Template.musyncPlaylist.created  = function(){
        Session.set('currentlyPlayedVideo', 0);
        // var tag = document.createElement('script');
        // tag.src = "https://www.youtube.com/iframe_api";
        // var firstScriptTag = document.getElementsByTagName('script')[0];

        // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        if(YT){
            YT.load();
        }
        if (gapi.client) {
            gapi.client.setApiKey(apiKey);
            gapi.client.load('youtube', 'v3').then(youtubeDataApiLoaded);
        };
        var self = this;
        self.autorun(function() {
            if (Session.get('thisPlaylistData').songList) {
                if (Session.get('thisPlaylistData').songList.length) {
                    $('.songNotReadyShowThis').hide();
                    $('.songReadyShowThis').show();
                }
                else{
                    $('.songNotReadyShowThis').show();
                    $('.songReadyShowThis').hide();
                    var vids = $('#player').get(0);
                    if(vids)
                        vids.stopVideo();
                };
            }
            else{
                $('.songNotReadyShowThis').show();
                $('.songReadyShowThis').hide();
                var vids = $('#player').get(0);
                if (vids) 
                    vids.stopVideo();
            };
        });
    };
    function playListResizeFunc(winh, winw) {
        $('#searchPanel, #playlistPanel').height(winh - 96);
        $('#playList').height($('#playlistPanel').height() - 324);
    };
    Template.musyncPlaylist.rendered = function () {
        Session.set('loopThisShit', true);
        $(window).scrollTop(0);
        $('#footer').show();
        setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);
        
        globalResizeFunctionArr.push(playListResizeFunc);

        $('#searchPanel, #playList').on('mousewheel',function(event) {
            var evt = event || window.event;
            var thisItemHeight = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
            var maxScroll = $(this)[0].scrollHeight - thisItemHeight;
            if ($(this).scrollTop()>(maxScroll-1) && (evt.deltaY<0)) {
                event.preventDefault();
                return false;
            }
            else if ($(this).scrollTop()<1  && (evt.deltaY>0)) {
                event.preventDefault();
                return false;
            };
        });
    };
    Template.musyncPlaylist.destroyed = function () {
        Session.set('results', []);
        Session.set('searchQ', '');
        globalResizeFunctionArr.splice(globalResizeFunctionArr.indexOf(playListResizeFunc), 1);
        iframeApiReady.set(false);
        dataApiReady.set(false);
        Session.set('thisPlaylistData', '');

        $('#bodyItem').removeAttr('style').addClass('isTempNoShow');
        Session.set('bodyTemplateWait', false);
        $('#footer').hide();
    };
    Template.musyncPlaylist.helpers({
        searchResults : function(){
            return Session.get('results');
        },
        searchQLen: function() {
            return Session.get('searchQ')? Session.get('searchQ').length: false;
        },
        songList: function(){
            if(Session.get('thisPlaylistData')){
                if (Session.get('thisPlaylistData').songList) {
                    if (Session.get('thisPlaylistData').songList.length) {
                        var re = new Array(Session.get('thisPlaylistData').songList.length);
                        for(var i = 0; i < Session.get('thisPlaylistData').songList.length; i++){
                            re[i] = {videoId: Session.get('thisPlaylistData').songList[i], songPosition: i};
                        };
                        $('.songNotReadyShowThis').hide();
                        $('.songReadyShowThis').show();
                        return re;
                    }
                    else{
                        $('.songNotReadyShowThis').show();
                        $('.songReadyShowThis').hide();
                        var vids = $('#player').get(0);
                        if (vids) 
                            vids.stopVideo();
                    };
                }
                else{
                    $('.songNotReadyShowThis').show();
                    $('.songReadyShowThis').hide();
                    var vids = $('#player').get(0);
                    if (vids) 
                        vids.stopVideo();
                };
            }
        },
        dataApiReady: function() {
            return dataApiReady;
        }
    });
    var searchKeyupTimeout;
    Template.musyncPlaylist.events({
        'keyup input[name="searchQueryInput"]': function(e){
            var $thisval = $(e.target).val();
                if(dataApiReady){
                    clearTimeout(searchKeyupTimeout);
                    searchKeyupTimeout = setTimeout(function() {
                        var request = gapi.client.youtube.search.list({q: $thisval, maxResults: 10, part: 'snippet'});
                        request.execute(function(response){
                            var results = [];
                            for(var i in response.items){
                                //Filtering out YouTube Playlists
                                if(response.items[i].id.videoId){
                                    var item = response.items[i];
                                    results.push({ videoId: item.id.videoId, resultTitle: item.snippet.title, resultAuthor: item.snippet.channelTitle, resultThumb: item.snippet.thumbnails.default.url });
                                }
                            };
                            
                            Session.set('results', results);
                        });
                    }, 600);
                };
                Session.set('searchQ', $thisval);
        },
        'focus #searchArea>input': function() {
            $('#searchArea>img').css({'height': '24px', 'margin-top': '18px', 'margin-right': '18px'});
        },
        'blur #searchArea>input': function() {
            $('#searchArea>img').removeAttr('style');
        },
        'click #searchArea>img': function() {
            $('#searchArea>input').focus();
        },
        'click #loopThisShit': function() {
            if ($('#loopThisShit').hasClass('isBolded')) {
                Session.set('loopThisShit', false);
                $('#loopThisShit').removeClass('isBolded');
            }
            else{
                Session.set('loopThisShit', true);
                $('#loopThisShit').addClass('isBolded');
            };
        },
        'click #shuffleThisShit': function() {

        },
        'click #playerControls>a:first-of-type': function() {
            if (Session.get('currentlyPlayedVideo') !== 0) {
                Session.set('currentlyPlayedVideo', Session.get('currentlyPlayedVideo')-1);
            };
        },
        'click #playerControls>a:last-of-type': function() {
            if (Session.get('currentlyPlayedVideo')+1 !== Session.get('thisPlaylistData').songList.length) {
                Session.set('currentlyPlayedVideo', Session.get('currentlyPlayedVideo')+1);
            };
        }
    })
}