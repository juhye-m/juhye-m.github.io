
// skeleton stuff - left comments on places that need to be worked on
let linegraph;

// need to parse date string and convert to time
let parseDate = d3.timeParse("%Y");

// if data is top year 2021 or 2020
// then time parse week, parseDateWeek = d3.timeParse() , and then get the year

// Load CSV file - we can change this too? to be more like the recent psets?
function loadData() {
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
	}).then(data => {
        // we should make classes for our visualizations
		console.log(data)
		let count = 0
		data.forEach(function(d,i) {
			if (data[i].TopYear == 2021) {

				count = count + 1
			}
		})
		console.log(count)

		linegraph = new LineChart("line-chart-area",data)

	});
}

function loadData2() {
	d3.csv("data/genre_data.csv", row => {
		row.Count = +row.Count
		return row
	}).then(data => {
		bargraph = new BarChart("chart1",data)
	})
}

loadData()
loadData2()

// store category selection - for dropdown
let selectedCategory =  document.getElementById('categorySelector').value;
console.log(selectedCategory)

function categoryChange() {
   selectedCategory =  document.getElementById('categorySelector').value;
//    linechart_characteristics.wrangleData();
}

