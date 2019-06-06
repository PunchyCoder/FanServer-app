   "use strict";

const url = "https://kitsu.io/api/edge/anime"; //data.attributes.posterImage
const APIKey = 'AIzaSyARlWxggTnR6mIMhHdyW2Bnf7BomchaBaE';


function handle_SynopsisButton() {
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

function handle_TrailerButton() {
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
	handle_SynopsisButton();
	handle_TrailerButton();
}

function injectTemplate(element, count) {
	const cardTemplate = 
		`<div id=${count} class="card border">
			<span>${count}</span>
			<img src="${element.attributes.posterImage.tiny}">
			<div class="info">
				<h3 class="title">${element.attributes['titles']['en']}</h3>

				<p><i class="fas fa-heart" style="color: #ff3575"></i>  ${element.attributes.averageRating}% Approval</p>
				<p>Rated <strong>${element.attributes.ageRating}</strong></p>
				<p>${element.attributes.episodeCount} episodes</p>

				<div class="button-container">
					<input class="synopsis btn" type="button" name="synopsis-btn" value="Synopsis">
					<input class="trailer btn" type="button" name="trailer-btn" value="Trailer">
				</div>
			</div>
			
			<div class="trailer hidden">
				<h4 class="trailer">Trailer</h4>
				<iframe width="320" height="240" src="https://www.youtube.com/embed/${element.attributes.youtubeVideoId}"></iframe>
			</div>

			<div class="synopsis hidden">
				<h4 class="synopsis">Synopsis</h4>
				<p>${element.attributes.synopsis}</p>
			</div>
		</div>`;
	return cardTemplate;
}

function formatSearchResults(responseJson) {
	$('#results').empty();
	$('#results').append( `<h2>Results</h2>` );
	let count = 0;
	responseJson['data'].forEach( element => {
		count++;
		$('#results').append( 
			injectTemplate(element, count)
		);
		addCardButtons();
	})
}

function formatQueryParams(params) {
	const queryItems = Object.keys(params)
	.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryItems.join('&');
}

function searchAnime(search) {
	const params = {
		'filter[text]': search,
		'page[limit]': 10,
		'page[offset]': 0 
	}
	const queryString = formatQueryParams(params);
	const searchURL = url + '?' + queryString;

	fetch(searchURL)
	.then(response => response.json())
	.then(responseJson => {
		formatSearchResults(responseJson);
	})
}

function watchForm() {

	$('body').toggleClass('fade');
	//searchAnime("dragon ball"); // for debugging purpposes...

	$('form').submit(function(e) {
		e.preventDefault();
		const searchTitle = $('.search-title').val();
		searchAnime(searchTitle);
	});
}

$(watchForm);

