Meteor.startup(function () {
    Router.configure({
        notFoundTemplate: 'notFound',
        loadingTemplate: 'container'//,
        // trackPageView: true
    });

    Router.map(function() {
        this.route("splashPage", {
            path: "/",
            onBeforeAction: function() {
              document.title = "Welcome to PiedPipr.";
              if(Meteor.Device.isPhone()){
                Router.go("/mobile")
              }
              this.next();
            },
            template: "container",
            data: function() {
              if (!Session.get('bodyTemplateWait')) {
                setTimeout(function() {
                  Session.set('bodyTemplateWait', true);
                }, 1200);
                // setTimeout(executeResizeFuncs, 15);
              }
              else{
                return ({
                  "bodyTemplate": "splashPage"
                });
              };
            }
        }),
        this.route("playlist", {
            path: "/p/:playlistId",
            waitOn: function(){
              return Meteor.subscribe("playlist", this.params.playlistId); 
            },
            template: "container",
            onBeforeAction: function(){
              if(this.ready()){
                var playlist = Playlists.findOne({"playlistId": this.params.playlistId});
                  if(playlist){
                    if(playlist.songList[0]){
                      Session.set("firstSongId", playlist.songList[0])
                    }
                    document.title = "Playlist";

                    if(Meteor.Device.isPhone()){
                      Router.go("/mobile")
                    }

                    this.next();
                  }else{
                      Router.go("notFound")
                  }
              }  
            },
            data: function(){
              if (Playlists.findOne({"playlistId": this.params.playlistId})) {
                Session.set('thisPlaylistData', Playlists.findOne({"playlistId": this.params.playlistId}));
                document.title = Playlists.findOne({"playlistId": this.params.playlistId}).playlistName;
              };
              if (!Session.get('bodyTemplateWait')) {
                setTimeout(function() {
                  Session.set('bodyTemplateWait', true);
                }, 300);
                setTimeout(executeResizeFuncs, 15);
              }
              else{
                return {
                    // "playlist": Playlists.findOne({"playlistId": this.params.playlistId}),
                    "bodyTemplate": "musyncPlaylist"
                }
              };
            }
        }),
        this.route("teamPage", {
            path: "/team",
            onBeforeAction: function(){
                document.title = "The Team";
                if(Meteor.Device.isPhone()){
                  Router.go("/mobile")
                }
                this.next();
            },
            template: "container",
            data: function(){
              if (!Session.get('bodyTemplateWait')) {
                setTimeout(function() {
                  Session.set('bodyTemplateWait', true);
                }, 300);
                setTimeout(executeResizeFuncs, 15);
              }
              else{
                return ({
                    "bodyTemplate": "teamPage"
                })
              };
            }
        }),
        this.route("helpPage", {
            path: "/help",
            onBeforeAction: function(){
                document.title = "Let's break things down!";
                if(Meteor.Device.isPhone()){
                  Router.go("/mobile")
                }
                this.next();
            },
            template: "container",
            data: function(){
              if (!Session.get('bodyTemplateWait')) {
                setTimeout(function() {
                  Session.set('bodyTemplateWait', true);
                }, 300);
                setTimeout(executeResizeFuncs, 15);
              }
              else{
                return ({
                  "bodyTemplate": "helpPage"
                })
              };
            }
        }),
        this.route("appPage", {
            path: "/app",
            onBeforeAction: function(){
                document.title = "Get the app";
                if(Meteor.Device.isPhone()){
                  Router.go("/mobile")
                }
                this.next();
            },
            template: "container",
            data: function(){
                
              if (!Session.get('bodyTemplateWait')) {
                setTimeout(function() {
                  Session.set('bodyTemplateWait', true);
                }, 300);
                setTimeout(executeResizeFuncs, 15);
              }
              else{
                return ({
                    "bodyTemplate": "appPage"
                })
              };
            }
        }),
        this.route("apiCreatePlaylist", {
            path: '/api/createPlaylist',
            where: 'server',
            action: function () {
              if(this.request.body.authorId && this.request.body.playlistName){
                var self = this;
                Meteor.call('createPlaylist', {"authorId": this.request.body.authorId, "playlistName": this.request.body.playlistName}, function(err, playlistId){
                  if(err){
                console.log("problem")

                    var resp = {"status": "failure", "error": "problem creating playlist"};
                    this.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                    this.response.end(JSON.stringify(resp))
                  }else{
                  console.log("success")

                    var resp = {"playlistId": playlistId}
                    self.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    self.response.end(JSON.stringify(resp));
                  }
                });
              }else{
                console.log(this.request.body)
                console.log(this.request.body.authorId)
                console.log(this.request.body.playlistName)
                console.log("bad request")
                var resp = {"status": "failure", "error": "bad request"};
                this.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                this.response.end(JSON.stringify(resp))
              }
            }
        }),
        this.route("apiGetPlaylist", {
            path: '/api/getPlaylist',
            where: 'server',
            waitOn: function(){
              return Meteor.subscribe("playlist", this.request.body.playlistId); 
            },
            action: function () {
              if(this.ready()){
                if(Playlists.findOne({"playlistId": this.request.body.playlistId})){
                  var entries = Playlists.findOne({"playlistId": this.request.body.playlistId});
                  var resp = {"playlistId": this.request.body.playlistId, "playlist": entries}
                  this.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                  this.response.end(JSON.stringify(resp));
                }else{
                  var resp = {"status": "failure", "error": "bad request"};
                  this.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                  this.response.end(JSON.stringify(resp))
                }
              }
            }
        }),
        this.route("apiAddSong", {
            path: '/api/addSong',
            where: 'server',
            waitOn: function(){
              return Meteor.subscribe("playlist", this.request.body.playlistId); 
            },
            action: function () {
              if(this.ready()){
                if(Playlists.findOne({"playlistId": this.request.body.playlistId})){
                  var self = this;
                  Meteor.call("addSongToPlaylist", {"videoId": this.request.body.videoId, "playlistId": this.request.body.playlistId}, function(err){
                    if(!err){
                      var resp = {"status": "success"};
                      self.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                      self.response.end(JSON.stringify(resp));
                    }else{
                      var resp = {"status": "failure", "error": "bad request"};
                      self.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                      self.response.end(JSON.stringify(resp))
                    }
                  })
                }else{
                    var resp = {"status": "failure", "error": "playlist not found"};
                    this.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                    this.response.end(JSON.stringify(resp))
                }
              }
            }
        }),
        this.route("apiRemoveSong", {
            path: '/api/removeSong',
            where: 'server',
            waitOn: function(){
              return Meteor.subscribe("playlist", this.request.body.playlistId); 
            },
            action: function () {
              if(this.ready()){
                if(this.request.body.playlistId && this.request.body.videoId && this.request.body.songPosition){
                  if(Playlists.findOne({"playlistId": this.request.body.playlistId})){
                    var self = this;
                    Meteor.call("removeSongFromPlaylist", {"videoId": this.request.body.videoId, "songPosition": this.request.body.songPosition, "playlistId": Playlists.findOne().playlistId}, function(err){
                      if(!err){
                        var resp = {"status": "success", "error": "bad request"};
                        self.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        self.response.end(JSON.stringify(resp));
                      }
                    })
                  }else{
                    var resp = {"status": "failure", "error": "playlist not found"};
                    this.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                    this.response.end(JSON.stringify(resp))
                  }
                }else{
                  var resp = {"status": "failure", "error": "bad request"};
                  this.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                  this.response.end(JSON.stringify(resp))
                }
              }
            }
        }),
        this.route("apiMoveSong", {
            path: '/api/moveSong',
            where: 'server',
            waitOn: function(){
              return Meteor.subscribe("playlist", this.request.body.playlistId); 
            },
            action: function () {
              if(this.ready()){
                if(this.request.body.playlistId && this.request.body.videoId && this.request.body.initalSongPosition && this.request.body.finalSongPosition){
                  if(Playlists.findOne({"playlistId": this.request.body.playlistId})){
                    var self = this;
                    Meteor.call("moveSongInPlaylist", {"videoId": this.request.body.videoId, "playlistId": Playlists.findOne().playlistId, "position": this.request.body.videoId}, function(err){
                      if(!err){
                        var resp = {"status": "success"};
                        self.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        self.response.end(JSON.stringify(resp));
                      }
                    })
                  }else{
                    var resp = {"status": "failure", "error": "playlist not found"};
                    this.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                    this.response.end(JSON.stringify(resp))
                  }
                }else{
                  var resp = {"status": "failure", "error": "incomplete command"};
                  this.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                  this.response.end(JSON.stringify(resp))
                }
              }
            }
        }),
        this.route("notFound", {
            path: "/404",
            template: "404"
        }),
        this.route('mobile', {
          path: "/mobile",
          template: "mobileLanding"
        })
    })
})