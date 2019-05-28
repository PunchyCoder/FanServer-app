  "use strict";


const url = "https://kitsu.io/api/edge/anime"; //data.attributes.posterImage
const APIKey = '';

function formatQueryParams(params) {
	const queryItems = Object.keys(params)
	.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryItems.join('&');
}


function displayResults(responseJson, id) {
  console.log("displaying Results...");
  $(".video").append(
  	`<iframe type="text/html" width="300" height="200" src="https://www.youtube.com/embed/${id}?modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" ><br />
		</iframe>`
  	)
};

function formatSearchResults(responseJson) {
	$('#results').empty();

	responseJson['data'].forEach( element => {
		$('#results').append( // div.card => added .expand (debugging purposes)
			`<div class="card">
				 
				<img src="${element.attributes.posterImage.tiny}">
				<div class="info">
					<h3 class="title">${element.attributes['titles']['en']}</h3>
					<p>Rated <strong>${element.attributes.ageRating}</strong></p>
					<p>${element.attributes.episodeCount} episodes</p>
					<p><i class="fas fa-heart"></i> ${element.attributes.averageRating}</p>

					<div class="button-container">
						<input class="synopsis square-btn" type="button" name="synopsis-btn" value="synopsis">

						<input class="trailer square-btn" type="button" name="trailer-btn" value="trailer">
					</div>
				</div>
				
				<div class="trailer hidden">
					<iframe type="text/html" width="300" height="200" src="https://www.youtube.com/embed/${element.attributes.youtubeVideoId}?modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" ><br />
					</iframe>
				</div>

				<div class="synopsis hidden">
					<h4 class="synopsis">Synopsis</h4>
					<p>${element.attributes.synopsis}</p>
				</div>

				<div class="video"></div>
			</div>`);

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
  	
  	fetch(searchURL)
  	.then(response => response.json())
  	.then(responseJson => {
  		console.log(responseJson)
  		const videoID = responseJson['data']['youtubeVideoId']; // need to display video forEach result > not just item[0]
  		displayResults(responseJson, videoID);
  	})
}


function searchAnime(search) { //  Use anime title as search!
	const params = {
		'filter[text]': search
	}

	const queryString = formatQueryParams(params);
	const searchURL = url + '?' + queryString;
	console.log(searchURL);

	fetch(searchURL)
	.then(response => response.json())
	.then(responseJson => {
		console.log(responseJson['data'][0].attributes.posterImage.medium)
		console.log(`Fan Rating: ${responseJson['data'][0].attributes.popularityRank}`)
		formatSearchResults(responseJson);
		return responseJson		
	})
	// .then( responseJson => {
	// 	const animeTitle = responseJson['data'][0].attributes.slug;
	// 	searchYoutube(animeTitle);
	// });
}

function addCardButtons() {
	
	// $('input.synopsis').on("click", function(e) { //need to select only
	// 	e.stopImmediatePropagation();
	// 	// $(e.currentTarget).next().toggleClass('hidden');
	// 	$(document.querySelector('div.'))
	// });


	// Deals with "synopsis" button "logic"
	$('input.synopsis').on("click", function(e) { //need to select only
		e.stopImmediatePropagation();
		
		const cardEl = $(e.currentTarget).parent().parent().parent().first();
		const trailerEl = $(e.currentTarget).parent().parent('div.info').next();

		if (!trailerEl.hasClass('hidden')) {
			trailerEl.addClass('hidden');
			cardEl.toggleClass('expand');
		};

		$(e.currentTarget).parent().parent().parent().first().toggleClass('expand');

		$(e.currentTarget).parent().parent('div.info').first().next().next().toggleClass('hidden');
	});

	// Deals with "trailer" button "logic"
	$('input.trailer').on("click", function(e) { //need to select only
		e.stopImmediatePropagation();

		const cardEl = $(e.currentTarget).parent().parent().parent().first();
		const synopsisEl = $(e.currentTarget).parent().parent('div.info').first().next().next();
		
		if (!synopsisEl.hasClass('hidden')) {
			synopsisEl.toggleClass('hidden');
			cardEl.toggleClass('expand');
		};

		$(e.currentTarget).parent().parent().parent().first().toggleClass('expand');

		$(e.currentTarget).parent().parent('div.info').next().toggleClass('hidden'); // trailer video el needs to be hidden
	});
}


function watchForm() {
	$('body').toggleClass('fade');
	searchAnime("death"); // for debugging purpposes...
	$('form').submit(function(e) {
		e.preventDefault();
		const searchTitle = $('.search-title').val();
		searchAnime(searchTitle);
	});
}

$(watchForm);

