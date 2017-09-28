chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
	suggest([
	    {content: text + " one", description: "the first one"},
	    {content: text + " number two", description: "the second entry"}
	]);
    });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function(text) {
	console.log('inputEntered: ' + text);
	// change tab location to bookmark URL
	var new_url = bm_dict[text.toLowerCase()];
	console.log(new_url);
	if (new_url == undefined){
	    alert("Bookmark '"+text+"' not found");
	} else {
	    chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
		chrome.tabs.update(undefined, {url: new_url});
	    });
	}
    });

// construct dictionary of bookmark titles and URLs
function addBookmarks(dict, tree){
    if (tree != undefined){
	for (var i=0; i<tree.length; ++i){
	    var subtree = tree[i];
	    if (subtree && subtree.hasOwnProperty("url")){
		dict[subtree.title.toLowerCase()] = subtree.url;
		console.log(subtree.title+", "+subtree.url);
	    }
	    addBookmarks(dict, subtree.children);
	}
    }
}

var bm_dict = {};
chrome.bookmarks.getTree(function(nodes){
    addBookmarks(bm_dict, nodes);
});

// TODO deal with duplicate names
// TODO convert to lowercase
// TODO include partial completion results, or add addl dict for partials
