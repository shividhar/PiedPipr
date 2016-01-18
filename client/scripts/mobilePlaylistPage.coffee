if Meteor.isClient

# --------------------------------- START the youtube api shits (see musyncPlaylistScript.js) --------------------------------- 
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


# --------------------------------- END the youtube api shits --------------------------------- 

		self = this
		self.autorun(() ->
			#update recently viewed playlists list
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

	# set loop to false by default and scroll to top of page
	Template.mobilePlaylistPage.rendered = () ->
		$(window).scrollTop 0
		Session.set 'loopThisShit', false


	#clear all psuedo global and global variables
	Template.mobilePlaylistPage.destroyed = () ->
		Session.set 'results', []
		Session.set 'searchQ', ''
		Session.set 'thisPlaylistData', ''
		MiframeApiReady.set false
		MdataApiReady.set false


	Template.mobilePlaylistPage.helpers
	#search results --> set in the search input events
		searchResults: () ->
			Session.get 'results'

	#the lenght of the search query --> indicates wheter or not to show search resultss
		searchQLen: () ->
			if Session.get 'searchQ' then Session.get('searchQ').length else false

		# the list tracks in the current playlist
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

		# let the html blaze access the api's readiness state
		dataApiReady: () ->
			MdataApiReady

		#self explanatory
		thisPlaylistName: () ->
			if (Session.get 'thisPlaylistData') and Session.get('thisPlaylistData').playlistName then Session.get('thisPlaylistData').playlistName else 'Now playing'
		thisIsAuthor: () ->
			(Session.get 'thisPlaylistData') and Session.get('thisPlaylistData').authorId == Meteor.userId()
		thisPlaylistId: () ->
			Router.current().params.playlistId


	Template.mobilePlaylistPage.events

	# trigger youtube video search
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


		#close seach overflow
		'click #MsearchArea>span': () ->
			$('#MsearchPanel').hide()
			$('#MsearchArea>input').val ''
			Session.set 'results', []
			Session.set 'searchQ', ''

		#show search overflow
		'click #MplayerControls>p': () ->
			$('#MsearchPanel').show();

		#play next video
		'click #MplayerControls>a:first-of-type': () ->
			if (Session.get('currentlyPlayedVideo') isnt 0)
				Session.set 'updatedShits', true
				Session.set 'currentlyPlayedVideo', Session.get('currentlyPlayedVideo')-1
				Session.set 'updatedShits', false
				Mplayer.loadVideoById Session.get('thisPlaylistData').songList[Session.get('currentlyPlayedVideo')]

		#play previous video
		'click #MplayerControls>a:last-of-type': () ->
			if (Session.get('currentlyPlayedVideo')+1 isnt Session.get('thisPlaylistData').songList.length)
				Session.set 'updatedShits', true
				Session.set 'currentlyPlayedVideo', Session.get('currentlyPlayedVideo')+1
				Session.set 'updatedShits', false
				Mplayer.loadVideoById Session.get('thisPlaylistData').songList[Session.get('currentlyPlayedVideo')]

		#toggle looping
		'click #MnowPlaying #MloopThisShit': () ->
			if $('#MloopThisShit').hasClass 'isBolded'
				Session.set 'loopThisShit', false
				$('#MloopThisShit').removeClass 'isBolded'
			else
				Session.set 'loopThisShit', true
				$('#MloopThisShit').addClass 'isBolded'

		#suffle playlist
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


		# open playlist sharing modal, get qr code image and update html accordingly
		'click #MnowPlaying #MopenPlaylistSharingModal': () ->
			if $('#MshareCodeOverflow>img').attr 'src' != ("https://api.qrserver.com/v1/create-qr-code/?size=96x96&data="+Router.current().params.playlistId)
				$('#MshareCodeOverflow>img').attr 'src', ("https://api.qrserver.com/v1/create-qr-code/?size=96x96&data="+Router.current().params.playlistId)
			$('#MshareCodeOverflow').show()
			$('#MshareCodeOverflow>input').select()

		#close playlist sharing modal
		'click #MshareCodeOverflow>span': () ->
			$('#MshareCodeOverflow').hide()

		#toggle autoaccepting of track reccomendations
		'click #MnowPlaying #MenableAutoAcceptingTrackRecomms': () ->
			if $('#MenableAutoAcceptingTrackRecomms').hasClass('isBolded')
				Session.set 'enableAutoAcceptingTrackRecomms', false
				$('#MenableAutoAcceptingTrackRecomms').removeClass('isBolded').text 'Auto accept track recommendations'
			else
				Session.set 'enableAutoAcceptingTrackRecomms', true
				$('#MenableAutoAcceptingTrackRecomms').addClass('isBolded').text 'Disable auto acceptting of track recommendations'

