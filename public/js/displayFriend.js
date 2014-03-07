'use strict';

$(document).ready(function() {
	initializePage();
})


function initializePage() {
	console.log('friends');
	// var item = '<li>' +
	// 					 '	<div class="item col-xs-9">' + 
	// 					 '		<div>{{email}}</div>' +
	// 					 '	</div>' +
	// 					 '</li>';

	// var itemTemplate = Handlebars.compile(item);
	
	// var mainHTML = itemTemplate;
	// result["contents"].sort(sortName).forEach(function(item) {
	// 	mainHTML += itemTemplate(item);
	// });

	//$('.main').html(mainHTML);
	$("button").click(searchFriend);
	// console.log("end of callback");
	//$("*[name=new]").focus();
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
	             '  <div class="check col-xs-2">' +
	             '    <img src="img/checkbox-unchecked.png" alt="checkoff">' +
	             '  </div>' +
	             '</li>';

	// var itemTemplate = Handlebars.compile(item);

	// var mainHTML = '';
	// result["contents"].sort(sortName).forEach(function(item) {
	//   mainHTML += itemTemplate(item);
	// });

	$('.main').html(item);
	//location.reload();
}

