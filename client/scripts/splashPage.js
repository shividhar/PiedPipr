if (Meteor.isClient) {
  var swagInt;
  Template.splashPage.events({
    'click #createPlaylistSplashpage': function () {
      Session.set('show-createPlaylistModal', true);  
    },
    'click #joinPlaylistSplashpage': function() {
      Session.set('show-joinPlaylistModal', true);
    }
  });
  Template.splashPage.destroyed = function () {
    clearInterval(swagInt);
    $('#bodyItem').removeAttr('style').addClass('isTempNoShow');
    $('#footer').hide();
  };
  Template.splashPage.rendered = function () {
    $(window).scrollTop(0);
    $('#footer').show();
    setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);
    function animateBg() {
      var i = 0;
      swagInt = setInterval(function() {
        if (i == 0){
          i = 1;
          $('.firstBg').fadeOut(2400);
          $('.fourthBg').attr('class', 'secondBg');
        }
        else if(i == 1){
          i = 2;
          $('.firstBg').attr('class', 'thirdBg');
          $('.thirdBg').fadeIn(2400);
        }
        else if(i==2){
          i = 3;
          $('.secondBg').attr('class', 'fourthBg');
          $('.thirdBg').fadeOut(2400);
        }
        else{
          i = 0;
          $('.thirdBg').attr('class', 'firstBg');
          $('.firstBg').fadeIn(2400);
        }
      }, 2395);
      executeResizeFuncs();
    };
    // animateBg();
  };
}