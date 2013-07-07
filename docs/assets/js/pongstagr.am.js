/*!
 * jQuery Pongstagr.am Plugin 
 * Copyright (c) 2013 Pongstr Ordillo
 * Version: 2.1.0
 * Code license under Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * Requires: jQuery v1.8+
 */

;(function ($, window, document, undefined){

  "use strict";
  
  // Begin Functions
  
  // Render HTML Markup
  // ==================
  function renderHTML( targetElement, request, pager ){
    var galleryList       = '<ul></ul>',
        paginateTarget    = $(targetElement).attr('id'),
        paginateBtn       = '<a href="javascript:void(0);" class="button" data-paginate="'+ paginateTarget +'">Load More</a>';
  
    $( targetElement )
        .addClass('pongstagram')
        .append( galleryList );
    
      if ( pager === null || pager === true ){
        $( targetElement ).append( paginateBtn );
      }   
  }

  // Image Preloader
  // ===============
  function imagePreLoader( imageId ){
    var $image    = $( imageId ),
         spinner  = imageId + '-ldr',
         preloadr = 0,
         total    = $image.length;          
    $image.hide();
    $image.load(function(){
      if ( ++preloadr === total ){
        $image.fadeIn('fast');
        $(spinner).fadeOut('fast').remove();
      }
    });
  }
  
  // Render Modal Window
  // ===================
  function renderModal( mediaId, mediaSrc, mediaCap ){

    var mdOvrly   = $('.md-overlay'),
        mdMedia   = '<div class="md-media md-column"><img src="' + mediaSrc + '" alt="' + mediaCap + '" /></div>',
        mdContent = '<div class="md-content md-column">',
        mdWindow  = '<div class="md" id="' + mediaId + '" >' + mdMedia + mdContent + '</div>';

    // Modal Window
    $('body').append(mdWindow);
    
    // Modal Overlay
    if ( mdOvrly.length > 0 ){
      $('body').append('<div class="md-overlay">');
    }    
  }
  
  // Ajax load media details
  // =======================  
  function ajaxRequest( endpoint, targetElement, column ){
    $.ajax({
      method   : "GET"    ,
      url      : endpoint ,
      cache    : true     ,
      dataType : "jsonp"  ,
      success  : function(data){
        
      var trgtId   = '#' + $(targetElement).attr('id'),
          dfltCol  = ( column !== null ) ? column : 'column-4';
        
        // Loop through media
        $.each( data.data, function( key, value ){
              // thumnbnail low-res
          var thmbnl = value.images.low_resolution.url,
              // thumbnail standard-res
              imgful = value.images.standard_resolution.url,
              // image id
              imgId  = value.id,
              // user's profile (this can either be the owner or follower )
              usrImg = value.user.profile_picture,
              // user's username *duh
              usrNam = value.user.username,
              // the image/videos' caption
              cption = ( value.caption !== null ) ? ( value.caption.text !== null ) ? value.caption.text : '' : value.username,
              // the image/videos' comments
              comnts = ( value.comments.count !== null ) ? value.comments.count : '0',
              // the image/videos' like stats
              likes  = ( value.likes.count !== null ) ? value.likes.count : '0';

          // Thumbnail Block
          var thmBlk  = '<li class="' + dfltCol + '">';
              thmBlk += '<div class="media">';
              thmBlk += '<div id="' + imgId + '-thmb-ldr" class="loader"></div>';
              thmBlk += '<a data-modal-id="' + imgId + '-modal" href="' + imgful + '"><img src="' + thmbnl + '" alt="'+ cption +'" id="' + imgId + '-thmb" /></a>';
              thmBlk += '</div>';
              thmBlk += '</li>';

          // Inject thumbnails to target container
          $(trgtId + ' ul').append( thmBlk );

          // Preload Image
          imagePreLoader( '#' + imgId + '-thmb' );
          
          // Load Media's Modal Window
          $('[data-modal-id="' + imgId + '-modal"]'). click(function(e){
            e.preventDefault();
            
            // Inject Modal Window to Body
            renderModal( imgId, imgful, cption );
            
            
                                    
          });  
        });
        // paginate through instagram media
        paginate( data.pagination.next_url, trgtId, dfltCol );
      }
    });
  }

  function paginate( nextUrl, targetElement, column ){
    
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
          ajaxRequest( nextUrl, targetElement, column );  //*! Load Succeeding Pages.
          $(this).unbind(event);   //*! Unbind all attached events.
      });
    }
  }

  // Identify Ajax Request
  // =====================
  function requestData ( request, count, accessID, accessToken, targetElement, pager, column ){
    var $apiRequest   = 'https://api.instagram.com/v1/users/',  
        $requestCount = ( count !== null ) ?  
          '?count=' +  count + '&access_token=' + accessToken :
          '?count=' +    8   + '&access_token=' + accessToken ,
        loadBtnData  = ( request === null ) ? 'recent' : request ;
    
    if ( request === null || request === 'recent' ){
      var $recentMedia = $apiRequest + accessID + '/media/recent' + $requestCount; 
          ajaxRequest( $recentMedia, targetElement, column ); // Load Recent Media
    }
    
    if ( request === 'liked' ){
      var $likedMedia = $apiRequest + 'self/media/liked' + $requestCount;
          ajaxRequest( $likedMedia, targetElement, column ); // Load Liked Media
    }

    if ( request === 'feed' ){
      var $feedMedia = $apiRequest + 'self/feed' + $requestCount;
          ajaxRequest( $feedMedia, targetElement, column ); // Load User Feed
    }
    // Render plugin markup and data
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
        requestData( option.show, option.count, option.accessId, option.accessToken, element, option.pager, option.columns );
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
    pager        : null,  // boolean, options:  true or false (enables/disable load more button)
    columns      : null   // string,  options:  column-2, column-3, column-4, column-6
  };
   
 })(jQuery, window, document);