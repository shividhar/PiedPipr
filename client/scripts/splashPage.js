if (Meteor.isClient) {

  //events for the two buttons --> create/join playlist
  Template.splashPage.events({
    'click #createPlaylistSplashpage': function () {
      Session.set('show-createPlaylistModal', true);  
    },
    'click #joinPlaylistSplashpage': function() {
      Session.set('show-joinPlaylistModal', true);
    }
  });

  // animate splashpage out
  Template.splashPage.destroyed = function () {
    $('#bodyItem').removeAttr('style').addClass('isTempNoShow');
    $('#footer').hide();
  };

  //animate splashpage in
  Template.splashPage.rendered = function () {
    $(window).scrollTop(0);
    $('#footer').show();
    setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);
  };
}