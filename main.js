   "use strict";

const url = "https://kitsu.io/api/edge/anime"; //data.attributes.posterImage
const APIKey = 'AIzaSyBNbDFY9N6VjBIq_3QUODfX0olLhwrEGqg';

function formatQueryParams(params) {
	const queryItems = Object.keys(params)
	.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryItems.join('&');
}

// function displayResults(responseJson, id) {
//   console.log("displaying Results...");
//   $("div.trailer").append(
//   	`<iframe type="text/html" width="300" height="200" src="https://www.youtube.com/embed/${id}?modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" ><br />
// 		</iframe>`
//   	)
// };


function injectTemplate(element, trailerId) {
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
				<iframe width="420" height="315" src=\`https://www.youtube.com/embed/${trailerId}\`></iframe>
			</div>

			<div class="synopsis hidden">
				<h4 class="synopsis">Synopsis</h4>
				<p>${element.attributes.synopsis}<input type="button" value="x" onclick="clickSynopsisButton()"></p>
			</div>
		</div>`;
	return cardTemplate;
}


function formatSearchResults(responseJson) {
	$('#results').empty();
	responseJson['data'].forEach( element => {
		$('#results').append( 
			injectTemplate(element, searchYoutube(element.attributes.titles.en))
		);
		addCardButtons();
	})
}

// ----- Call to YouTube
function searchYoutube(search) {
	const params = {
		part: 'snippet',
		key: APIKey,
		q: search + ' anime trailer',
		type: 'video',
		maxResults: 5,
		videoEmbeddable: true
	};
	const queryString = formatQueryParams(params);
	const url = 'https://www.googleapis.com/youtube/v3/search';
	const searchURL = url + '?' + queryString;

  	console.log("Youtube searchURL: " + searchURL) // Console.log

  	fetch(searchURL)
  	.then(response => response.json())
  	.then(responseJson => {
  		console.log("youtube Response " + responseJson)
  		const trailerId = responseJson.items[0].id.videoId; // grabs first result of each search.
  		console.log('trailerID = ' + trailerId )
  		return trailerId;
  	})
}

// ----- Call to Kitsu API
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
	})
}

function handle_Synopsis() {
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
}

function handle_Trailer() {
	$('input.trailer').on("click", function(e) { //need to select only
		e.stopImmediatePropagation();
		const cardEl = $(e.currentTarget).parents('div.card').first();
		const synopsisEl = $(e.currentTarget).parents('div.info').first().nextAll('div.synopsis');
		if (!synopsisEl.hasClass('hidden')) {
			synopsisEl.toggleClass('hidden');
			cardEl.toggleClass('expand');
		};
		cardEl.toggleClass('expand');
		$(e.currentTarget).parent().parent('div.info').next().toggleClass('hidden'); 
	});
}

function addCardButtons() {
	handle_Synopsis();
	handle_Trailer();
}

function watchForm() {
	$('body').toggleClass('fade');
	searchAnime("dragon ball"); // for debugging purpposes...
	searchYoutube('dragon ball');

	$('form').submit(function(e) {
		e.preventDefault();
		const searchTitle = $('.search-title').val();
		searchAnime(searchTitle);
	});
}

$(watchForm);

