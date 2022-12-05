// skeleton stuff - left comments on places that need to be worked on
let linegraph, histogram, bargraph, durationLineChart, timeline;

// random images
let randomImages = []

// need to parse date string and convert to time
let parseDate = d3.timeParse("%Y");

// define global colors
let LIGHTGREEN = "#c9f3b0"
let DARKGREEN = "#33a02c"
let LIGHTBLUE = "#a6cee3"
let DARKBLUE = "#1f78b4"
let PINK = "#fb9a99"
let ORANGE = "#ffa98a"
let YELLOW = "#ffec8a"


// define toggles / selects
let histIncludeToggled = true;
let selectedTimelineCategory = "all"
let durationOverlayToggled = false

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
		row.id = +row.id
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
	d3.json('data/images.json')
		.then(function(data) {
			let imageArrTemp = []
			for (let i = 0; i < data.length; i++) {
				imageArrTemp.push(data[i]['urls']['raw'] + "&w=300&h=300&crop=entropy&fit=clamp")
			}

			// randomize order
			imageArrTemp = imageArrTemp.sort(() => (Math.random() > .5) ? 1 : -1);

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

	// bargraph = new BarChart("chart1",genreData)
	histogram = new Histogram("histogram", allData)
	linegraph = new LineChart("line-chart-area", averageByYearData, allData)
	durationLineChart = new DurationLineChart("duration-line-chart", averageByYearData, timelineData)
	timeline = new Timeline("timeline", timelineData)
	genrechart = new BubbleChart("genrechart",genreData)
	let createYourOwnSong = new DIYSong(allData)
}

function histToggleChange() {
	histIncludeToggled =  document.getElementById('histogram-toggle').checked;
	histogram.toggled()
	histogram.wrangleData()
}

function durationToggleChange() {
	durationOverlayToggled =  document.getElementById('duration-toggle').checked;
	durationLineChart.wrangleData()
}

function getRandomImage(year) {
	let index;
	if (year === 1965) {
		index = 25
	}
	else if (year === 1994) {
		index = 24
	}
	else if (year === 2007) {
		index = 23
	}
	else if (year === 2009){
		index = 22
	}
	else {
		index = 2022 - year
	}

	return randomImages[index]
}

function timelineCategoryChange() {
	selectedTimelineCategory = document.getElementById("timeline-select").value;
	let sources = document.getElementById("sources")

	// change explanation display
	if (selectedTimelineCategory === "music") {
		document.getElementById("music").style.display = "block"
		document.getElementById("music").className = "transition-content explanation toFadeIn"
		document.getElementById("video").style.display = "none"
		document.getElementById("explanation-filler").style.display = "none"

		sources.style.display = "block"
		sources.className = "toFadeIn sources"
	}
	else if (selectedTimelineCategory === "video") {
		document.getElementById("music").style.display = "none"
		document.getElementById("video").style.display = "block"
		document.getElementById("video").className = "transition-content explanation toFadeIn"
		document.getElementById("explanation-filler").style.display = "none"

		sources.style.display = "block"
		sources.className = "toFadeIn sources"
	}
	else {
		document.getElementById("music").style.display = "none"
		document.getElementById("video").style.display = "none"
		document.getElementById("explanation-filler").style.display = "block"
		document.getElementById("explanation-filler").className = "toFadeIn filler-text"

		sources.style.display = "none"
	}

	timeline.wrangleData()
}

function durationButtonClick() {
	durationLineChart.clicked()
}