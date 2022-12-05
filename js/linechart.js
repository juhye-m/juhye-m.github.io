
class LineChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;


        this.initVis();

    }

    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;
        vis.margin = {top: 40, right: 40, bottom: 50, left: 50};
        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;
        vis.width = 750
        //vis.height = 500

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'lineTooltip')

        vis.x = d3.scaleLinear()
            .range([0, vis.width]);
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(34).tickFormat(d3.format("d"));

        vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
        vis.svg.append('g')
            .attr('class', 'axis y-axis');

        // title
        vis.svg.append("text")
            .text("Characteristics of Top 100 Songs Over Time")
            .attr("transform", "translate(" + vis.width/2 + ",0)")
            .attr("text-anchor", "middle")

        // axis labels
        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Average Value")
            .attr("transform", "translate(-35, " + vis.height / 2 + ") rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Year")
            .attr("transform", "translate(" + vis.width / 2 + ", " + (vis.height + 35) + ")")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

// Initialize line path
        vis.path1 = vis.svg.append('g')
            .append("path")
        vis.path2 = vis.svg.append('g')
            .append("path")
        vis.path3 = vis.svg.append('g')
            .append("path")
        vis.path4 = vis.svg.append('g')
            .append("path")
        vis.path5 = vis.svg.append('g')
            .append("path")



        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;
        // get average values for each year


        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        console.log(d3.max(vis.data, d=>d.Danceability))
        console.log(d3.min(vis.data, d=>d.TopYear))

        // Update scale domains

        vis.x.domain([2010, 2021])
        vis.y.domain([0, d3.max(vis.data, d=>d.Energy)])

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
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 5)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Danceability) }))
            .on('mouseover', function(event, d){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                 <div style="border: thin solid grey; border-radius: 5px; color: black; background: lightgrey; padding: 10px">
                     Danceability: Describes how suitable a track is for dancing based on a combination of musical 
                     elements including tempo, rhythm stability, beat strength, and overall regularity.              
                 </div>`)
            })
            .on('mouseout', function(event, d){
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
        vis.path2
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "purple")
            .attr("stroke-width", 5)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Speechiness) }))
            .on('mouseover', function(event, d){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                 <div style="border: thin solid grey; border-radius: 5px; color: black; background: lightgrey; padding: 10px">
                     Speechiness: This detects the presence of spoken words in a track. The more exclusively speech-like
                      the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value.               
                 </div>`)
            })
            .on('mouseout', function(event, d){
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
        vis.path3
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 5)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Energy) }))
            .on('mouseover', function(event, d){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                 <div style="border: thin solid grey; border-radius: 5px; color: black; background: lightgrey; padding: 10px">
                     Energy: Represents a perceptual measure of intensity and activity. Typically, energetic tracks 
                     feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude 
                     scores low on the scale.               
                 </div>`)
            })
            .on('mouseout', function(event, d){
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        vis.path4
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 5)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Acousticness) }))
            .on('mouseover', function(event, d){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                 <div style="border: thin solid grey; border-radius: 5px; color: black; background: lightgrey; padding: 10px">
                     Acousticness: A confidence measure from 0.0 to 1.0 of whether the track is acoustic.              
                 </div>`)
            })
            .on('mouseout', function(event, d){
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        vis.path5
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 5)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Valence) }))
            .on('mouseover', function(event, d){
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                 <div style="border: thin solid grey; border-radius: 5px; color: black; background: lightgrey; padding: 10px">
                     Valence: Describes the musical positiveness conveyed by a track. Tracks with high valence sound 
                     more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative 
                     (e.g. sad, depressed, angry).             
                 </div>`)
            })
            .on('mouseout', function(event, d){
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

    }
}