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
        vis.center = { x:vis.width/2, y: vis.height/2 };

        // position force for bubbles layout
        // vis.forceStrength = 0.03;
   
        // define the radius based on the count of genres
        function bubbleRadius(d) {
            return d.Count / 10
        }

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

        // axis labels
        // vis.svg.append("text")
        //     .attr("class", "axis-label")
        //     .text("Count")
        //     .attr("transform", "translate(-35, " + vis.height / 2 + ") rotate(-90)")
        //     .attr("text-anchor", "middle")
        //     .attr("font-size", "13px")

        // vis.svg.append("text")
        //     .attr("class", "axis-label")
        //     .text("Genre Type")
        //     .attr("transform", "translate(" + vis.width / 2 + ", " + (vis.height + 35) + ")")
        //     .attr("text-anchor", "middle")
        //     .attr("font-size", "13px")

        // vis.tooltip = d3.select("body").append('div')
        //     .attr('class', "tooltip")
        //     .attr('id', 'barTooltip')

        // creating a force simulation for the layout of the nodes

        // vis.simulation = d3.forceSimulation()
        // .force('charge', d3.forceManyBody().strength(charge))
        // // .force('center', d3.forceCenter(centre.x, centre.y))
        // .force('x', d3.forceX().strength(vis.forceStrength).x(vis.center.x))
        // .force('y', d3.forceY().strength(vis.forceStrength).y(vis.center.y))
        // .force('collision', d3.forceCollide().radius(d => bubbleRadius(d) + 1));

        // // // we don't want force simulation yet because there are no nodes yet
        // vis.simulation.stop();
        
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
        .range([0, 80])

        // use map() to convert raw data into node data
        // vis.nodes = vis.data.map(d => ({
        //     ...d,
        //     radius: vis.radiusScale(+d.size),
        //     size: +d.size,
        //     x: Math.random() * 900,
        //     y: Math.random() * 800
        //     }))

        
    // create svg element inside provided selector
    vis.svg = d3.select(vis.parentElement)
    .append('svg')
    .attr('width', vis.width)
    .attr('height', vis.height)

    // bind nodes data to circle elements
    vis.circles = vis.svg.selectAll('circles')
    .data(vis.data)
    .enter()
    .append('g')

    // console.log("hello i have reached here")
    vis.bubbles = vis.circles
    .append('circle')
    // .attr("class","bubble")
    .attr("class","circlez")
    .attr("fill",function(d){return vis.colorScale(d.id)})
    .attr("cx", function(d,i){return 30 + i*60})
    .attr("cy", 150)
    .attr("r", 19)
    // .attr("cx",d=> {
    //     return d.x
    // })
    // .attr("cy", d=> {
    //     return d.y
    // });

    // .attr('r', function(d){console.log(bubbleRadius(d)); console.log(hi); return bubbleRadius(d)})
    // .attr('fill',fungit ction(d){console.log(colorScale(d)); return colorScale(d)})

    // labels
    vis.labels = vis.circles
    .append('text')
    .attr('dy', '.3em')
    .style('text-anchor', 'middle')
    .style('font-size', 10)
    .text(d => d.Genre)

    // set simulation's nodes to our newly created nodes array
    // simulation starts running automatically once nodes are set
    // vis.simulation.nodes(vis.nodes)
    // .on('tick', ticked)
    // .restart();
    

    // callback function called after every tick of the force simulation
    // here we do the actual repositioning of the circles based on current x and y value of their bound node data
    // x and y values are modified by the force simulation
    // function ticked() {
    //     vis.bubbles
    //     .attr('cx', d => d.x)
    //     .attr('cy', d => d.y)

    //     vis.labels
    //     .attr('x', d => d.x)
    //     .attr('y', d => d.y)
    // }

    }

}

   

    // data manipulation function takes raw data from csv and converts it into an array of node objects
    // each node will store data and visualisation values to draw a bubble
    // rawData is expected to be an array of data objects, read in d3.csv
    // function returns the new node array, with a node for each element in the rawData input


    // main entry point to bubble chart, returned by parent closure
    // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process
    // let chart = function chart(selector, rawData) {
    // // convert raw data into nodes data
    // nodes = createNodes(rawData);

    // return chart function from closure
    // return chart;
// }
