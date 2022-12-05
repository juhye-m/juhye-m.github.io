class DurationLineChart {

    constructor(parentElement, data, eventData) {
        this.parentElement = parentElement;
        this.data = data;
        this.eventData = eventData
        this.zoomed = false

        this.initVis();

    }

    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;
        vis.margin = {top: 40, right: 40, bottom: 50, left: 50};
        //vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        //vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.width = 500
        vis.height = 500

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'lineTooltip')

        // title
        vis.svg.append("text")
            .text("Average Top 100 Song Duration Over Time")
            .attr("transform", "translate(" + vis.width/2 + ", -10)")
            .attr("text-anchor", "middle")

        vis.x = d3.scaleLinear()
            .range([0, vis.width]);
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d3.format("d"))

        vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
        vis.svg.append('g')
            .attr('class', 'axis y-axis');

        // axis labels
        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Year")
            .attr("transform", "translate(" + vis.width / 2 + ", " + (vis.height + 35) + ")")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Average Duration of Top 100 Songs (s)")
            .attr("transform", "translate(-35, " + vis.height / 2 + ") rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

        // Initialize line path
        vis.path1 = vis.svg.append('g')
            .append("path")

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'durationTooltip')

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;
        // get average values for each year

        vis.eventData = vis.eventData.filter(d => d.Highlight === "yes").sort((a, b) => a.Date - b.Date)

        if (vis.zoomed) {
            vis.y.domain(d3.extent(vis.data, d=>d.Duration))
        }
        else {
            vis.y.domain([0, d3.max(vis.data, d=>d.Duration)])
        }


        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // Update scale domains

        vis.x.domain([2010, 2021])

        // Update axes
        vis.svg.select(".y-axis")
            .transition()
            .duration(800)
            .call(vis.yAxis);
        vis.svg.select(".x-axis")
            .transition()
            .duration(800)
            .call(vis.xAxis);

        vis.path1
            .datum(vis.data)
            .attr("class", "path")
            .attr("fill", "none")
            .attr("stroke", DARKGREEN)
            .attr("stroke-width", 2)
            .transition()
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Duration) }))

        // Add event overlay depending on toggle
        vis.overlay = vis.svg.selectAll(".event")
            .data(vis.eventData, d => d.Event)

        // if toggled, overlay events
        if (durationOverlayToggled) {
            vis.overlay.enter().append("rect")
                .attr("class", "event")
                .attr("x", d => vis.x(new Date(d.Date).getFullYear()))
                .attr("width", 5)
                .attr("y", vis.height)
                .attr("height", 0)
                .style("fill", 'black')
                .attr("opacity", 0.2)
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .transition()
                        .attr("opacity", 1)

                    vis.tooltip
                        .style("opacity", 0)
                        .style("position", "absolute")
                        .style("left", event.pageX + 20 + "px")
                        .style("top", event.pageY + "px")
                        .style("z-index", 2)
                        .html(`
                        <div class="event-tooltip-container">
                            <div class="event-tooltip-header">
                                <div><img class="event-tooltip-image" src="${d.Image}"></div>
                                <div class="event-tooltip-eventName">
                                    <h3>${d.Event}<h3>
                                    <p>${new Date(d.Date).getFullYear()}</p>
                                </div>
                            </div>
                            <div class="event-tooltip-eventDetails">
                                <p>${d.Details}</p>
                            </div>
                        </div>
                             
                    `)
                        .transition()
                        .style("opacity", 1)

                })
                .on("mouseout", function(event, d) {
                    d3.select(this)
                        .transition()
                        .attr("opacity", 0.2)

                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``);
                })
                .transition().delay((d, i) => i * 100).duration(800)
                .attr("y", 0)
                .attr("height", vis.height)
        }
        else {
            vis.overlay
                .transition()
                .delay((d, i) => i * 100)
                .duration(400)
                .attr("y", vis.height)
                .attr("height", 0)
                .remove()
        }

        // deal with zooming in

        let startpoint, endpoint;
        for (let i = 0; i < vis.data.length; i++) {
            console.log(vis.data[i])
            if (vis.data[i]['TopYear'] === 2017) {
                startpoint = vis.data[i].Duration
            }
            else if (vis.data[i]['TopYear'] === 2019) {
                endpoint = vis.data[i].Duration
            }
        }

        // add points with labels
        vis.start = vis.svg.append("circle")
        vis.startlbl = vis.svg.append("text")
        vis.end = vis.svg.append("circle")
        vis.endlbl = vis.svg.append("text")

        console.log(d3.selectAll(".point"))
        let numPoints = d3.selectAll(".point")._groups[0].length

        if (vis.zoomed && numPoints < 2) {
            vis.start
                .attr("class", "point")
                .attr("cx", vis.x(2017))
                .attr("r", 6)
                .attr("opacity", 0)
                .style("fill", PINK)
                .transition().duration(1600)
                .attr("opacity", 1)
                .attr("cy", vis.y(startpoint))

            vis.startlbl
                .attr("class", "point-label")
                .text(parseInt(startpoint) + " sec")
                .attr("text-anchor", "beginning")
                .attr("dominant-baseline", "central")
                .attr("x", vis.x(2017) + 10)
                .style("fill", PINK)
                .attr("opacity", 0)
                .transition().duration(1600)
                .attr("opacity", 1)
                .attr("y", vis.y(startpoint))

            vis.end
                .attr("class", "point")
                .attr("cx", vis.x(2019))
                .attr("r", 6)
                .attr("opacity", 0)
                .style("fill", PINK)
                .transition().duration(1600)
                .attr("opacity", 1)
                .attr("cy", vis.y(endpoint))

            vis.endlbl
                .attr("class", "point-label")
                .text(parseInt(endpoint) + " sec")
                .attr("text-anchor", "beginning")
                .attr("dominant-baseline", "central")
                .attr("x", vis.x(2019))
                .style("fill", PINK)
                .attr("opacity", 0)
                .transition().duration(1600)
                .attr("opacity", 1)
                .attr("y", vis.y(endpoint) - 20)

            d3.selectAll(".point-label").attr("font-size", "12px")

            // fade path to dark green
            d3.select(".path").transition().duration(800)
                .attr("opacity", 0.3)
                .attr("d", d3.line()
                    .x(function(d) {return vis.x(d.TopYear) })
                    .y(function(d) {return vis.y(d.Duration) }))

            // append line segment to highlight drop
            let simpleLine = d3.line()
            vis.linesegment = vis.svg.append("path")
                .attr("class", "line-segment")
                .attr("stroke", PINK)
                .attr("stroke-width", "2px")
                .attr("opacity", 0)
                .transition().duration(1600).delay(1600)
                .attr("opacity", 1)
                .attr("d", simpleLine([[vis.x(2017), vis.y(startpoint)], [vis.x(2019), vis.y(endpoint)]]))
        }
        else if (vis.event === "button") {
            // remove the points and labels
            d3.selectAll(".point")
                .transition().duration(400)
                .attr("opacity", 0)
                .remove()

            d3.selectAll(".point-label")
                .transition().duration(400)
                .attr("opacity", 0)
                .remove()

            // fade path to dark green
            d3.select(".path").transition().duration(800)
                .attr("opacity", 1)
                .attr("d", d3.line()
                    .x(function(d) {return vis.x(d.TopYear) })
                    .y(function(d) {return vis.y(d.Duration) }))

            // remove line segment
            d3.selectAll(".line-segment")
                .transition().duration(200)
                .attr("opacity", 0)
                .remove()
        }

        vis.event = ""
    }

    clicked() {
        let vis = this

        vis.event = "button"

        // toggle boolean zoomed
        vis.zoomed = !vis.zoomed

        if (vis.zoomed) {
            // change button color
            let elem = document.getElementById("duration-btn")
            elem.innerHTML = "Zoom back out"
            elem.style.backgroundColor = '#afafaf'

            // hide explanation text
            let expl = document.getElementById("duration-explanation")
            expl.className = "toFadeIn"
        }
        else {
            // change button color
            let elem = document.getElementById("duration-btn")
            elem.innerHTML = "Dive deeper..."
            elem.style.backgroundColor = DARKGREEN

            // hide explanation text
            let expl = document.getElementById("duration-explanation")
            expl.className = "toFadeOut"
        }

        // update domain and call axes again
        vis.wrangleData()

    }
}