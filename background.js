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
	chrome.bookmarks.search({title:text}, function(nodes){
	    console.log(nodes);
	    var new_url = nodes[0].url;
	    console.log(new_url);
	    if (new_url == undefined){
		alert("Bookmark '"+text+"' not found");
	    } else {
		chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
		    chrome.tabs.update(undefined, {url: new_url});
		});
	    }
	});
    });

