if (Meteor.isClient) {
  var swagInt;
  Template.teamPage.events({

  });
  Template.teamPage.destroyed = function () {
    clearInterval(swagInt);
  };
  Template.teamPage.rendered = function () {
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

    setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'});}, 300);
    animateBg();
  };
}