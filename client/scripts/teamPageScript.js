if (Meteor.isClient) {
  Template.teamPage.rendered = function () {
  		$(window).scrollTop(0);
  		setTimeout(function() {$('#bodyItem').css({'opacity': '1', 'top': '0'}).removeClass('isTempNoShow');executeResizeFuncs();}, 300);
  		$('#footer').show();
  		executeResizeFuncs();

      var imgLoadedCount = 0;
      $('img').each(function() {
        var img = new Image();
        img.onload = function() {
          imgLoadedCount++;
          if (imgLoadedCount == $('img').length) {
            $('.demo td').each(function(index, el) {
              var $this = $(el);
              setTimeout(function() {
                $this.css({
                  'opacity': '1',
                  'top': '0'
                });
              }, 480*index);
            });
          };
        };
        img.src = $(this).attr('data-src');
      });
	};
	Template.teamPage.destroyed = function () {
		$('#bodyItem').removeAttr('style').addClass('isTempNoShow');
		Session.set('bodyTemplateWait', false);
		$('#footer').hide();
	};
}