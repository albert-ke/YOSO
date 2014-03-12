'use strict';

var pink  = '#e74c3c';
var brown = '#452716';
var complete_delete = '	<div class="col-xs-offset-1 col-xs-6 complete-button"></div> ' +
											'	<div class="col-xs-4 delete-button"></div> ';

var undo_delete = 		'	<div class="col-xs-offset-1 col-xs-6 undo-button"></div> ' +
											'	<div class="col-xs-4 delete-button"></div> ';

var new_ = 						'	<div class="col-xs-offset-1 col-xs-10 new-button">';

var add_cancel =      '	<input class="col-xs-offset-1 col-xs-10 new-name" type="text" name="new-name" value=""> ' +
											'	<div class="col-xs-offset-1 col-xs-6 add-button"></div> ' +
											'	<div class="col-xs-4 cancel-button"></div> ';

var item =						'	<div class="cell row {{status}} unchecked"> ' +
											'		<div class="col-xs-offset-1 col-xs-10 item"> ' +
											'			<div class="col-xs-9 item-name"> ' +
											'				<input class="name" type="text" name="{{name}}" value="{{name}}"> ' +
											'				<br> ' +
											'				<text class="user">{{creator}}</text> ' +
											'			</div> ' +
											'			<div class="col-xs-3 item-box"> </div> ' +
											'		</div> ' +
											'	</div> ';
var itemTemplate = Handlebars.compile(item);

var checkmark = '<span class="glyphicon glyphicon-ok"></span>';

var checkCount = 0;

var TODO = 0;
var DONE = 1;
var state = TODO;

$(document).ready(function() {
	console.log('moose');
	var getURL = "/lists/test";
	$.get(getURL, displayListCallback);
})

function displayListCallback(result) {
	var mainHTML = '';
	result["contents"].sort(sortName).forEach(function(item) {
		mainHTML += itemTemplate(item);
	});

	$('.main').html(mainHTML);
	init();
	console.log("end of callback");
	//$("*[name=new]").focus();
}

function init() {
	$(".nav-opt").unbind("click").click(selectView);
	if (state == TODO) {
		$(".todo-nav").trigger("click");
	}
	else if (state == DONE) {
		$(".done-nav").trigger("click");
	}

	checkCount = $(".checked").length;
	$(".item-box").unbind("click").click(toggleCheck);
	updateFooter();

	$(".item-name > input").blur(editName);
/*
	// remove completed items
	$(".complete-button").unbind("click").click(completeItems);
	$(".undo-button").unbind("click").click(undoItems);
	$(".delete-button").unbind("click").click(deleteItems);

	// for editing

	// add new item
	$(".menu-left").unbind("click").click(newItem);

	$(".done").children(".check").addClass("blue");
	// $(".checked").siblings(".check img").attr("src","img/checkbox-checked.png");
	// $("img.unchecked").siblings(".check img").attr("src","img/checkbox-unchecked.png");
*/

}

/****************************************** 
 * change view
 ******************************************/

function selectView(e) {
	$(this).css({backgroundColor: pink});
	if ($(this).hasClass("todo-nav")) {
		//console.log("switching to to-do");
		$(".done-nav").css({backgroundColor: brown});
		$(".todo").show();
		$(".done").hide();
		state = TODO;
	}
	else if ($(this).hasClass("done-nav")) {
		//console.log("switching to done");
		$(".todo-nav").css({backgroundColor: brown});
		$(".done").show();
		$(".todo").hide();
		state = DONE;
	}

	// uncheck items
	$(".checked").children(".item").children(".item-box").html("");
	$(".checked").removeClass("checked").addClass("unchecked");
}


/****************************************** 
 * check/uncheck items
 ******************************************/

function toggleCheck(e) {
	// check or uncheck boxes
	if ($(this).parent().parent().hasClass("unchecked")) {
		//console.log("checking item");
		
		$(this).html(checkmark);
		$(this).parent().parent().removeClass('unchecked').addClass('checked');

		checkCount += 1;
	}
	else if ($(this).parent().parent().hasClass("checked")) {
		//console.log("unchecking item");
		
		$(this).html("");
		$(this).parent().parent().removeClass('checked').addClass('unchecked');

		checkCount -= 1;
	}

	updateFooter();
}

/****************************************** 
 * change footer
 ******************************************/

function updateFooter() {
	if (checkCount > 0) {
		if (state == TODO) {
			$("footer").html(complete_delete);
			$(".complete-button").unbind("click").click(completeItems);
			$(".delete-button").unbind("click").click(deleteItems);	
		}
		else if (state == DONE) {
			$("footer").html(undo_delete);
			$(".undo-button").unbind("click").click(undoItems);
			$(".delete-button").unbind("click").click(deleteItems);	
		}
	}
	else {
		$("footer").html(new_);
		$(".new-button").unbind("click").click(newItemForm);
	}
}



