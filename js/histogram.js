class Histogram {

    constructor(parentElement, data) {
        this.data = data
        this.parentElement = parentElement
        this.displayData = data
        this.countData = []

        this.initVis()
    }

    initVis() {
        let vis = this

        // create svg
        vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

        vis.width = 500
        vis.height = 500

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleBand()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'histogramTooltip')

        // wrangle data
        vis.wrangleData()
    }

    wrangleData() {
        let vis = this

        // filter and populate displayData

        // get the counts by year
        vis.getCountsByYear() // populates vis.countData using vis.displayData

        // sort the data by release date\
        vis.countData = vis.countData.sort((a, b) => a.year - b.year)

        // update vis
        vis.updateVis()
    }

    updateVis() {
        let vis = this

        // Create domains for scales
        vis.y.domain([0, d3.max(vis.countData, d => d.yearCount)])
        vis.x.domain(vis.countData.map(d => d.year))
            .padding([.2])

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").transition().duration(800).call(vis.xAxis);
        vis.svg.select(".y-axis").transition().duration(800).call(vis.yAxis);

        // draw bars
        vis.bars = vis.svg.selectAll(".histogram-bar")
            .data(vis.countData, d => d)

        vis.bars.enter().append("rect")
            .attr("class", "histogram-bar")
            .merge(vis.bars)
            .attr("x", d => vis.x(d.year))
            .attr("y", vis.height)
            .attr("width", vis.x.bandwidth())
            .attr("height", 0)
            .on('mouseover', function(event, d){
                d3.select(this)
                    .transition()
                    .attr('stroke-width', '1px')
                    .attr('stroke', 'black')
                    .style('fill', 'white');

                function descriptionText(d) {
                    let desc = ""

                    if (d.yearCount === 1) {
                        desc += "There was 1 song"
                    }
                    else {
                        desc += "There were <b>" + d.yearCount + " songs</b>"
                    }

                    desc += " released that ended up in the top 100"

                    if (d.year === 2021) {
                        desc += " in 2021."
                    }
                    else {
                        desc += " between " + d.year + " and 2021."
                    }
                    return desc
                }

                vis.tooltip
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .style("opacity", 0)
                    .html(`
                         <h3>In ${d.year}...</h3>
                         <p>${descriptionText(d)}</p>
                         <p></p>
                        `)
                    .transition()
                    .style("opacity", 1)

            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .transition()
                    .attr('stroke-width', '0')
                    .style("fill", "black")

                vis.tooltip
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)
                    .transition()
                    .style("opacity", 0)

            })
            .transition().duration(800)
            .attr("y", d => vis.y(d.yearCount))
            .attr("height", d => vis.height - vis.y(d.yearCount))
    }

    // get the # songs released per year
    getCountsByYear() {
        let vis = this

        // create a map counting # songs by release date (in years)
        let map = d3.rollup(vis.displayData, v => v.length, d => d.ReleaseDate)

        // convert map to array and assign to displayData
        vis.countData = Array.from(map, ([year, yearCount]) => ({ year, yearCount }))

        console.log(vis.countData)
    }
}