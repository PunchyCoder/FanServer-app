"use strict";


const url = "https://kitsu.io/api/edge/anime"; //data.attributes.posterImage
const APIKey = 'AIzaSyDNG36ws49yKH8Ze2XifveUAKM5n_o9tr0'; // Youtube Key

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

// Search Youtube API--
function searchYoutube(search) {
	const params = {
		
		key: APIKey,
		q: search + ' anime trailer',
		part: 'snippet',
		type: 'video',
		videoEmbeddable: true
	}

	const queryString = formatQueryParams(params);
	const url = 'https://www.googleapis.com/youtube/v3/search';
	const searchURL = url + '?' + queryString;

	
  	
  	fetch(searchURL)
  	.then(response => response.json())
  	.then(responseJson => {
  		console.log(responseJson)
  		const videoID = responseJson.items[0].id.videoId;
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
		$('section').append(
		`<div class="card">
			<img src="${responseJson['data'][0].attributes.posterImage.tiny}">
			<div class="info">
				<p>${responseJson['data'][0].attributes['titles']['en']} </p>
				<p>${responseJson['data'][0].attributes['ageRating']}</p>
				<p>Popularity Rank: ${responseJson['data'][0].attributes['popularityRank']}</p>
			</div>
		</div>`);
		return responseJson		

	})
	.then( responseJson => {
		const animeTitle = responseJson['data'][0].attributes.slug;
		searchYoutube(animeTitle);
	});

}

function watchForm() {
	$('form').submit(function(e) {
		e.preventDefault();
		const searchTitle = $('.search-title').val();

		searchAnime(searchTitle);
	})
	console.log('hello weebs!')
}

$(watchForm);

