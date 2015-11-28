Meteor.startup(function () {
    Router.configure({
        // notFoundTemplate: 'notFound',
        // trackPageView: true
    });

    Router.map(function() {
        this.route("splashPage", {
            path: "/",
            template: "splashPage"
        }),
        this.route("playlist", {
            path: "/p/:playlistId",
            waitOn: function(){
              return Meteor.subscribe("playlist", this.params.playlistId); 
            },
            onBeforeAction: function(){
              if(this.ready()){
                  if(Playlists.findOne({"playlistId": this.params.playlistId})){
                      this.next();
                  }else{
                      Router.go("notFound")
                  }
              }  
            },
            "template": "musyncPlaylist",
            data: function(){
                return {
                    "playlist": Playlists.findOne({"playlistId": this.params.playlistId})
                }
            }
        }),
        this.route("notFound", {
            path: "/404",
            template: "404"
        })
    })
})