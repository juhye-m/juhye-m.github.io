
// skeleton stuff - left comments on places that need to be worked on

// need to parse date string and convert to time
// let parseDate = d3.timeParse("%Y"); 

// Load CSV file - we can change this too? to be more like the recent psets?
function loadData() {
	d3.csv("data/OUR_DATA_FILENAME.csv", row => {
        // placeholder, we need to convert our strings to numbers
		// row.year = parseDate(row.year);

		return row
	}).then(data => {
        // we should make classes for our visualizations
        // linechart_characteristics = new LineChart("line-chart-area",data)
	});
}


// store category selection - for dropdown
let selectedCategory =  document.getElementById('categorySelector').value;

function categoryChange() {
   selectedCategory =  document.getElementById('categorySelector').value;
//    linechart_characteristics.wrangleData();
}