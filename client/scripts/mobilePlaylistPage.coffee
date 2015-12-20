if Meteor.isClient
	apiKey = "AIzaSyD-29IN9uHhfvIVgQw9foPpz31bMc0bGE0"
	queuedVideo = undefined

	MyoutubeDataApiLoaded = () ->
		MdataApiReady.set true


	Template.mobilePlaylistPage.created = () ->
		Session.set 'currentlyPlayedVideo', 0

		YT.load() if YT

		if gapi.client
			gapi.client.setApiKey apiKey
			gapi.client.load('youtube', 'v3').then MyoutubeDataApiLoaded
		self = this
		self.autorun(() ->
			vidsData = Session.get 'localVideosViewedData'
			if vidsData and vidsData.length
				tempLoopFunc = (item) ->
					if item.playlistId is Router.current().params.playlistId
						return
					else if item is vidsData[0] and Session.get 'thisPlaylistData'?
						vidsData = if vidsData.length < 12 then vidsData else vidsData.slice(0, 10)
						vidsData.push(
							"playlistId": Router.current().params.playlistId
							"playlistName": Session.get('thisPlaylistData').playlistName
							"lastViewed": new Date()
						)
						Session.setPersistent 'localVideosViewedData', vidsData

				tempLoopFunc(vidData) for vidData in vidsData
			else if (Session.get 'thisPlaylistData')?
				Session.setPersistent('localVideosViewedData', [
					"playlistId": Router.current().params.playlistId
					"playlistName": Session.get('thisPlaylistData').playlistName
					"lastViewed": new Date()
				])
		)
	Template.mobilePlaylistPage.rendered = () ->
		$(window).scrollTop 0
		Session.set 'loopThisShit', false

	Template.mobilePlaylistPage.destroyed = () ->
		Session.set 'results', []
		Session.set 'searchQ', ''
		Session.set 'thisPlaylistData', ''
		MiframeApiReady.set false
		MdataApiReady.set false
	Template.mobilePlaylistPage.helpers
		searchResults: () ->
			Session.get 'results'
		searchQLen: () ->
			if Session.get 'searchQ' then Session.get('searchQ').length else false
		songList: () ->
			if Session.get 'thisPlaylistData'
				if Session.get('thisPlaylistData').songList
					if Session.get('thisPlaylistData').songList.length
						re = new Array(Session.get('thisPlaylistData').songList.length)
						i = 0
						while i < re.length
							re[i] =
								videoId: Session.get('thisPlaylistData').songList[i]
								songPosition: i
							i++
						re
		dataApiReady: () ->
			MdataApiReady
		thisPlaylistName: () ->
			if (Session.get 'thisPlaylistData') and Session.get('thisPlaylistData').playlistName then Session.get('thisPlaylistData').playlistName else 'Now playing'
		thisIsAuthor: () ->
			(Session.get 'thisPlaylistData') and Session.get('thisPlaylistData').authorId == Meteor.userId()
		thisPlaylistId: () ->
			Router.current().params.playlistId
	Template.mobilePlaylistPage.events
		'click #MsearchArea>img': () ->
			$thisval = $('#MsearchArea>input').val()

			if not $thisval.trim()
				$('#MsearchArea>input').select()
			else if MdataApiReady
				request = gapi.client.youtube.search.list(
					q: $thisval
					maxResults: 10
					part: 'snippet'
				)
				request.execute((response) ->
					if not response
						return
					results = []
					(if item.id.videoId then results.push(
						videoId: item.id.videoId
						resultTitle: item.snippet.title
						resultAuthor: item.snippet.channelTitle
						resultThumb: item.snippet.thumbnails.default.url
					)) for item in response.items
					Session.set 'results', results
				)
			Session.set 'searchQ', $thisval
		'click #MsearchArea>span': () ->
			$('#MsearchPanel').hide()
			$('#MsearchArea>input').val ''
			Session.set 'results', []
			Session.set 'searchQ', ''
		'click #MplayerControls>p': () ->
			$('#MsearchPanel').show();
		'click #MplayerControls>a:first-of-type': () ->
			if (Session.get('currentlyPlayedVideo') isnt 0)
				Session.set 'updatedShits', true
				Session.set 'currentlyPlayedVideo', Session.get('currentlyPlayedVideo')-1
				Session.set 'updatedShits', false
				Mplayer.loadVideoById Session.get('thisPlaylistData').songList[Session.get('currentlyPlayedVideo')]
		'click #MplayerControls>a:last-of-type': () ->
			if (Session.get('currentlyPlayedVideo')+1 isnt Session.get('thisPlaylistData').songList.length)
				Session.set 'updatedShits', true
				Session.set 'currentlyPlayedVideo', Session.get('currentlyPlayedVideo')+1
				Session.set 'updatedShits', false
				Mplayer.loadVideoById Session.get('thisPlaylistData').songList[Session.get('currentlyPlayedVideo')]
		'click #MnowPlaying #MloopThisShit': () ->
			if $('#MloopThisShit').hasClass 'isBolded'
				Session.set 'loopThisShit', false
				$('#MloopThisShit').removeClass 'isBolded'
			else
				Session.set 'loopThisShit', true
				$('#MloopThisShit').addClass 'isBolded'

		'click #MnowPlaying #MshuffleThisShit': () ->
			thisData = Session.get('thisPlaylistData')
			thisArr = thisData.songList

			shuffle = (array) ->
				currentIndex = array.length
				temporaryValue = undefined
				randomIndex = undefined
				while 0 != currentIndex
					randomIndex = Math.floor(Math.random() * currentIndex)
					currentIndex -= 1
					temporaryValue = array[currentIndex]
					array[currentIndex] = array[randomIndex]
					array[randomIndex] = temporaryValue
				array

			if thisArr.length
				currentVideoId = thisArr[Session.get('currentlyPlayedVideo')]
				thisData.songList = shuffle(thisArr)
				newIndexOfVideo = thisData.songList.indexOf(currentVideoId)
				Session.set 'currentlyPlayedVideo', newIndexOfVideo
				Session.set 'thisPlaylistData', thisData
		'click #MnowPlaying #MopenPlaylistSharingModal': () ->
			$('#MshareCodeOverflow>img').attr 'src', ("https://api.qrserver.com/v1/create-qr-code/?size=96x96&data="+Router.current().params.playlistId)
			$('#MshareCodeOverflow').show()
			$('#MshareCodeOverflow>input').select()
		'click #MshareCodeOverflow>span': () ->
			$('#MshareCodeOverflow').hide()
		'click #MnowPlaying #MenableAutoAcceptingTrackRecomms': () ->
			if $('#MenableAutoAcceptingTrackRecomms').hasClass('isBolded')
				Session.set 'enableAutoAcceptingTrackRecomms', false
				$('#MenableAutoAcceptingTrackRecomms').removeClass('isBolded').text 'Auto accept track recommendations'
			else
				Session.set 'enableAutoAcceptingTrackRecomms', true
				$('#MenableAutoAcceptingTrackRecomms').addClass('isBolded').text 'Disable auto acceptting of track recommendations'

