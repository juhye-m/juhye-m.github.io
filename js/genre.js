class BubbleChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 40, right: 40, bottom: 40, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

        // center the circles
        // vis.center = { x:vis.width/2, y: vis.height/2 };

        // position force for bubbles layout
        // vis.forceStrength = 0.03;
   
        // define the radius based on the count of genres
        // function bubbleRadius 

        // charge dependent on size of the bubble
        // function charge(d) {
        //     return Math.pow(bubbleRadius(d), 2.0) * 0.01
        // }

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);


        // title
        vis.svg.append("text")
            .text("Most Common Genres of Top 100 Songs")
            .attr("transform", "translate(" + vis.width/2 + ",0)")
            .attr("text-anchor", "middle")


        vis.tooltip = d3.select("body").append('div')
        .attr('class', "tooltip")
        .attr('id', 'genreTooltip')
        
        vis.colorScale = d3.scaleOrdinal()
        .domain(["0","1", "2", "3","4", "5"])
        .range(d3.schemeSet3);

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;
        vis.updateVis()
    }

    updateVis() {
        let vis = this;
        vis.maxSize = d3.max(vis.data, d => d.Count);

       vis.radiusScale = d3.scaleSqrt()
        .domain([0, vis.maxSize])
        .range([0, 100])

    vis.circles = vis.svg.selectAll('circles')
    .data(vis.data)
    .enter()
    .append('g')

 
    vis.bubbles = vis.circles
    .append('circle')
    // .attr("class","bubble")
    .attr("class","circlez")
    .attr("fill",function(d){return vis.colorScale(d.id)})
    .attr("r", function(d){return vis.radiusScale(d.Count)})
    .attr("cx",d=> {
        return d.x
    })
    .attr("cy", d=> {
        return d.y
    })
    .on("mouseover", function(event, d) {
        d3.select(this)
            .transition()
            .attr("opacity", 1)
            .attr("cursor", "pointer")

        vis.tooltip
            .style("opacity", 0)
            .style("position", "absolute")
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + 10+ "px")
            .style("z-index", 2)
            .html(`
              <div class="genre-tool-tip">
                Count: ${d.Count}</div>
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
    });

    // labels
    vis.labels = vis.circles
    .append('text')
    .attr('dy', '.3em')
    .style('text-anchor', 'middle')
    .style('font-size', 10)
    .text(d => d.Genre)
    .attr("x",d=> {
        return d.x
    })
    .attr("y", d=> {
        return d.y
    });

    

    }

}

