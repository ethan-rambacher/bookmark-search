chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
	var sugg = completion_dict[text];
	if (sugg != undefined){
	    chrome.omnibox.setDefaultSuggestion({"description":completion_dict[text][0].description});
	    suggest(
		sugg
	    );
	}
    });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function(text) {
	// change tab location to bookmark URL
	var new_url = bm_dict[text.toLowerCase()];
	if (new_url == undefined){
	    alert("Bookmark '"+text+"' not found");
	} else {
	    chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
		chrome.tabs.update(undefined, {url: new_url});
	    });
	}
    });

// add all completions to dictionary
function addCompletions(compdict, title){
    for (var i=1; i<=title.length; ++i){
	var part = title.substr(0,i);
	if (!compdict.hasOwnProperty(part))
	    compdict[part] = [];
	compdict[part].push({content: title, description: "<match>"+title+"</match>"});
    }
}

// construct dictionary of bookmark titles and URLs
function addBookmarks(urldict, compdict, tree){
    if (tree != undefined){
	for (var i=0; i<tree.length; ++i){
	    var subtree = tree[i];
	    if (subtree && subtree.hasOwnProperty("url")){
		urldict[subtree.title.toLowerCase()] = subtree.url;
		addCompletions(compdict, subtree.title.toLowerCase());
	    }
	    addBookmarks(urldict, compdict, subtree.children);
	}
    }
}

var bm_dict = {};
var completion_dict = {};
chrome.bookmarks.getTree(function(nodes){
    addBookmarks(bm_dict, completion_dict, nodes);
});

// TODO deal with duplicate names
// TODO convert to lowercase
// TODO include partial completion results, or add addl dict for partials
