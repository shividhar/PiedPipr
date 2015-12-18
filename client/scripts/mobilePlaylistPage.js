if (Meteor.isClient) {
	var apiKey = "AIzaSyD-29IN9uHhfvIVgQw9foPpz31bMc0bGE0";
  
    Mplayer = undefined;
    MdataApiReady = new ReactiveVar(false);
    MiframeApiReady = new ReactiveVar(false);
    // currentlyPlayedVideo = 0;
    var queuedVideo;
    
    function MyoutubeDataApiLoaded(){
        MdataApiReady.set(true);
    };
    
    // YouTube API will call onYouTubeIframeAPIReady() when API ready.
    // Make sure it's a global variable.
    Template.mobilePlaylistPage.created  = function(){

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
            gapi.client.load('youtube', 'v3').then(MyoutubeDataApiLoaded);
        };
        var self = this;
        self.autorun(function() {

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
    Template.mobilePlaylistPage.rendered = function () {
        $(window).scrollTop(0);
    };
    Template.mobilePlaylistPage.destroyed = function () {
		Session.set('results', []);
		Session.set('searchQ', '');
		Session.set('thisPlaylistData', '');
		MiframeApiReady.set(false);
		MdataApiReady.set(false);
    };
    Template.mobilePlaylistPage.helpers({
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
                        return re;
                    };
                };
            }
        },
        dataApiReady: function() {
            return MdataApiReady;
        },
        thisPlaylistName: function() {
            return Session.get('thisPlaylistData') && Session.get('thisPlaylistData').playlistName? Session.get('thisPlaylistData').playlistName: 'Now playing';
        },
        thisIsAuthor: function() {
            return Session.get('thisPlaylistData') && Session.get('thisPlaylistData').authorId == Meteor.userId();
        }
    });
    var searchKeyupTimeout;
    Template.mobilePlaylistPage.events({
        'click #MsearchArea>img': function(){
            var $thisval = $('#MsearchArea>input').val();
            if (!$thisval.trim()) {
            	$('#MsearchArea>input').select();
            };
            if(MdataApiReady){
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
        'click #MsearchArea>span': function() {
        	$('#MsearchPanel').hide();
        	Session.set('results', []);
			Session.set('searchQ', '');
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
};