class Timeline {

    constructor(parentElement, data) {
        this.data = data
        this.parentElement = parentElement
        this.displayData = data

        this.initVis()
    }

    initVis() {
        let vis = this

        // create svg
        vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 200 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // title
        vis.svg.append("text")
            .text("How Are Short-Form Media & Streaming Involved?")
            .attr("transform", "translate(" + vis.width/2 + ",0)")
            .attr("text-anchor", "middle")

        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        // axis labels
        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Year of Release")
            .attr("transform", "translate(" + vis.width / 2 + ", " + (vis.height + 35) + ")")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'timelineTooltip')

        // wrangle data
        vis.wrangleData()
    }

    wrangleData() {
        let vis = this

        // update vis
        vis.updateVis()
    }

    updateVis() {
        let vis = this

        // Create domains for scales
        vis.x.domain(d3.extent(vis.displayData, d => d.Date))

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").transition().duration(800).call(vis.xAxis);

        // draw bars
        vis.items = vis.svg.selectAll(".timeline-item")
            .data(vis.displayData, d => d.year)

        vis.items.enter().append("circle")
            .attr("class", "timeline-item")
            .style("fill", d => {
                if (d.Category === "video") {
                    return DARKBLUE
                }
                else {
                    return DARKGREEN
                }
            })
            .attr("cx", d => vis.x(d.Date))
            .attr("cy", 50)
            .attr("r", 10)
            .attr("stroke", "white")
            .attr("opacity", 0.7)
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .attr("opacity", 1)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                             <h3>${d.Event}<h3>
                    `)
                    .transition()
                    .style("opacity", 1)

            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .transition()
                    .attr("opacity", 0.7)
            })


        vis.items.exit().remove()

    }
}