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

            height: "400", 
            width: "600", 

            // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
            videoId: "", 

            // Events like ready, state change, 
            events: {

                onReady: function (event) {
                    iframeApiReady.set(true);
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
                        }
                    }
                }

            }

        });

    };

    // YT.load();
    
    Template.musyncPlaylist.rendered = function(){
        $('body').attr({
            onload: function(){
                if(gapi.client){
                    gapi.client.setApiKey(apiKey);
                    gapi.client.load('youtube', 'v3').then(youtubeDataApiLoaded);
                    var tag = document.createElement('script');
                    tag.src = 'https://www.youtube.com/iframe_api';
                    document.head.appendChild(tag);
                    setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'});}, 300);
                }
            }()
        });
    };

    Template.musyncPlaylist.destroyed = function () {
        
    };
    Template.musyncPlaylist.helpers({
        searchResults : function(){
            return Session.get('results');
        },
        songList: function(){
            var re = new Array(this.playlist.songList.length);
            for(var i = 0; i < this.playlist.songList.length; i++){
                re[i] = {videoId: this.playlist.songList[i], songPosition:i};
            }
            return re;
        }
    });
    Template.musyncPlaylist.events({
        'click #searchButton, keydown #searchField': function(e){
            if(e.button == 0 || e.keyCode == 13){
                if(!dataApiReady){ document.getElementById('searchError').innerHTML = "Youtube Data API is not ready!"; return; }
                var request = gapi.client.youtube.search.list({q: document.getElementById('searchField').value, maxResults: 10, part: 'snippet'});
                request.execute(function(response){
                    var results = [];
                    for(var i in response.items){
                        var item = response.items[i];
                        results.push({ videoId: item.id.videoId, resultTitle: item.snippet.title, resultAuthor: item.snippet.channelTitle, resultThumb: item.snippet.thumbnails.default.url });
                    };
                    
                    Session.set('results', results);
                });
            }
        }
    })