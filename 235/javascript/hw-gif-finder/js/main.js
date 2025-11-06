// 1 - Hooking up a button event handler in the window.onload event (Only this part is added to the onload event)
window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked;
};

// 2 - Store what the user searched for, 
//     Needs to be in the script scope so we can access it from outside our searchButtonClicked() function
let displayTerm = "";

	//===============================================================
	// Downloading the data with XHR
	//===============================================================

	// ** XML Http Request to download data from the URL assembled 
	function getData(url) {
		// 1 - Create a new XHR Object
		let xhr = new XMLHttpRequest();

		// 2 - Set the onload event handler [When data is successfully loaded]
		xhr.onload = dataLoaded;

		// 3 - Set the onerror event handler [When some errors occur]
		xhr.onerror = dataError;

		// 4 - Open connection and send the request
		xhr.open("GET", url);	// "GET" -> Sending web service parameters in the query string not as a separate file("PUT")
		xhr.send();
	}
	// Callback Functions
	function dataLoaded(e) {
		// 5 - event.target is the xhr object 
		let xhr = e.target;

		// 6 - xhr.responseText is the JSON file we just downloaded
		console.log(xhr.responseText);

		//===============================================================
		// Formatting the results for the user
		//===============================================================

		// 7 - Turn the text into a parsable Javascript object
		let obj = JSON.parse(xhr.responseText);

		// 8 - If there are no results, print a message and return  -> Not an all purpose code!
		if(!obj.data || obj.data.length == 0) {
			document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
			return; // Bail out
		}

		// 9 - Start building an HTML string we will display to the user
		let results = obj.data;
		console.log("results.length = " + results.length);
		let bigString = "";

		// 10 - Loop through the array of results
		for(let i=0; i < results.length; i++) {
			let result = results[i];

			// 11 - Get the URL to the GIF 
			let smallURL = result.images.fixed_width_small.url;
			if(!smallURL) smallURL = "images/no-images-found.png";

			// 12 - Get the URL to the GIPHY Page
			let url = result.url;
            let rating = result.rating.toUpperCase();

			// 13 - Build a <div> to hold each result
			// ES6 String Templating
			let line = `<div class='result'><img src='${smallURL}' title='${result.id}' />`;
			line += `<span><a target='_blank' href='${url}'>View On Giphy</a><br>Rating: ${rating}</span></div>`;

			// 14 - Another way of doing the same thing above
			// Replaces this:
			// var line = "<div class='result'>";
			// 		line += "<img src'";
			// 		line += smallURL;
			// 		line += "' title= '";
			// 		line += result.id;
			// 		line += "' />";
			//
			// 		line += "<span><a target='_blank' href='" + url + "'>View on Giphy</a></span>";
			// 		line += "</div>";

			// 15 - Add the <div> to 'bigString' and loop
			bigString += line;
		}

		// 16 - All done building the HTML - show it to the user!
		document.querySelector("#content").innerHTML = bigString;

		// 17 - Update the status
		document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
	}

	function dataError(e) {
		console.log("An error occurred");
	}

// 3 - searchButtonClicked() will be called when the button is clicked
function searchButtonClicked(){
	console.log("searchButtonClicked() called");

	//===============================================================
	// Capture the user intent and format a URL
	//===============================================================

	// 1 - Giphy Search Endpoint 
	const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

	// 2 - API Key identifies the user as the owner of the service
	let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

	// 3 - Build up our URL string [Specify / Give Value]
	let url = GIPHY_URL;
	url += "api_key=" + GIPHY_KEY;
    
	// 4 - Parse the user entered term we wish to search
	let term = document.querySelector("#searchterm").value;
	displayTerm = term;

	// 5 - Get rid of any leading and trailing spaces
	term = term.trim();

	// 6 - Encode spaces and special characters [A space becomes %20]
	term = encodeURIComponent(term);

	// 7 - If there's no term to search then bail out of the function (return does this)
	if(term.length < 1) return;

	// 8 - Append the search term to the URL - the parameter name is 'q' (stands for query)
	url += "&q=" + term;
    
	// 9 - Grab the user chosen search 'limit' from the <select> and append it to the URL
	let limit = document.querySelector("#limit").value;
	url += "&limit=" + limit; // Parameters are formatted as name=value and separated by ampersands
	
	// 10 - Update the UI with the user's search term
	document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

	// 11 - See what the URL looks like -> Log out the URL
	console.log(url);

	// 12 - Request data!
	getData(url);
}