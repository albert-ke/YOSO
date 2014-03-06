'use strict';

$(document).ready(function() {
	initializePage();
})


function initializePage() {
	console.log('friends');
	var item = '<li>' +
						 '	<div class="item col-xs-9">' + 
						 '		<div>{{email}}</div>' +
						 '	</div>' +
						 '</li>';

	var itemTemplate = Handlebars.compile(item);
	
	var mainHTML = itemTemplate;
	// result["contents"].sort(sortName).forEach(function(item) {
	// 	mainHTML += itemTemplate(item);
	// });

	//$('.main').html(mainHTML);
	//init();
	console.log("end of callback");
	//$("*[name=new]").focus();
}