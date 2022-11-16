class Histogram {

    constructor(parentElement, data) {
        this.data = data
        this.parentElement = parentElement
        this.displayData = []

        this.initVis()
    }

    initVis() {
        let vis = this



        vis.wrangleData()
    }

    wrangleData() {
        let vis = this
        vis.getCounts()
    }

    updateVis() {

    }

    // get the # songs released per year
    getCounts() {
        let vis = this
        console.log(vis.data)
    }
}