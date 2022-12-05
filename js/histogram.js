class Histogram {

    constructor(parentElement, data) {
        this.data = data
        this.parentElement = parentElement
        this.filteredData = data
        this.displayData = data
        this.countData = []

        this.initVis()
    }

    initVis() {
        let vis = this

        // create svg
        vis.margin = { top: 40, right: 40, bottom: 60, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 750 - vis.margin.top - vis.margin.bottom;

        // vis.width = 500
        // vis.height = 500

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // title
        vis.title = vis.svg.append("text")
            .attr("transform", "translate(" + vis.width/2 + ", -10)")
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

        // append slider
        vis.slider = document.getElementById('histogramSlider');
        vis.lowerYear = document.getElementById('histLowerYear')
        vis.upperYear = document.getElementById('histUpperYear')
        vis.lowerYear.innerHTML = '2010'
        vis.upperYear.innerHTML = '2021'

        noUiSlider.create(vis.slider, {
            connect: true,
            range: {
                'min': [2010],
                'max': [2021]
            },
            step: 1,
            start: [2010, 2021],
            behaviour: 'tap-drag',
            format: {
                to: (v) => parseInt(v),
                from: (v) => parseInt(v)
            }
        });

        vis.slider.noUiSlider.on('slide', function (values, handle) {

            vis.toggled()

            let chosenYears = vis.slider.noUiSlider.get()
            let lowerYear = chosenYears[0]
            let upperYear = chosenYears[1]

            vis.lowerYear.innerHTML = lowerYear
            vis.upperYear.innerHTML = upperYear

            vis.filteredData = vis.data.filter(d => d['TopYear']>= lowerYear && d['TopYear'] <= upperYear)

            vis.wrangleData()
        });

        // wrangle data
        vis.wrangleData()
    }

    wrangleData() {
        let vis = this

        // filter and populate displayData
        if (histIncludeToggled) {
            vis.displayData = vis.filteredData
        }
        else {
            vis.displayData = vis.filteredData.filter(d => d.ReleaseDate !== d.TopYear)

        }

        vis.displayData = vis.displayData.filter(d => d.ReleaseDate <= d.TopYear)

        // get the counts by year
        vis.getCountsByYear() // populates vis.countData using vis.displayData

        // sort the data by release date
        vis.countData = vis.countData.sort((a, b) => a.year - b.year)

        // title
        vis.extent = d3.extent(vis.filteredData, d => d['TopYear'])

        // update vis
        vis.updateVis()
    }

    updateVis() {
        let vis = this



        if (vis.extent[0] === vis.extent[1]) {
            vis.title.text("When were the Top 100 songs in " + vis.extent[0] + " released?")
        }
        else {
            vis.title.text("When were the Top 100 songs between " + vis.extent[0] + " and " + vis.extent[1] + " released?")
        }


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
                console.log(vis.extent)
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
                else if (vis.extent[0] === vis.extent[1]) {
                    desc += " in " + vis.extent[0] + "."
                }
                else {

                    desc += " between " + vis.extent[0] + " and " + vis.extent[1] + "."
                }

                // choose 3 random songs
                let songs = vis.getRandomSongs(d.year)

                let songsDesc = ``
                for (let i = 0; i < songs.length; i++) {
                    songsDesc += `<div class="histogram-panel-songContainer">
                        <div class="histogram-panel-songItem">
                            <div class="histogram-panel-songContent">
                                <img class="histogram-panel-songImage" src="${songs[i]['ImageURL']}">
                                <div class="histogram-panel-songText">
                                    <h3 class="histogram-panel-songTitle">${songs[i]['Title']}</h3>
                                    <p class="histogram-panel-songArtist">${songs[i]['Artist']}</p>
                                    
                                </div>
                            </div>
                            <div>
                                <div class="histogram-panel-playButton">
                                    <a href="${songs[i]['SpotifyURL']}"><img src="assets/svg/play.png"></a>
                                </div>
                            </div>  
                        </div>
                        <div>
                            <p class="histogram-panel-songTopYear">Top 100 in ${songs[i]['TopYear']}</p>
                        </div>
                    </div>
                    `
                }

                // populate side panel
                // d3.select("#histogram-panel-header").text("In the year of " + d.year + "...")
                d3.select("#histogram-panel-description").html(
                    `
                        <div class="histogram-panel-playlistPicture">
                            <h2>Released in ${d.year}...</h2>
                            <img src=${getRandomImage(d.year)}>
                        </div>
                        <p>${desc}</p>
                        <p>${songsHeader}</p>
                        <div id="histogram-panel-songlist">${songsDesc}</div>
                
                    `
                )
            })
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("stroke", "black")
                    .transition().duration(200)
                    .attr('stroke-width', '1px')
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .attr("filter", "drop-shadow(0 0 3px black)")
                    .transition().duration(200)
                    .attr("filter", "none")
                    .attr("stroke-width", '0')
            })
            .transition().delay((d, i) => i * 100).duration(800)
            .attr("y", d => vis.y(d.yearCount))
            .attr("height", d => vis.height - vis.y(d.yearCount))
            .style("fill", DARKGREEN)

        vis.bars
            .transition().duration(800)
            .attr("x", d => vis.x(d.year))
            .attr("width", vis.x.bandwidth())
            .attr("y", d => vis.y(d.yearCount))
            .attr("height", d => vis.height - vis.y(d.yearCount))

        vis.bars.exit()
            .transition()
            .duration(400)
            .attr("y", vis.height)
            .attr("height", 0)
            .remove()
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