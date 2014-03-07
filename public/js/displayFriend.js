'use strict';

$(document).ready(function() {
	initializePage();
})


function initializePage() {
	console.log('friends');
	$(".search").click(searchFriend);
	$(".add-friend").click(addToFriends);
}

function searchFriend(e) {
	console.log("querying database for matches");
	var search = $("input").val();
	var getURL = "friends/" + search;
	console.log(getURL);
	$.get(getURL, displayQuery);

}

function displayQuery(search_query) {

	var item = '<li class="cell row">' +
	             '  <div class="item col-xs-9">' + 
	             '    <div class="name">'+ search_query.name.first + '</div>' +
	             '    <div class="email">' + search_query.email + '</div>' +
	             '  </div>' +
	             '<button type="button" class="add-friend btn btn-default btn-lg">' +
  						'<span class="glyphicon glyphicon-plus"></span>' +
						'</button>' +
	             '</li>';

	// var itemTemplate = Handlebars.compile(item);

	// var mainHTML = '';
	// result["contents"].sort(sortName).forEach(function(item) {
	//   mainHTML += itemTemplate(item);
	// });

	$('.main').html(item);
	initializePage();
}

function addToFriends(e) {
	console.log("adding to friends");
	var newFriend = $(".email").html();
	$.get("friends/add/" + newFriend);
}

