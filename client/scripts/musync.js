if (Meteor.isClient) {
  Template.splashPage.events({
    'click button': function () {
      // increment the counter when button is clicked
        Meteor.call("createPlaylist", function(err, playlistId){
            if(err){
                alert(err)
                return false
            }
            Router.go("playlist", {"playlistId": playlistId})
        })
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
