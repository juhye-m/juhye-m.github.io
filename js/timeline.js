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

        vis.width = 260 - vis.margin.left - vis.margin.right;
        vis.height = 800 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr("overflow", "hidden")
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // title
        vis.svg.append("text")
            .text("Timeline of Interesting Events")
            .attr("transform", "translate(-35, -20)")
            .attr("text-anchor", "beginning")

        // Scales and axes
        vis.y = d3.scaleTime()
            .range([0, vis.height]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'timelineTooltip')

        // wrangle data
        vis.wrangleData()
    }

    wrangleData() {
        console.log("wrangled")
        let vis = this

        if (selectedTimelineCategory !== "all") {
            vis.displayData = vis.data.filter(d => d.Category === selectedTimelineCategory)
        }
        else {
            vis.displayData = vis.data
        }

        // update vis
        vis.updateVis()
    }

    updateVis() {
        let vis = this

        // Create domains for scales
        vis.y.domain(d3.extent(vis.displayData, d => d.Date))

        // Call axis functions with the new domain
        vis.svg.select(".y-axis").transition().duration(800).call(vis.yAxis);

        // draw bars
        vis.items = vis.svg.selectAll(".timeline-item")
            .data(vis.displayData, d => d.Event)

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
            .attr("cx", 15)
            .attr("cy", d => vis.y(d.Date))
            .attr("r", 5)
            .attr("stroke", "white")
            .attr("opacity", 0)
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .attr("opacity", 1)
                    .attr("cursor", "pointer")

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
                    .attr("opacity", 0.7)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .transition().duration(800)
            .attr("opacity", 0.7)

        vis.items.transition()
            .duration(800)
            .attr("cy", d => vis.y(d.Date))

        vis.items.exit().remove()

    }
}