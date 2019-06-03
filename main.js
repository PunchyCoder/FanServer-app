   "use strict";

// <iframe class="video" type="text/html" width="300" height="200" src="https://www.youtube.com/embed/${element.attributes.youtubeVideoId}?modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" ><br />
// 					</iframe>

const url = "https://kitsu.io/api/edge/anime"; //data.attributes.posterImage
const APIKey = 'AIzaSyBNbDFY9N6VjBIq_3QUODfX0olLhwrEGqg';

function formatQueryParams(params) {
	const queryItems = Object.keys(params)
	.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryItems.join('&');
}


function displayResults(responseJson, id) {
  console.log("displaying Results...");
  $("div.trailer").append(
  	`<iframe type="text/html" width="300" height="200" src="https://www.youtube.com/embed/${id}?modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" ><br />
		</iframe>`
  	)
};

function injectTrailers(element) { // what does "response" refer to?

	console.log("injectTrailers executing...");
	// response.data.attributes.titles['en'].forEach( element => {
	// 		$('#results').find("div.trailer").append(  // .something =>traverses down tree, selects all matching elements	
	// 	);

	const trailerId = searchYoutube(element.attributes['titles']['en']); // returns videoId == trailerId

  	const trailerHTML = `<iframe type="text/html" width="300" height="200" src="https://www.youtube.com/embed/${trailerId}?modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" ><br />
		</iframe>`
	return trailerHTML;
}

function injectTemplate(element) {
	const cardTemplate = 
		`<div class="card border">
				<img src="${element.attributes.posterImage.tiny}">
				<div class="info">
					<h3 class="title">${element.attributes['titles']['en']}</h3>

					<p><i class="fas fa-heart" style="color: #ff3575"></i>  ${element.attributes.averageRating}% Approval</p>
					<p>Rated <strong>${element.attributes.ageRating}</strong></p>
					<p>${element.attributes.episodeCount} episodes</p>

					<div class="button-container">
						<input class="synopsis btn" type="button" name="synopsis-btn" value="synopsis">
						<input class="trailer btn" type="button" name="trailer-btn" value="trailer">
					</div>
				</div>
				
				<div class="trailer hidden">
					<h4 class="trailer">Trailer</h4>
				</div>

				<div class="synopsis hidden">
					<h4 class="synopsis">Synopsis</h4>
					<p>${element.attributes.synopsis}<input type="button" value="x" onclick="clickSynopsisButton()"></p>
				</div>
			</div>`;
			return cardTemplate;
}

//===========================
// function formatSearchResults(responseJson) {
// 	for( let i = 0; i < 0; i++ ) {

// 	}
// }
// ==========================

function formatSearchResults(responseJson) {
	$('#results').empty();

	responseJson['data'].forEach( element => {
		$('#results').append( 
			injectTemplate(element)
		);
		// $('div.trailer').append(
		// 	injectTrailers(element) // hopefully just grabs trailer for each individual element...
		// );
		addCardButtons();
	})
}

// Search Youtube API--
function searchYoutube(search) {
	const params = {
		
		key: APIKey,
		q: search + ' anime trailer',
		part: 'snippet',
		type: 'video',
		videoEmbeddable: true
	};
	const queryString = formatQueryParams(params);
	const url = 'https://www.googleapis.com/youtube/v3/search';
	const searchURL = url + '?' + queryString;

  	console.log(searchURL) // Console.log

  	fetch(searchURL)
  	.then(response => response.json())
  	.then(responseJson => {
  		console.log("youtube Response " + responseJson)
  		const videoID = responseJson.items[0].id.videoId; // grabs first result of each search.
  		return videoID;
  		//displayResults(responseJson, videoID);
  	})
}


function searchAnime(search) { //  Use anime title as search!
	const params = {
		'filter[text]': search,
		'page[limit]': 10,
		'page[offset]': 0
	}
	const queryString = formatQueryParams(params);
	const searchURL = url + '?' + queryString;
	console.log(searchURL); // Console.log
	fetch(searchURL)
	.then(response => response.json())
	.then(responseJson => {
		formatSearchResults(responseJson);
		return responseJson;	
	})
	// Run call-search to youtube for video on "trailer button" click OR 
}

function addCardButtons() {

	// Deals with "synopsis" button "logic"
	$('input.synopsis').on("click", function(e) { //need to select only
		e.stopImmediatePropagation();
		const cardEl = $(e.currentTarget).parents('div.card').first();
		const trailerEl = $(e.currentTarget).parents('div.info').next();
		if (!trailerEl.hasClass('hidden')) {
			trailerEl.addClass('hidden');
			cardEl.toggleClass('expand');
		};
		cardEl.toggleClass('expand');
		$(e.currentTarget).parents('div.info').first().nextAll('div.synopsis').toggleClass('hidden');
	});

	// Deals with "trailer" button "logic"
	$('input.trailer').on("click", function(e) { //need to select only
		e.stopImmediatePropagation();
		const cardEl = $(e.currentTarget).parents('div.card').first();
		const synopsisEl = $(e.currentTarget).parents('div.info').first().nextAll('div.synopsis');
		if (!synopsisEl.hasClass('hidden')) {
			synopsisEl.toggleClass('hidden');
			cardEl.toggleClass('expand');
		};
		cardEl.toggleClass('expand');
		$(e.currentTarget).parent().parent('div.info').next().toggleClass('hidden'); // trailer video el needs to be hidden
	});
}

function watchForm() {
	$('body').toggleClass('fade');
	searchAnime("dragon ball"); // for debugging purpposes...

	$('form').submit(function(e) {
		e.preventDefault();
		const searchTitle = $('.search-title').val();
		searchAnime(searchTitle);
	});
}

$(watchForm);

