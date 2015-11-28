    var apiKey = "AIzaSyD-29IN9uHhfvIVgQw9foPpz31bMc0bGE0";
  
    player = undefined;
    dataApiReady = new ReactiveVar(false);
    iframeApiReady = new ReactiveVar(false);
    currentlyPlayedVideo = 0;
    
    var queuedVideo;
    
    function youtubeDataApiLoaded(){
        dataApiReady.set(true);
    };
    
// YouTube API will call onYouTubeIframeAPIReady() when API ready.
    // Make sure it's a global variable.
    onYouTubeIframeAPIReady = function () {

        // New Video Player, the first argument is the id of the div.
        // Make sure it's a global variable.
        player = new YT.Player("player", {

            height: "240", 
            width: "520", 

            // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
            videoId: "", 

            // Events like ready, state change, 
            events: {
                onReady: function (event) {
                    iframeApiReady.set(true);
                    if (Router.current().data().playlist.songList.length) {
                        $('.songNotReadyShowThis').hide();
                        $('.songReadyShowThis').show();
                    };
                },
                onStateChange: function(event){
                    if(iframeApiReady.get())
                    {
                        if(event.data == 0){
                            if(currentlyPlayedVideo + 1 < Router.current().data().playlist.songList.length)
                            {
                                currentlyPlayedVideo++;
                                player.loadVideoById(Router.current().data().playlist.songList[currentlyPlayedVideo]);
                            }else{
                                currentlyPlayedVideo = 0;
                                player.loadVideoById(Router.current().data().playlist.songList[currentlyPlayedVideo]);
                            }
                            if (Router.current().data().playlist.songList.length == 0) {
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
                    }
                }

            }

        });

    };

    // YT.load();
    
    Template.musyncPlaylist.created = function(){
          var self = this;
          self.autorun(function() {

            if (self.data.playlist.songList) {
                if (self.data.playlist.songList.length) {
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
        $(window).scrollTop(0);
        setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'});}, 300);
        
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
    Template.playerItem.rendered = function () {
        if (gapi.client) {
            gapi.client.setApiKey(apiKey);
            gapi.client.load('youtube', 'v3').then(youtubeDataApiLoaded);
            var tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        };
    };
    Template.musyncPlaylist.destroyed = function () {
        Session.set('results', []);
        Session.set('searchQ', '');
        globalResizeFunctionArr.splice(globalResizeFunctionArr.indexOf(playListResizeFunc), 1);
        dataApiReady.set(false);
        iframeApiReady.set(false);
    };
    Template.musyncPlaylist.helpers({
        searchResults : function(){
            return Session.get('results');
        },
        searchQLen: function() {
            return Session.get('searchQ')? Session.get('searchQ').length: false;
        },
        songList: function(){
            if (this.playlist.songList) {
                if (this.playlist.songList.length) {
                    var re = new Array(this.playlist.songList.length);
                    for(var i = 0; i < this.playlist.songList.length; i++){
                        re[i] = {videoId: this.playlist.songList[i], songPosition: i};
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
                                var item = response.items[i];
                                results.push({ videoId: item.id.videoId, resultTitle: item.snippet.title, resultAuthor: item.snippet.channelTitle, resultThumb: item.snippet.thumbnails.default.url });
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
        }
    })