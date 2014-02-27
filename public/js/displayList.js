'use strict';

$(document).ready(function() {
	console.log('moose');
	var getURL = "/lists/test";
	$.get(getURL, displayListCallback);
})

function displayListCallback(result) {
	var item = '<div class="cell row {{status}}">' +
						 '	<div class="item col-xs-offset-1 col-xs-8">' +
						 '		<input class="item-name" type="text" name="{{name}}" value="{{name}}">' + 
						 '		<div class="item-owner">{{creator}}</div>' +
						 '	</div>' +
						 '	<div class="check col-xs-2 {{priority}}">' +
						 '		<div class="symbol">+</div>' +
						 ' 	</div>' +
						 '</div>';

	var itemTemplate = Handlebars.compile(item);
	
	var mainHTML = '';
	result["contents"].sort(sortName).forEach(function(item) {
		mainHTML += itemTemplate(item);
	});

	$('.main').html(mainHTML);
	init();
	console.log("end of callback");
	//$("*[name=new]").focus();
}

function displayListCallback2(result) {
	var item = '<div class="cell row {{status}}">' +
						 '	<div class="item col-xs-offset-1 col-xs-8">' +
						 '		<input class="item-name" type="text" name="{{name}}" value="{{name}}">' + 
						 '		<div class="item-owner">{{creator}}</div>' +
						 '	</div>' +
						 '	<div class="check col-xs-2 {{priority}}">' +
						 '		<div class="symbol"><span class="glyphicon glyphicon-ok"></span></div>' +
						 ' 	</div>' +
						 '</div>';

	var itemTemplate = Handlebars.compile(item);
	
	var mainHTML = '';
	result["contents"].sort(sortName).forEach(function(item) {
		mainHTML += itemTemplate(item);
	});

	$('.main').html(mainHTML);
	init();
	
	$("html, body").animate({ scrollTop: $(document).height() }, "fast");
	$("*[name=new]").focus();
}

function init() {
	// change appearance of selected option
	$(".options-selector").unbind("click").click(changeOption);
	$(".selected").trigger("click");

	// indicate item is selected
	$(".check").unbind("click").click(selectItem);

	// remove completed items
	$(".complete-button").unbind("click").click(completeItems);
	$(".undo-button").unbind("click").click(undoItems);
	$(".delete-button").unbind("click").click(deleteItems);

	// for editing
	$(".item-name").blur(editName);

	// add new item
	$(".menu-left").unbind("click").click(newItem);

	$(".done").children(".check").addClass("blue");
}

/****************************************** 
 * for editing items
 ******************************************/

function newItem(e) {
	console.log("in newItem...");
	console.log("calling addItem...");
	var getURL = "/items/add/";
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
	$(".checked").parent().removeClass("todo").addClass("done");
	$(".checked").siblings().addClass("blue");
	hideChecked(e);
}

function undoItems(e) {
	console.log("undoing");
	$(".checked").parent().removeClass("done").addClass("todo");
	$(".checked").siblings().removeClass("blue");
	hideChecked(e);
}

function deleteItems(e) {
	hideChecked(e);

	var postURL = "/items/delete/";
	var postJSON = {};
	$(".checked").each(function() {
		var item = $(this).children("input").attr("name")
		postJSON[item] = item;
	});
	console.log(postJSON);
	$.post(postURL, postJSON, deleteItemsCallback);
}

function deleteItemsCallback(result) {
	var getURL = "/lists/test";
	$.get(getURL, displayListCallback);
}


/****************************************** 
 * for changing the view options
 ******************************************/

function toggleEdit(e) {
	$(".item-name").prop("disabled", function () {
		return ! $(this).prop("disabled");
	});
}

// switch between all, todo, and done
function changeOption(e) {
	// change selected option
	$(".selected").removeClass("selected");
	$(this).addClass("selected");

	// uncheck all items
	$(".checked").removeClass("checked").siblings(".check").children().text("+");

	// unhide hidden items
	$(".hidden").removeClass("hidden").css({display: "block"});

	var display = $(this).attr("id");
	if (display == "todo") {
		$(".todo").show();
		$(".done").hide();
		$(".undo-button").addClass("complete-button").removeClass("undo-button");
		$("footer").show();

		$(".complete-button").unbind("click").click(completeItems);
		$(".check").unbind("click").click(selectItem);
	}
	if (display == "done") {
		$(".todo").hide();
		$(".done").show();
		$(".complete-button").addClass("undo-button").removeClass("complete-button");
		$("footer").show();

		$(".undo-button").unbind("click").click(undoItems);
		$(".check").unbind("click").click(selectItem);
	}
	if (display == "all") {
		$(".todo").show();
		$(".done").show();
		$("footer").hide();
		$(".check").unbind("click");
	}
}


/****************************************** 
 * for selecting items
 ******************************************/

function selectItem(e) {
	$(this).siblings(".item").addClass("checked");
	$(this).children().text("-");
	$(this).unbind("click").click(deselectItem);

	$(this).siblings(".item").children("input").prop("disabled", function () {
		return ! $(this).prop("disabled");
	});
}

function deselectItem(e) {
	$(this).siblings(".item").removeClass("checked");
	$(this).children().text("+");
	$(this).unbind("click").click(selectItem);

	$(this).siblings(".item").children("input").prop("disabled", function () {
		return ! $(this).prop("disabled");
	});

}

function hideChecked(e) {
	$(".checked").parent().addClass("hidden");
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

