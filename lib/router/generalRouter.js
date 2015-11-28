Meteor.startup(function () {
    Router.configure({
        notFoundTemplate: 'notFound'//,
        // trackPageView: true
    });

    Router.map(function() {
        this.route("splashPage", {
            path: "/",
            template: "container",
            onBeforeAction: function() {
              document.title = "Welcome to PiedPipr.";
              this.next();
            },
            data: function() {
              return ({
                "bodyTemplate": "splashPage"
              });
            }
        }),
        this.route("playlist", {
            path: "/p/:playlistId",
            waitOn: function(){
              return Meteor.subscribe("playlist", this.params.playlistId); 
            },
            onBeforeAction: function(){
              if(this.ready()){
                  if(Playlists.findOne({"playlistId": this.params.playlistId})){
                    document.title = "Playlist";

                    this.next();
                  }else{
                      Router.go("notFound")
                  }
              }  
            },
            template: "container",
            data: function(){
                return {
                    "playlist": Playlists.findOne({"playlistId": this.params.playlistId}),
                    "bodyTemplate": "musyncPlaylist"
                }
            }
        }),
        this.route("teamPage", {
            path: "/team",
            template: "container",
            onBeforeAction: function(){
                document.title = "The Team";
                this.next();
            },
            data: function(){
                return ({
                    "bodyTemplate": "teamPage"
                })
            }
        }),
        this.route("helpPage", {
            path: "/help",
            template: "container",
            onBeforeAction: function(){
                document.title = "Let's break things down!";
                this.next();
            },
            data: function(){
                return ({
                    "bodyTemplate": "helpPage"
                })
            }
        }),
        this.route("apiCreatePlaylist", {
            path: '/api/createPlaylist',
            where: 'server',
            action: function () {
              var self = this;
              Meteor.call('createPlaylist', function(err, playlistId){
                if(err){
                  var resp = {"status": "failure"};
                  this.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                  this.response.end(JSON.stringify(resp))
                }else{
                  var resp = {"playlistId": playlistId}
                  self.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                  self.response.end(JSON.stringify(resp));
                }
              });
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
                  var resp = {"status": "failure"};
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
                  Meteor.call("addSongToPlaylist", {"videoId": this.request.body.videoId, "playlistId": Playlists.findOne().playlistId}, function(err){
                    if(!err){
                      var resp = {"status": "success"};
                      this.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                      this.response.end(JSON.stringify(resp));
                    }
                  })
                }else{
                    var resp = {"status": "failure"};
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
                if(Playlists.findOne({"playlistId": this.request.body.playlistId})){
                  Meteor.call("removeSongFromPlaylist", {"videoId": this.request.body.videoId, "playlistId": Playlists.findOne().playlistId}, function(err){
                    if(!err){
                      var resp = {"status": "success"};
                      this.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                      this.response.end(JSON.stringify(resp));
                    }
                  })
                }else{
                  var resp = {"status": "failure"};
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
                if(Playlists.findOne({"playlistId": this.request.body.playlistId})){
                  Meteor.call("moveSongInPlaylist", {"videoId": this.request.body.videoId, "playlistId": Playlists.findOne().playlistId, "position": this.request.body.videoId}, function(err){
                    if(!err){
                      var resp = {"status": "success"};
                      this.response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                      this.response.end(JSON.stringify(resp));
                    }
                  })
                }else{
                  var resp = {"status": "failure"};
                  this.response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
                  this.response.end(JSON.stringify(resp))
                }
              }
            }
        }),
        this.route("notFound", {
            path: "/404",
            template: "404"
        })
    })
})