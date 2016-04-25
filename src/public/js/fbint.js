  var Posts = [];
  var Albums = [];
  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
       testAPI();
       getAllPosts(response.authResponse.accessToken);
       getAllAlbums(response.authResponse.accessToken);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
        
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  
   window.fbAsyncInit = function() {
	  FB.init({
		appId      : '1662797027322011',
		cookie     : true,  // enable cookies to allow the server to access 
							// the session
		xfbml      : true,  // parse social plugins on this page
		version    : 'v2.5' // use graph api version 2.5
	  });

  
	  FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	  });
   };

  // Load the SDK asynchronously
	(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/790876601057998', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

// $.ajax({
//     type: 'POST',
//     url: 'https://graph.facebook.com/1662797027322011/',
//     async: false,
//     data: {
//         access_token: '[access_token]',//received via response.authResponse.accessToken after login
//         url: '[imageUrl]'
//     },
//     success: function(response) {
//         if (response && !response.error) {
//             window.open('http://www.facebook.com/photo.php?fbid=' + response.id + '&makeprofile=1');
//         }
//     }
// })

var responseAPI = function()
{
  FB.api('/me', function(response) {
	  console.log(JSON.stringify(response));
  });
}
  var getAllPosts = function(access_token) {
    FB.api(
      '/790876601057998/posts?access_token=' + access_token,
      'GET',
      {"fields":"comments,picture"},
      function(response) {
          // Insert your code here
          $.each(response.data, function(key, value){
            var post = {
              postId: value.id,
              postPictureUrl: value.picture,
              comments: []
            };
            if(value.comments) {
              $.each(value.comments.data, function(k, v) { 
                var comment = {
                  message: v.message,
                  fromName: v.from.name,
                  fromId: v.from.id,
                  fromPictureUrl:  ''//getUserPicture(access_token, v.from.id)
                };
                post.comments.push(comment);
              });
              Posts.push(post);
            }

          });
          bindPostData(access_token);
      }
    );
  }
  var getAllAlbums = function(access_token) {
    FB.api(
      '/790876601057998?access_token=' + access_token,
      'GET',
      {"fields":"albums{photos{picture,comments}}"},
      function(response) {
        if(response.albums) {
          $.each(response.albums.data, function(av, album) {
            $.each(album.photos.data, function(key, value) {
              var post = {
                postId: value.id,
                postPictureUrl: value.picture,
                comments: []
              };
              if(value.comments) {
                $.each(value.comments.data, function(k, v) { 
                  var comment = {
                    message: v.message,
                    fromName: v.from.name,
                    fromId: v.from.id,
                    fromPictureUrl:  ''
                  };
                  post.comments.push(comment);
                });
                Albums.push(post);
              }
            });            
          });

          bindAlbumData(access_token);
        }
      }
    );
  }
  var bindPostData = function(access_token) {

    $.each(Posts, function(k, v) {
      $.each(v.comments, function(key, comment) {
        $.ajax({
           type: 'GET',
           url: 'https://graph.facebook.com/'+comment.fromId+'?access_token='+access_token,
           async: false,
           data: {
               fields: 'picture'//received via response.authResponse.accessToken after login
           },
           success: function(response) {
               if (response && !response.error) {
                console.log(response);
                comment.fromPictureUrl = response.picture.data.url;
                   //window.open('http://www.facebook.com/photo.php?fbid=' + response.id + '&makeprofile=1');
                pushComment(comment, v.postPictureUrl);
               }
           }
        });
      });
    });
    //$( '#cbp-qtrotator' ).cbpQTRotator();
  }

  var bindAlbumData = function(access_token) {
    $.each(Albums, function(k, v) {
      $.each(v.comments, function(key, comment) {
        $.ajax({
           type: 'GET',
           url: 'https://graph.facebook.com/'+comment.fromId+'?access_token='+access_token,
           async: false,
           data: {
               fields: 'picture'//received via response.authResponse.accessToken after login
           },
           success: function(response) {
               if (response && !response.error) {
                console.log(response);
                comment.fromPictureUrl = response.picture.data.url;
                   //window.open('http://www.facebook.com/photo.php?fbid=' + response.id + '&makeprofile=1');
                pushComment(comment, v.postPictureUrl);
               }
           }
        });
      });
    });
    $( '#cbp-qtrotator' ).cbpQTRotator();
  }

  var pushComment = function(comment, posturl) {
    var commenthtml = '<div class="cbp-qtcontent">' + 
      '<img src="'+ comment.fromPictureUrl +'" width="64" height="64" alt="" class="pull-left m-l-0 m-r-md" />' + 
      '<img src="'+ posturl +'" alt="img01" width="150" height="75" />' +  
        '<blockquote>' +
          '<p>' + comment.message + '</p>' +
        '</blockquote>' +
    '</div>';
    $("#cbp-qtrotator").append(commenthtml);
  }

  var getUserPicture = function(access_token, id) {
    FB.api(
      '/' + id + '?access_token=' + access_token,
      'GET',
      {"fields":"picture"},
      function(response) {
        return response.picture.data.url;
      }
    );
  }

