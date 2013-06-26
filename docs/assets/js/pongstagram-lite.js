/*!
 * jQuery Pongstagr.am Plugin 
 * Copyright (c) 2013 Pongstr Ordillo
 * Version: 2.0.6
 * Code license under Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * Requires: jQuery v1.9 and Bootstrap 3.2 js
 */

;(function ($, window, document, undefined){

  "use strict";
  
  function renderHTML( targetElement, request, pager ){
    var galleryList       = '<ul></ul>',
        paginateTarget    = $(targetElement).attr('id'),
        paginateBtn       = '<a href="javascript:void(0);" class="btn" data-paginate="'+ paginateTarget +'">Load More</a>';
  
    
    $( targetElement )
        .addClass( 'pongstagram' )
        .append( galleryList );
    
      if ( pager === null || pager === true ){
        $( targetElement ).append( paginateBtn );
      }   
  }

  function ajaxRequest( endpoint, targetElement ){
    $.ajax({
      method   : "GET"    ,
      url      : endpoint ,
      cache    : true     ,
      dataType : "jsonp"  ,
      success  : function(data){
        
          var injectTo = '#' + $(targetElement).attr('id'); 
        
        $.each( data.data, function( key, value ){
          
          var thumbnail   = value.images.low_resolution.url,
              imgFullRes  = value.images.standard_resolution.url,
              imgCaption  = ( value.caption !== null ) ? ( value.caption.text !== null ) ? value.caption.text : '' : value.user.username;
          
          var thumbBlock  = '<li>';
              thumbBlock += '<a href="' + imgFullRes + '"><img src="' + thumbnail + '" alt="'+ imgCaption +'" /></a>';
              thumbBlock += '</li>'; 
          
          $( injectTo + ' ul' ).append( thumbBlock );
          
        });
        
        paginate( data.pagination.next_url, injectTo ); //*! paginate through images   
      }
    });
  }

  function paginate( nextUrl, targetElement ){
    
    var pagBtn = $(targetElement).attr('id');
    
    if ( nextUrl === undefined || nextUrl === null ) {
      $('[data-paginate="' + pagBtn + '"]').click(function(event){
        event.preventDefault();
        // $(this)
        //   .removeClass('btn-success')
        //   .addClass('disabled btn-secondary');
      });
    } else {
      $('[data-paginate="' + pagBtn + '"]').click(function(event){
        event.preventDefault();
          ajaxRequest( nextUrl, targetElement );  //*! Load Succeeding Pages.
          $(this).unbind(event);   //*! Unbind all attached events.
      });
    }
  }

  function requestData ( request, count, accessID, accessToken, targetElement, pager ){
    var $apiRequest   = 'https://api.instagram.com/v1/users/',  
        $requestCount = ( count !== null ) ?  
          '?count=' +  count + '&access_token=' + accessToken :
          '?count=' +    8   + '&access_token=' + accessToken ,
        loadBtnData  = ( request === null ) ? 'recent' : request ;
    
    if ( request === null || request === 'recent' ){
      var $recentMedia = $apiRequest + accessID + '/media/recent' + $requestCount; 
          // Load Recent Media
          ajaxRequest( $recentMedia, targetElement );
    }
    
    if ( request === 'liked' ){
      var $likedMedia = $apiRequest + 'self/media/liked' + $requestCount;
          // Load Liked Media
          ajaxRequest( $likedMedia, targetElement );
    }

    if ( request === 'feed' ){
      var $feedMedia = $apiRequest + 'self/feed' + $requestCount;
          // Load User Feed
          ajaxRequest( $feedMedia, targetElement );
    }
        
    renderHTML( targetElement, loadBtnData, pager );
  }
  
  function accessDetails( accessID, accessToken ){
    if ( accessID !== null || accessToken !== null ) {
        return true;
      } else {
          console.log('Please check whether your Access ID and Access Token if it\'s valid.' );
          console.log('You may visit http://instagram.com/developer/authentication/ for more info.');
        return false;
    }
  }
    
  $.fn.pongstgrm = function( options ){

    // Plugin Options
    var option  = $.extend({}, $.fn.pongstgrm.defaults, options);

    return this.each( function(i, element){
      if ( accessDetails( option.accessId, option.accessToken ) !== false ){
        requestData( option.show, option.count, option.accessId, option.accessToken, element, option.pager );
      }     
      
    });  //*! end return this.each;
  };     //*! end $.fn.pongstagrm;

  // Pongstagram Default Options
  $.fn.pongstgrm.defaults = {

    // User Authentication
    accessId     : null,  // instsagram user-id
    accessToken  : null,  // instagram access-token

    // Display options
    show         : null,  // string,  options: 'recent', 'feed', 'liked', 'user'
    count        : null,  // integer, options: 1(min) - 40(max), instagram limits the maximum number of photos to 40
    resolution   : null,  // string,  options: 'low_resolution', 'standard_resolution'
    pager        : null   // boolean, options:  true or false (enables/disable load more button)
    
  };
   
 })(jQuery, window, document);