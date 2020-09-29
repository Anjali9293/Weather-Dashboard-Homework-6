//variable to store the current date
const currentDay = moment()
	.format('L');
//variable to store unique API key
var API_KEY = "555f0f1cc17650cb7069ee6104be4ed1";
var searchHistory = getSearchHistory();
var searchButton = document.getElementById("search-button");
var searchValue = document.getElementById("search-value");
var card = {
	date: document.querySelectorAll(".card-title"),
	images: document.querySelectorAll(".card-body .card-image"),
	temp: document.querySelectorAll(".card-body .card-temp span"),
	humidity: document.querySelectorAll(".card-body .card-humid span")
}

var apiData
// This function adds search to localstorage and updates sidebar
function addToSearchHistory(City) {
	searchHistory.push(City);
	setSearchHistory(searchHistory);
	var node = document.createElement("li");
	node.setAttribute("class", "list-group-item");
	var textnode = document.createTextNode(City);
	node.appendChild(textnode);
	//onclick eventlistener for list items
	node.addEventListener("click", function () {
		handleSideBarOnClick(City);
	});
	document.querySelector(".cities")
		.appendChild(node);
}
//This function displays the weather and forecaset from API when the items in the serach histroy is clicked
function handleSideBarOnClick(name) {
	getCityWeatherAndForecastByName(name);
}

// This function gets search history from localstorage
function setSearchHistory(searchHistory) {
	localStorage.searchHistory = JSON.stringify(searchHistory);
}

// This function returns search history
function getSearchHistory() {
	return JSON.parse(localStorage.searchHistory || "[]");
}

// This function creates side bar from search history on load
function createSidebarFromHistory() {
	getCityWeatherAndForecastByName(searchHistory[searchHistory.length - 1]);
	searchHistory.forEach(function (cityName, i) {
		var node = document.createElement("li");
		node.addEventListener("click", function () {
			handleSideBarOnClick(cityName);
		});
		node.setAttribute("class", "list-group-item");
		var textnode = document.createTextNode(cityName);
		node.appendChild(textnode);
		document.querySelector(".cities")
			.appendChild(node);
	});
}

// This function will handle search click event
function searchButtonEventHandler(event) {
	let city = searchValue.value;
	addToSearchHistory(city);
	getCityWeatherAndForecastByName(city);
}

// This function gets weather and forecast from API by city name using the response from APIs
function getCityWeatherAndForecastByName(name) {
	var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + name + "&APPID=" + API_KEY;

	$.ajax({
			url: weatherQueryURL,
			method: "GET"
		})
		.then(function (response) {
			apiData = response
			let imageUrl = "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
			document.querySelector('.city')
				.textContent = apiData.name + "(" + currentDay + ")";
			document.querySelector(".weather-icon")
				.src = imageUrl;
			document.querySelector('.windSpeed')
				.textContent = apiData.wind.speed;
			document.querySelector('.humidity')
				.textContent = apiData.main.humidity;
			document.querySelector('.temp')
				.textContent = (apiData.main.temp)
				.toFixed(1);

			var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&APPID=" + API_KEY;
			console.log(uvQueryURL);
			$.ajax({
					url: uvQueryURL,
					method: "GET"
				})
				.then(function (response) {
					console.log(response)

					apiData = response
					var UVIndex = document.querySelector('.uvIndex');
					var apiUVData = response.value
					UVIndex.textContent = apiUVData;
					//condition to set the background color of uv index content based on the defined range
					if (parseInt(apiUVData) < 3) {
						UVIndex.setAttribute("style", "background-color: green;");
					} else if (parseInt(apiUVData) > 6) {
						UVIndex.setAttribute("style", "background-color: red;");
					} else {
						UVIndex.setAttribute("style", "background-color: yellow;");
					}


				});
		});
	var forecastqueryURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + name + "&APPID=" + API_KEY;
	$.ajax({
			url: forecastqueryURL,
			method: "GET"
		})
		.then(function (response) {
			apiData = response
			for (var i = 0; i < card.date.length; i++) {
				let forecastIndex = ((i + 1) * 8) - 4;
				let forecast = response.list[forecastIndex];
				let imageUrl = "https://openweathermap.org/img/wn/" + forecast.weather[0].icon + ".png";
				let forecastDate = moment(currentDay, "L")
					.add((i + 1), 'days')
					.format('L');

				card.date[i].textContent = forecastDate;
				card.images[i].src = imageUrl;
				card.temp[i].textContent = forecast.main.temp;
				card.humidity[i].textContent = forecast.main.humidity;
			}

		});
}


searchButton.addEventListener("click", searchButtonEventHandler);
createSidebarFromHistory();