/****************************************** 
 * for editing items
 ******************************************/

function newItemForm(e) {
	console.log("in newItem...");
	console.log("calling addItem...");

	$("footer").html(add_cancel);
	$(".add-button").unbind("click").click(newItem);
	$(".cancel-button").unbind("click").click(updateFooter);

	$(".new-name").focus();
}

function newItem(e) {
	var name = $(this).siblings(".new-name").val();
	var getURL = "/items/add/" + name;
	console.log("calling callback from newItem");
	$.get(getURL, displayListCallback);

}

function editName(e) {
	var oldname = $(this).attr('name');
	var newname = $(this).val()

	$(this).attr('name', newname);
	$(this).attr('val', newname);
	console.log("oldname: " + oldname + " newname: " + $(this).val());
	if (newname == "")
		newname = oldname;

	var getURL = "/items/update/" + oldname + "/" + $(this).val();
	console.log("calling callback from editName");
	$.get(getURL, displayListCallback);
}


/****************************************** 
 * for the footer buttons
 ******************************************/

function completeItems(e) {
	console.log("complete");

	$(".checked").removeClass("todo").addClass("done");
	$(".checked").hide();

	var postURL = "/items/complete/"
	var postJSON = {};
	$(".checked").each(function() {
		var item = $(this).children(".item").children(".item-name").children("input").attr("name");
		postJSON[item] = item;
	});

	// uncheck items
	$(".checked").children(".item").children(".item-box").html("");
	$(".checked").removeClass("checked").addClass("unchecked");

	$.post(postURL, postJSON, displayListCallback);
}

function undoItems(e) {
	console.log("undoing");
	$(".checked").removeClass("done").addClass("todo");
	$(".checked").hide();

	var postURL = "/items/undo/"
	var postJSON = {};
	$(".checked").each(function() {
		var item = $(this).children(".item").children(".item-name").children("input").attr("name");
		postJSON[item] = item;
	});

	// uncheck items
	$(".checked").children(".item").children(".item-box").html("");
	$(".checked").removeClass("checked").addClass("unchecked");

	var postURL = "/items/undo/"
	$.post(postURL, postJSON, displayListCallback);
}

function deleteItems(e) {
	$(".checked").hide();

	var postURL = "/items/delete/";
	var postJSON = {};
	$(".checked").each(function() {
		var item = $(this).children(".item").children(".item-name").children("input").attr("name");
		postJSON[item] = item;
	});
	
	// uncheck items
	$(".checked").children(".item").children(".item-box").html("");
	$(".checked").removeClass("checked").addClass("unchecked");

	console.log(postJSON);
	$.post(postURL, postJSON, deleteItemsCallback);
}

function deleteItemsCallback(result) {
	var getURL = "/lists/test";
	$.get(getURL, displayListCallback);
}

/****************************************** 
 * for sorting items
 ******************************************/

function sortName(a, b) {
		var aname = a.name.replace(/\W/g, '').replace(/\d+/g, '').toLowerCase();
		var bname = b.name.replace(/\W/g, '').replace(/\d+/g, '').toLowerCase();

		var acreator = a.creator.replace(/\W/g, '').replace(/\d+/g, '').toLowerCase();
		var bcreator = b.creator.replace(/\W/g, '').replace(/\d+/g, '').toLowerCase();

		if (bname == "new")
			return 1;
		if (aname =="new")
			return -1;

		// by name
		if (aname < bname) //sort string ascending
  		return -1;
 		if (aname > bname)
  		return 1;

		// by creator
		if (acreator < bcreator)
			return -1;
		if (acreator > bcreator)
			return 1;

 		return 0;
}

function sortCreator(a, b) {
		var aname = a.name.replace(/\W/g, '').replace(/\d+/g, '').toLowerCase();
		var bname = b.name.replace(/\W/g, '').replace(/\d+/g, '').toLowerCase();

		var acreator = a.creator.replace(/\W/g, '').replace(/\d+/g, '').toLowerCase();
		var bcreator = b.creator.replace(/\W/g, '').replace(/\d+/g, '').toLowerCase();

		if (bname == "new")
			return 1;
		if (aname =="new")
			return -1;

		// by creator
		if (acreator < bcreator)
			return -1
		if (acreator > bcreator)
			return 1

		// by name
		if (aname < bname) //sort string ascending
  		return -1 
 		if (aname > bname)
  		return 1

 		return 0
}

