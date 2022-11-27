
// skeleton stuff - left comments on places that need to be worked on
let linegraph, histogram, bargraph, durationLineChart, timeline;

// random images
let randomImages = []

// need to parse date string and convert to time
let parseDate = d3.timeParse("%Y");

// define global colors
let LIGHTGREEN = "#b2df8a"
let DARKGREEN = "#33a02c"
let LIGHTBLUE = "#a6cee3"
let DARKBLUE = "#1f78b4"
let PINK = "#fb9a99"

// define toggles / selects
let histIncludeToggled = true;

// if data is top year 2021 or 2020
// then time parse week, parseDateWeek = d3.timeParse() , and then get the year

// load data using promises
let promises = [
	d3.csv("data/average_by_year.csv", row => {
		row.Acousticness = +row.Acousticness
		row.BPM = +row.BPM
		row.Danceability = +row.Danceability
		row.Duration = +(row.Duration/1000)
		row.Energy = +row.Energy
		row.Liveness = +row.Liveness
		row.Loudness = +row.Loudness
		row.Popularity = +row.Popularity
		row.Speechiness = +row.Speechiness
		row.Valence = +row.Valence
		//row.ReleaseDate = +row.ReleaseDate
		row.TopYear = +row.TopYear


		// row.year = parseDate(row.year);

		return row
	}),
	d3.csv("data/genre_data.csv", row => {
		row.Count = +row.Count
		return row
	}),
	d3.csv("data/all_data.csv", row => {
		row.Acousticness = +row.Acousticness
		row.BPM = +row.BPM
		row.Danceability = +row.Danceability
		row.Duration = +(row.Duration/1000)
		row.Energy = +row.Energy
		row.Liveness = +row.Liveness
		row.Loudness = +row.Loudness
		row.Popularity = +row.Popularity
		row.Speechiness = +row.Speechiness
		row.Valence = +row.Valence
		row.ReleaseDate = +row['Release Date']
		row.TopYear = +row['Top Year']

		return row
	}),
	d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vS9L2WBfFbB7oufMsljuKdtW0m_wD7VhwUJHr1xzlEhykIDzWrK1fpvx3QnGJ67CWXwnIwBsSkx9aT1/pub?gid=0&single=true&output=csv", row => {
		row.Date = Date.parse(row.Date)

		return row
	}),
	fetch('https://api.unsplash.com/photos/random?client_id=mDk2A8Pk4OzkR-cdNX0xnp0QeBTD6D0sVrUT11jZjPE&count=22')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			let imageArrTemp = []
			for (let i = 0; i < data.length; i++) {
				imageArrTemp.push(data[i]['urls']['raw'] + "&w=300&h=300&crop=entropy&fit=clamp")
			}
			return imageArrTemp
		})
];

Promise.all(promises)
	.then(function (data) {
		initMainPage(data)
	})
	.catch(function (err) {
		console.log(err)
	});

function initMainPage(dataArray) {
	console.log(dataArray)

	let averageByYearData = dataArray[0]
	let genreData = dataArray[1]
	let allData = dataArray[2]
	let timelineData = dataArray[3]
	randomImages = dataArray[4]

	bargraph = new BarChart("chart1",genreData)
	histogram = new Histogram("histogram", allData)
	linegraph = new LineChart("line-chart-area", averageByYearData)
	durationLineChart = new DurationLineChart("duration-line-chart", averageByYearData)
	timeline = new Timeline("timeline", timelineData)
}

// store category selection - for dropdown
let selectedCategory =  document.getElementById('categorySelector').value;
console.log(selectedCategory)

function categoryChange() {
   selectedCategory =  document.getElementById('categorySelector').value;
//    linechart_characteristics.wrangleData();
}

function histToggleChange() {
	histIncludeToggled =  document.getElementById('histogram-toggle').checked;
	histogram.toggled()
	histogram.wrangleData()
}

function getAlbumImage(trackID) {

}

function getTrackURL(trackID) {

}

function getRandomImage(year) {
	let index = 2022 - year
	return randomImages[index]
}