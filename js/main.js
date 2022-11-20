
// skeleton stuff - left comments on places that need to be worked on
let linegraph, histogram, bargraph;

// need to parse date string and convert to time
let parseDate = d3.timeParse("%Y");

// define global colors
let LIGHTGREEN = "#b2df8a"
let DARKGREEN = "#33a02c"
let LIGHTBLUE = "#a6cee3"
let DARKBLUE = "#1f78b4"
let PINK = "#fb9a99"

// define toggles / selects
let histIncludeToggled = true

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

	bargraph = new BarChart("chart1",genreData)
	histogram = new Histogram("histogram", allData)
	linegraph = new LineChart("line-chart-area", averageByYearData)
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

function getRandomImage() {
	fetch('https://source.unsplash.com/random/300x300')
		.then(function(response) {
			return response.url
		})

	return 'https://source.unsplash.com/random/300x300'
}