'use strict';

$(document).ready(function() {
	$.get("/friends/display", displayFriends);
	// initializePage();
})


function initializePage() {
	console.log('friends');
	$(".search").click(searchFriend);
	$(".add-friend").click(addToFriends);
	$('input:text').focus(function(){
        $(this).val('');
    });
}

function searchFriend(e) {
	console.log("querying database for matches");
	var search = $("input").val();
	var getURL = "friends/" + search;
	console.log(getURL);
	$.get(getURL, displaySearch);

}

function displaySearch(search_query) {
	console.log("search result " + search_query);
	if (!search_query.length || search_query === null || search_query === undefined) {
		var message = '<div>no matches found</div>';
		$('#list').html(message);
		initializePage();
	}

	else {
		var item = '';
		var mainHTML = '';
		for (var i = 0, len = search_query.length; i < len; i++) {
  			console.log(i);
	    	var item = '<li class="cell row">' +
		             '  <div class="item col-xs-9">' + 
		             '    <div class="name">'+ search_query[i].name.first + ' ' + search_query[i].name.last + '</div>' +
		             '    <div class="email">' + search_query[i].email + '</div>' +
		             '  </div>' +
		             '<button type="button" class="add-friend btn btn-default btn-lg">' +
	  						'<span class="glyphicon glyphicon-plus"></span>' +
							'</button>' +
		             '</li>';
			mainHTML += item;
		}

	$('#list').html(mainHTML);
	initializePage(); }
}

function addToFriends(e) {
	console.log("adding to friends");
	var newFriend = $(".email").html();
	var getURL = "friends/add/" + newFriend;
	console.log(getURL);
	$.get(getURL, displayFriends);
	//res.render('friends', friends);
}

function displayFriends(friends) {
	console.log("current friends " + friends);
	if (!friends.length || friends === null || friends === undefined) {
		var message = '<div>no current friends</div>';
		$('#list').html(message);
		initializePage();
	}
	else {var mainHTML = '';
	var friendHTML = '';
	for (var i = 0, len = friends.length; i < len; i++) {
  		console.log(i);
    	var friendHTML = '<li>' +
					'<div>' + friends[i].name.first + ' ' + friends[i].name.last + '</div>' +
					'<div>' + friends[i].email + '</div>' +
				'</li>';
		mainHTML += friendHTML;
	}

	$('#list').html(mainHTML);
	initializePage(); }
}

