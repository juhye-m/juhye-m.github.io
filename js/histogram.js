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
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

        // vis.width = 500
        // vis.height = 500

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // title
        vis.svg.append("text")
            .text("Release Year of Top 100 Songs Every Year")
            .attr("transform", "translate(" + vis.width/2 + ",0)")
            .attr("text-anchor", "middle")

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

        // axis labels
        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Year of Release")
            .attr("transform", "translate(" + vis.width / 2 + ", " + (vis.height + 35) + ")")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Number of Songs Released")
            .attr("transform", "translate(-35, " + vis.height / 2 + ") rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

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
        if (histIncludeToggled) {
            vis.displayData = vis.data
        }
        else {
            vis.displayData = vis.data.filter(d => d.ReleaseDate !== d.TopYear)
        }

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
            .data(vis.countData, d => d.year)

        vis.bars.enter().append("rect")
            .attr("class", "histogram-bar")
            .style("fill", DARKGREEN)
            .attr("x", d => vis.x(d.year))
            .attr("y", vis.height)
            .attr("width", vis.x.bandwidth())
            .attr("height", 0)
            .on('click', function(e, d){
                vis.svg.selectAll(".histogram-bar").transition().style("fill", DARKGREEN)

                d3.select(this)
                    .transition()
                    .style("fill", LIGHTGREEN)


                // write description
                let desc = ""
                let songsHeader = "Here are a few songs released in this year:"
                if (d.yearCount === 1) {
                    desc += "There was 1 song"
                    songsHeader = "Here's the iconic song released in this year:"
                }
                else {
                    desc += "There were <b>" + d.yearCount + " songs</b>"
                }
                desc += " released this year that ended up in the top 100"
                if (d.year === 2021) {
                    desc += " in 2021."
                }
                else {
                    desc += " between " + d.year + " and 2021."
                }

                // choose 3 random songs
                let songs = vis.getRandomSongs(d.year)

                let songsDesc = ``
                for (let i = 0; i < songs.length; i++) {
                    songsDesc += `<div class="histogram-panel-songItem">
                        <div class="histogram-panel-songContent">
                            <img class="histogram-panel-songImage" src="">
                            <div class="histogram-panel-songText">
                                <h3 class="histogram-panel-songTitle">${songs[i]['Title']}</h3>
                                <p class="histogram-panel-songArtist">${songs[i]['Artist']}</p>
                            </div>
                        </div>
                        <div>
                            <div class="histogram-panel-playButton">
                                <a href="#"><img  src="assets/svg/play.png"></a>
                            </div>
                        </div>  
                    </div>`
                }

                // populate side panel
                // d3.select("#histogram-panel-header").text("In the year of " + d.year + "...")
                d3.select("#histogram-panel-description").html(
                    `
                        <div class="histogram-panel-playlistPicture">
                            <h2>Released in ${d.year}...</h2>
                            <img src=${getRandomImage()}>
                        </div>
                        <p>${desc}</p>
                        <p>${songsHeader}</p>
                        <div id="histogram-panel-songlist">${songsDesc}</div>
                
                    `
                )
            })
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("filter", "drop-shadow(0 0 0 black)")
                    .transition().duration(400)
                    .attr("filter", "drop-shadow(0 0 3px black)")
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .attr("filter", "drop-shadow(0 0 3px black)")
                    .transition().duration(400)
                    .attr("filter", "none")
            })
            .transition().delay((d, i) => i * 100).duration(800)
            .attr("y", d => vis.y(d.yearCount))
            .attr("height", d => vis.height - vis.y(d.yearCount))
            .style("fill", DARKGREEN)

        vis.bars
            .transition().delay((d, i) => i * 60).duration(800)
            .attr("y", d => vis.y(d.yearCount))
            .attr("height", d => vis.height - vis.y(d.yearCount))


        vis.bars.exit().remove()

        console.log(this.getRandomSongs(2010))
    }

    // get the # songs released per year
    getCountsByYear() {
        let vis = this

        // create a map counting # songs by release date (in years)
        let map = d3.rollup(vis.displayData, v => v.length, d => d.ReleaseDate)

        // convert map to array and assign to displayData
        vis.countData = Array.from(map, ([year, yearCount]) => ({ year, yearCount }))
    }

    toggled() {
        let vis = this

        d3.select("#histogram-panel-header").text("Learn more about each year!")
        d3.select("#histogram-panel-description").html(
            `<p>Click on a bar to get started...</p>`
        )

        vis.svg.selectAll(".histogram-bar").style("fill", DARKGREEN)
    }

    // get 5 random songs
    getRandomSongs(year) {
        let vis = this

        let yearData = vis.displayData.filter(d => d.ReleaseDate === year)

        const shuffled = yearData.sort(() => 0.5 - Math.random());

        if (yearData.length < 3) {
            return yearData
        }

        return shuffled.slice(0, 3)
    }
}