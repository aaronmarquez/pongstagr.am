// Pongstagr.am docs.js
// Script requirements:
//    + jQuery 1.8+
//    + bootstrap.js
//    + pongstagram.js 
// ====================

$(window).load(function(){
  
  "use strict";
  
  // Sticky Navbar
  // =============
  $('.sticky').affix();

  // Smooth scroll for internal links
  // ================================
  $('.nav a[href^="#"]').on('click',function (e) {
    e.preventDefault();
    var target = this.hash,
       $target = $(target);
       
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top  - 10
    }, { duration: 1250, easing: 'easeInOutExpo'}, function () {
        window.location.hash = target;
        return false;
    });

    // Sub-Pages Navigation
    // ====================
    if ( $('.nav li a').length > 0 ){
      $('.nav li a').removeClass('active');
      $(this).addClass('active');
    } 
  });

  // Update Navdots status onScroll
  // ==============================
  // $(window).scroll(function(){
  //   var windowScroll = $(window).scrollTop();
  //
  //   if ( windowScroll >= 50 ){
  //     $('[role="main"] > div').each(function(i){
  //       if ($(this).position().top <= windowScroll + 50 ){
  //         $('.nav a').removeClass('active');
  //         $('.nav a').eq(i).addClass('active');
  //       }
  //     });
  //   }
  // }).scroll();
    
  
  var usr = '39666111',
      tkn = '39666111.1fb234f.c3901000b4944a549fd5fd2310c63780';

    $('#recent').pongstgrm({
      accessId    : usr,
      accessToken : tkn,
      show        : 'recent',
      count       : 4,
      pager       : true
    });
      
    $('#liked').pongstgrm({
      accessId    : usr,
      accessToken : tkn,
      show        : 'liked',
      count       : 4,
      pager       : true
    });  
  
      
    $('#feed').pongstgrm({
      accessId    : usr,
      accessToken : tkn,
      show        : 'feed',
      count       : 4,
      pager       : true
    });  
  
  
  
});