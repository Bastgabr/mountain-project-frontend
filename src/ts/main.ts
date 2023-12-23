window.onload = function() {
  Common.HideLoadingScreen();
};



$('.caroussel-item').on('click', function(){
  let carrouselItem = jQuery(this).children();

  let imageUrl = carrouselItem.attr('src');
  let imageUrlOld =  $('#displayed-picture').children().attr('src');
  $('#displayed-picture').children().animate({opacity:0}, 100, function(){
    $('#displayed-picture').children().attr('src', imageUrl);
    $('#displayed-picture').children().animate({opacity:1},300, function(){
      carrouselItem.animate({opacity:1}, 100, function(){
        carrouselItem.attr('src', imageUrlOld);

      });
    });
  })
});


