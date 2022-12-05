
class LineChart {

    constructor(parentElement, data, allData) {
        this.parentElement = parentElement;
        this.data = data;
        this.allData = allData

        this.initVis();

    }

    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;
        vis.margin = {top: 40, right: 40, bottom: 50, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;
        // vis.width = 600
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
            .tickFormat(d3.format("d"));

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

        // Update scale domains

        vis.x.domain([2010, 2021])
        vis.y.domain([0, 1])

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
            .attr("opacity", 0.7)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Danceability) }))
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
                      <div class="feature-tooltip-container">
                        Danceability: ${getFeatureTooltip("danceability")}</div>
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
            .on("click", function(e, d) {
                let panel = document.getElementById("char-output-panel")

                // get top 3 songs
                vis.getTopSongsByFeature("danceability")

                panel.innerHTML = vis.getHTMLforTopThree(vis.getTopSongsByFeature("danceability"), "danceability")
            })

        vis.path2
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "purple")
            .attr("stroke-width", 5)
            .attr("opacity", 0.7)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Speechiness) }))
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
                      <div class="feature-tooltip-container">
                        Speechiness: ${getFeatureTooltip("speechiness")}              
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
            .on("click", function(e, d) {
                let panel = document.getElementById("char-output-panel")

                // get top 3 songs
                vis.getTopSongsByFeature("speechiness")

                panel.innerHTML = vis.getHTMLforTopThree(vis.getTopSongsByFeature("speechiness"), "speechiness")
            })

        vis.path3
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 5)
            .attr("opacity", 0.7)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Energy) }))
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
                      <div class="feature-tooltip-container">
                        Energy: ${getFeatureTooltip('energy')}              
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
            .on("click", function(e, d) {
                let panel = document.getElementById("char-output-panel")

                // get top 3 songs
                vis.getTopSongsByFeature("energy")

                panel.innerHTML = vis.getHTMLforTopThree(vis.getTopSongsByFeature("energy"), "energy")
            })

        vis.path4
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 5)
            .attr("opacity", 0.7)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Acousticness) }))
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
                      <div class="feature-tooltip-container">
                        Acousticness: ${getFeatureTooltip("acousticness")}              
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
            .on("click", function(e, d) {
                let panel = document.getElementById("char-output-panel")

                // get top 3 songs
                vis.getTopSongsByFeature("acousticness")

                panel.innerHTML = vis.getHTMLforTopThree(vis.getTopSongsByFeature("acousticness"), "acousticness")
            })

        vis.path5
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 5)
            .attr("opacity", 0.7)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Valence) }))
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
                      <div class="feature-tooltip-container">
                        Valence: ${getFeatureTooltip("valence")}              
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
            .on("click", function(e, d) {
                let panel = document.getElementById("char-output-panel")

                // get top 3 songs
                vis.getTopSongsByFeature("valence")

                panel.innerHTML = vis.getHTMLforTopThree(vis.getTopSongsByFeature("valence"), "valence")
            })

    }

    getTopSongsByFeature(featureName)  {
        let vis = this

        let firstLetter = featureName.charAt(0).toUpperCase()
        let remainingLetters = featureName.substring(1)
        let properName = firstLetter + remainingLetters

        let filteredArr = vis.allData.sort((a, b) => b[properName] - a[properName])
        let topThree = []

        for (let i=0; i<3; i++) {
            topThree.push(filteredArr[i])
        }

        return topThree
    }

    getHTMLforTopThree(arr, featureName) {
        let firstLetter = featureName.charAt(0).toUpperCase()
        let remainingLetters = featureName.substring(1)
        let properName = firstLetter + remainingLetters

        let output = `
            <div class="char-song-container">
                <div class="char-song-header">
                    <h2>${properName}</h2>
                    <p>${getFeatureTooltip(featureName)}</p>  
                </div>
                <div class="panel-subheader">The top three songs with the highest values in ${properName} are....</div>
            `
        for (let i=0; i<arr.length; i++) {
            console.log(arr[i])
            output += `
                    <div class="histogram-panel-songContainer">
                        <div class="histogram-panel-songItem">
                            <div class="histogram-panel-songContent">
                                <img class="histogram-panel-songImage" src="${arr[i]['ImageURL']}">
                                <div class="histogram-panel-songText">
                                    <h3 class="histogram-panel-songTitle">${arr[i]['Title']}</h3>
                                    <p class="histogram-panel-songArtist">${arr[i]['Artist']}</p>
                                    
                                </div>
                            </div>
                            <div>
                                <div class="histogram-panel-playButton">
                                    <a href="${arr[i]['SpotifyURL']}"><img src="assets/svg/play.png"></a>
                                </div>
                            </div>  
                        </div>
                        <div>
                            <p class="histogram-panel-songTopYear">${properName + ": " + parseFloat(arr[i][properName]).toFixed(2)} &middot; Top 100 in ${arr[i]['TopYear']}</p>
                        </div>
                    </div>
                `
        }

        output += `</div>`

        return output
    }
}