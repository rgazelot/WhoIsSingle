window.fbAsyncInit = function() {
	FB.init({
	  appId      : '383145381709587', // App ID
	  channelUrl : '//'+window.location.hostname+'/whoissingle/channel', // Channel File
	  status     : true, // check login status
	  cookie     : true, // enable cookies to allow the server to access the session
	  xfbml      : true  // parse XFBML
	});
	
	// listen for and handle auth.statusChange events
	FB.Event.subscribe('auth.statusChange', function(response) {
		
		// Connected
		if(response.status == 'connected') {
		
			//
			$('#login').hide();
			
			// Informations and var
			var token = response.authResponse.accessToken,
			    userID = response.authResponse.userID,
			    gender = '',
			    html = '';
			
			// Gender of the User
			$.ajax({
				url: 'https://graph.facebook.com/'+userID+'?fields=gender',
				type: 'GET',
				dataType: 'jsonp',
				success:function(genderResponse){
					gender = genderResponse.gender;
				}
			});
			
			// Get friends list
			$.ajax({
				url: 'https://graph.facebook.com/'+userID+'/friends?access_token='+token,
				type: 'GET',
				dataType: 'jsonp',
				success:function(response){
					
					// Each friends
					$.each(response.data, function(key,val){
						$.ajax({
							url: 'https://graph.facebook.com/'+val['id']+'?access_token='+token,
							type: 'GET',
							dataType: 'jsonp',
							success:function(friend){
								if(friend.gender != gender && friend.relationship_status == 'Single'){
									console.log(friend.name);
									html += '<img src="https://graph.facebook.com/'+friend.id+'/picture"/>';
								}
							}
						});
					});
				}
			});							
		}
		// Not authorized
		else if(response.status == 'not_authorized') {
			console.log('not_connect');
		}
		// Unknown
		else{
			console.log('unknown');
		}
	});
	
};
	
// Load the SDK Asynchronously
(function(d){
var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
if (d.getElementById(id)) {return;}
js = d.createElement('script'); js.id = id; js.async = true;
js.src = "//connect.facebook.net/en_US/all.js";
ref.parentNode.insertBefore(js, ref);
}(document));