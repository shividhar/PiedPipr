if(Meteor.isClient){




    //the youtube api key
    var apiKey = "AIzaSyDkCK9qItgb5rHtzZnHz78auN-18pGq5zI";
  
    player = undefined;

    //reactive variables to check if desktop api is ready
    dataApiReady = new ReactiveVar(false);
    iframeApiReady = new ReactiveVar(false);
    

    //reactive vars to check if mobile api is ready
    MdataApiReady = new ReactiveVar(false)
    MiframeApiReady = new ReactiveVar(false)

    // currentlyPlayedVideo = 0;
    var queuedVideo;
    
    //once youtube data api loads, set respective reactive vars to true
    function youtubeDataApiLoaded(){
        dataApiReady.set(true);
    };
 



//   ------------------------------------------ GLOBAL YOUTUBE SHIT  ------------------------------------------

//this function will be called by the api on api ready
    onYouTubeIframeAPIReady = function (){

        // if mobile
        if (Meteor.Device.isPhone()) {

            //run code accordingly
            Mplayer = new YT.Player("Mplayer", {

                height: "240", 
                width: $(window).width(),  //make width based on mobile device width


                videoId: Session.get("firstSongId"), 


                //work uniquely with mobile variables on events

                events: {
                    onReady: function (event) {
                        MiframeApiReady.set(true);
                    },
                    onStateChange: function(event){
                        Session.set('updatedShits', true);
                        if(event.data == 0){
                            if(Session.get('currentlyPlayedVideo') + 1 < Session.get('thisPlaylistData').songList.length)
                                Session.set('currentlyPlayedVideo', Session.get('currentlyPlayedVideo')+1);
                            else if(Session.get('loopThisShit'))
                                Session.set('currentlyPlayedVideo', 0);
                            else
                                return;

                            Mplayer.loadVideoById(Session.get('thisPlaylistData').songList[Session.get('currentlyPlayedVideo')]);
                        }
                        Session.set('updatedShits', false);
                    }

                }

            });
        }

        // if desktop or non-phone device
        else{


            player = new YT.Player("player", {
                //fixed player deminsions
                height: "240", 
                width: "520", 

                // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
                videoId: Session.get("firstSongId"), 

                // Events like ready, state change, --> work with desktop js variabless
                
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
                                if(vids && dataApiReady && $('iframe')[0])
                                    vids.stopVideo();
                                return;
                            };
                            player.loadVideoById(Session.get('thisPlaylistData').songList[Session.get('currentlyPlayedVideo')]);


                            if (Session.get('thisPlaylistData').songList.length == 0) {
                                player.stopVideo();
                                $('.songNotReadyShowThis').show();
                                $('.songReadyShowThis').hide();
                                var vids = $('#player').get(0);
                                if(vids && dataApiReady && $('iframe')[0])
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
    };

    //execute loading of the youtube api on client ready
    YT.load();








    Template.musyncPlaylist.created = function(){
        //set the current video to 0 
        Session.set('currentlyPlayedVideo', 0);
        //old code

                    // var tag = document.createElement('script');
                    // tag.src = "https://www.youtube.com/iframe_api";
                    // var firstScriptTag = document.getElementsByTagName('script')[0];

                    // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // if hasn't loaded already and available, load yt api on creation of playlist

        if(YT){
            YT.load();
        }

        // load gapi client for youtbe data as well
        if (gapi.client) {
            gapi.client.setApiKey(apiKey);
            gapi.client.load('youtube', 'v3').then(youtubeDataApiLoaded);
        };



        var self = this;
        self.autorun(function() { //reactive variable based code to manipulate songs


            //if playlist data is available
            if (Session.get('thisPlaylistData') && Session.get('thisPlaylistData').songList) {

                //if there is more than one track in the playlist, show the player
                if (Session.get('thisPlaylistData').songList.length) {
                    $('.songNotReadyShowThis').hide();
                    $('.songReadyShowThis').show();
                }
                else{

                    //otherwise hide the player and indicate that the user has to add videos

                    $('.songNotReadyShowThis').show();
                    $('.songReadyShowThis').hide();
                    var vids = $('#player').get(0);
                    if(vids && dataApiReady && $('iframe')[0])
                        vids.stopVideo();
                };
            }
            else{ //if playlistdata not ready, let user know

                $('.songNotReadyShowThis').show();
                $('.songReadyShowThis').hide();
                var vids = $('#player').get(0);
                if (vids && dataApiReady && $('iframe')[0]) 
                    vids.stopVideo();
            };


            //update the list of playlists the user has viewed for the 'Viewed playlists' button


            var vidsData = Session.get('localVideosViewedData');
            if (vidsData && vidsData.length) {
                for (var i = vidsData.length - 1; i >= 0; i--) {
                    if (vidsData[i].playlistId == Router.current().params.playlistId) {
                        break;
                    }
                    else if(i==0 && Session.get('thisPlaylistData')){
                        vidsData = vidsData.length < 12? vidsData: vidsData.slice(0, 10);
                        vidsData.push({
                            "playlistId": Router.current().params.playlistId,
                            "playlistName": Session.get('thisPlaylistData').playlistName,
                            "lastViewed": new Date()
                        });
                        Session.setPersistent('localVideosViewedData', vidsData);
                    };
                };
            }
            else if(Session.get('thisPlaylistData')){
                Session.setPersistent('localVideosViewedData', [{
                    "playlistId": Router.current().params.playlistId,
                    "playlistName": Session.get('thisPlaylistData').playlistName,
                    "lastViewed": new Date()
                }]);
            };
        });


    };

    //function to execute on resizing of desktop playlist

    function playListResizeFunc(winh, winw) {
        $('#searchPanel, #playlistPanel').height(winh - 96);
        $('#playList').height($('#playlistPanel').height() - 324);
    };



    Template.musyncPlaylist.rendered = function () {
        //set looping playlist to true by default
        Session.set('loopThisShit', true);

        //animate playlist page in
        $(window).scrollTop(0);
        $('#footer').show();
        setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);
        

        //see container.js
        globalResizeFunctionArr.push(playListResizeFunc);



        // this is to prevent scrolling background once div has been scrolled fully
            //uses the jqueryMousWheel.js script (plugin available online)
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
        
        // clear all pseudo globals and globals set while operating playlist player    
        Session.set('results', []);
        Session.set('searchQ', '');
        globalResizeFunctionArr.splice(globalResizeFunctionArr.indexOf(playListResizeFunc), 1);
        iframeApiReady.set(false);
        dataApiReady.set(false);
        Session.set('thisPlaylistData', '');


        //animate the page out
        $('#bodyItem').removeAttr('style').addClass('isTempNoShow');
        Session.set('bodyTemplateWait', false);
        $('#footer').hide();
    };



    Template.musyncPlaylist.helpers({

        //retrieved from the events
        searchResults : function(){
            return Session.get('results');
        },

        //the lenght of the search query --> so we know to show search results or not
        searchQLen: function() {
            return Session.get('searchQ')? Session.get('searchQ').length: false;
        },

        

        // list of videos added to the current playlist
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
                        if (vids && dataApiReady && $('iframe')[0]) 
                            vids.stopVideo();
                    };
                }
                else{
                    $('.songNotReadyShowThis').show();
                    $('.songReadyShowThis').hide();
                    var vids = $('#player').get(0);
                    if (vids && dataApiReady && $('iframe')[0]) 
                        vids.stopVideo();
                };
            }
        },

        //check if youtube data api is ready on the html blaze
        dataApiReady: function() {
            return dataApiReady;
        },

        // get this playlist name and author
        thisPlaylistName: function() {
            return Session.get('thisPlaylistData') && Session.get('thisPlaylistData').playlistName? Session.get('thisPlaylistData').playlistName: 'Now playing';
        },
        thisIsAuthor: function() {
            return Session.get('thisPlaylistData') && Session.get('thisPlaylistData').authorId == Meteor.userId();
        }
    });



    var searchKeyupTimeout; //timeout so a search query isn't executed on every keyup
    
    Template.musyncPlaylist.events({
        'keyup input[name="searchQueryInput"]': function(e){
            var $thisval = $(e.target).val();

            // if data api is ready, set a timeout to execute a search in due time
            if(dataApiReady){
                clearTimeout(searchKeyupTimeout);
                searchKeyupTimeout = setTimeout(function() {
                    console.log(gapi.client)
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


                        // add search results to psuedo global var to use in the html (see helpers above)
                        Session.set('results', results);
                    });
                }, 600);


            };

            // for serach query length helper (see above)
            Session.set('searchQ', $thisval);
        },

        // simple animations to search input
        'focus #searchArea>input': function() {
            $('#searchArea>img').css({'height': '24px', 'margin-top': '18px', 'margin-right': '18px'});
        },
        'blur #searchArea>input': function() {
            $('#searchArea>img').removeAttr('style');
        },
        'click #searchArea>img': function() {
            $('#searchArea>input').focus();
        },


        // playlist playback preference event functions
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
            var thisData = Session.get('thisPlaylistData');
            var thisArr = thisData.songList;
            if (thisArr.length) {

                var currentVideoId = thisArr[Session.get('currentlyPlayedVideo')];

                function shuffle(array) {
                    var currentIndex = array.length, temporaryValue, randomIndex;

                    while (0 !== currentIndex) {
                        randomIndex = Math.floor(Math.random() * currentIndex);
                        currentIndex -= 1;

                        temporaryValue = array[currentIndex];
                        array[currentIndex] = array[randomIndex];
                        array[randomIndex] = temporaryValue;
                    };
                    return array;
                };
                thisData.songList = shuffle(thisArr);
                var newIndexOfVideo = thisData.songList.indexOf(currentVideoId);
                Session.set('currentlyPlayedVideo', newIndexOfVideo);
                Session.set('thisPlaylistData', thisData);
            };
        },


        // to go forward and backward in the playlist
        'click #playerControls>a:first-of-type': function() {
            if (Session.get('currentlyPlayedVideo') !== 0) {
                Session.set('currentlyPlayedVideo', Session.get('currentlyPlayedVideo')-1);
            };
        },
        'click #playerControls>a:last-of-type': function() {
            if (Session.get('currentlyPlayedVideo')+1 !== Session.get('thisPlaylistData').songList.length) {
                Session.set('currentlyPlayedVideo', Session.get('currentlyPlayedVideo')+1);
            };
        },

        // item id explains what this event does...
        'click #enableAutoAcceptingTrackRecomms': function() {
            if ($('#enableAutoAcceptingTrackRecomms').hasClass('isBolded')) {
                Session.set('enableAutoAcceptingTrackRecomms', false);
                $('#enableAutoAcceptingTrackRecomms').removeClass('isBolded').text('Auto accept track recommendations');
            }
            else{
                Session.set('enableAutoAcceptingTrackRecomms', true);
                $('#enableAutoAcceptingTrackRecomms').addClass('isBolded').text('Disable auto acceptting of track recommendations');
            };
        }
    })
}