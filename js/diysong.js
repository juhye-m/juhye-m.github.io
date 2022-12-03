class DIYSong {
    constructor(data) {
        this.data = data

        this.featureDictionary = [
            {'feature': 'energy', 'range': [0, 1], 'start': [0], 'sliderId': 'energySlider', 'color': PINK, 'step': 0.05, 'format': {to: v => parseFloat(v).toFixed(2), from: v => v}},
            {'feature': 'danceability', 'range': [0, 1], 'start': [0], 'sliderId': 'danceSlider', 'color': LIGHTBLUE, 'step': 0.05, 'format': {to: v => parseFloat(v).toFixed(2), from: v => v}},
            {'feature': 'valence', 'range': [0, 1], 'start': [0], 'sliderId': 'valenceSlider', 'color': LIGHTGREEN, 'step': 0.05, 'format': {to: v => parseFloat(v).toFixed(2), from: v => v}},
            {'feature': 'acousticness', 'range': [0, 1], 'start': [0], 'sliderId': 'acousticSlider', 'color': DARKGREEN, 'step': 0.05, 'format': {to: v => parseFloat(v).toFixed(2), from: v => v}},
            {'feature': 'speechiness', 'range': [0, 1], 'start': [0], 'sliderId': 'speechSlider', 'color': DARKBLUE, 'step': 0.05, 'format': {to: v => parseFloat(v).toFixed(2), from: v => v}},
            {'feature': 'duration', 'range': [0, 360], 'start': [0], 'sliderId': 'durationSlider', 'color': ORANGE, 'step': 5, 'format': {to: (v) => parseInt(v) + " seconds", from: (v) => parseInt(v)} },
            {'feature': 'releaseDate', 'range': [1960, 2021], 'start': [1960], 'sliderId': 'releaseDateSlider', 'color': YELLOW, 'step': 1, 'format': {to: (v) => parseInt(v), from: (v) => parseInt(v)} },
        ]

        this.initVis()
    }

    initVis() {
        let vis = this

        for (let i = 0; i < vis.featureDictionary.length; i++) {
            let feature = vis.featureDictionary[i]
            let featureName = feature['feature']
            let featureSliderId = feature['sliderId']

            vis[featureName + 'Slider'] = document.getElementById(featureSliderId)

            noUiSlider.create(vis[featureName + 'Slider'], {
                start: feature['start'],
                range: {
                    'min': feature['range'][0],
                    'max': feature['range'][1]
                },
                connect: [true, false],
                behaviour: 'tap-drag',
                step: feature['step'],
                format: feature['format']
            });

            $("#" + featureSliderId + " .noUi-connect").css("background-color", feature['color'] + "99")
            $("#" + featureSliderId + " .noUi-handle").css("background-color", feature['color'])

            let firstLetter = featureName.charAt(0).toUpperCase()
            let remainingLetters = featureName.substring(1)
            let properName = firstLetter + remainingLetters

            // $("#diy" + properName + "Value").css("background-color", feature['color'] + "33")
            $("#diy" + properName + "Value").css("background-color", "#ffffff33")
            // $("#diy" + properName + "Value").css("border", "1px solid " + feature['color'] + "99")

            document.getElementById("diy" + properName + "Value").innerHTML = "0.00"
            if (featureName === "duration") {
                document.getElementById("diy" + properName + "Value").innerHTML = 0 + " seconds"
            }
            else if(featureName === "releaseDate") {
                document.getElementById("diy" + properName + "Value").innerHTML = '1960'
            }

            vis[featureName + 'Slider'].noUiSlider.on('slide', function (values, handle) {

                let selectedSliderLabel = document.getElementById("diy" + properName + "Value")
                selectedSliderLabel.innerHTML = vis[featureName + 'Slider'].noUiSlider.get()

            });
        }

        // init event listener for button
        document.getElementById("generateSongButton").addEventListener("click", function() {
            vis.generateSong()
        })
    }

    generateSong() {

        let vis = this

        // grab all values
        let values = {}
        for (let i = 0; i < vis.featureDictionary.length; i++) {
            let feature = vis.featureDictionary[i]
            values[feature['feature']] = parseFloat(vis[feature['feature'] + 'Slider'].noUiSlider.get())
        }

        // grab standard deviation and means for standardization purposes
        let standardizedValues = {}
        for (let i = 0; i < vis.featureDictionary.length; i++) {
            let feature = vis.featureDictionary[i]
            let featureName = feature['feature']
            let firstLetter = featureName.charAt(0).toUpperCase()
            let remainingLetters = featureName.substring(1)
            let properName = firstLetter + remainingLetters

            let input = vis.data.map(a => a[properName]);

            let tempObj = {}
            tempObj['max'] = ss.max(input)
            tempObj['min'] = ss.min(input)

            standardizedValues[featureName] = tempObj
        }

        // write function to standardize values
        function getSquareStDiff(songVal, myVal, feature) {
            let stSongVal = (songVal - standardizedValues[feature]['min']) / (standardizedValues[feature]['max'] - standardizedValues[feature]['min'])
            let stMyVal = (myVal - standardizedValues[feature]['min']) / (standardizedValues[feature]['max'] - standardizedValues[feature]['min'])

            return (stSongVal - stMyVal)
        }

        // start the loop!
        let tempSimilarityArr = []
        for (let i = 0; i < vis.data.length; i++) {
            let tempObj = {}

            // store the track
            tempObj['track'] = vis.data[i]

            // temp sum var
            let tempSum = 0

            // take the square diff
            tempSum += getSquareStDiff(vis.data[i].Acousticness, values['acousticness'], "acousticness")**2
            tempSum += getSquareStDiff(vis.data[i].Energy, values['energy'], "energy")**2
            tempSum += getSquareStDiff(vis.data[i].Danceability, values['danceability'], "danceability")**2
            tempSum += getSquareStDiff(vis.data[i].Duration, values['duration'], "duration")**2
            tempSum += getSquareStDiff(vis.data[i].Valence, values['valence'], "valence")**2
            tempSum += getSquareStDiff(vis.data[i].Speechiness, values['speechiness'], "speechiness")**2
            tempSum += getSquareStDiff(vis.data[i].ReleaseDate, values['releaseDate'], "releaseDate")**2

            tempObj['similarity'] = tempSum

            // append obj to array
            tempSimilarityArr.push(tempObj)
        }

        tempSimilarityArr = tempSimilarityArr.sort((a, b) => a.similarity - b.similarity)

        // use uniform dist for determining similarity percentage
        // get top 3 songs
        let similarSongs = []
        for (let i = 0; i < 3; i++) {
            let tempObj = tempSimilarityArr[i]
            tempObj['similarityScore'] = (6 - tempObj['similarity']) / 6 * 100
            console.log(tempObj['similarityScore'])

            similarSongs.push(tempObj)
        }

        let topSong = similarSongs[0]
        let secondarySongsArr = similarSongs.slice(1, similarSongs.length)

        console.log(secondarySongsArr)

        let panel = document.getElementById("diy-song-output-container")

        panel.innerHTML = `
            <div class="diy-panel-songPicture justify-content-center">
                <h2>Your song is most similar to...</h2>
                <img src=${topSong['track']['ImageURL']}>
                <div class="top-song-title-artist">
                    <div>
                        <h3>${topSong['track']['Title']}</h3>
                        <h4>${topSong['track']['Artist']}</h4>
                    </div>
                    <div class="histogram-panel-playButton">
                        <a href="${topSong['track']['SpotifyURL']}"><img src="assets/svg/play.png"></a>
                    </div>
                </div>
                <div class="top-song-description">
                    ${parseFloat(topSong['similarityScore']).toFixed(2) + '%'} similar &middot; Top 100 in ${topSong['track']['TopYear']}
                </div>
            </div>
            <div class="histogram-panel-songContainer">
                <div class="panel-subheader">The next two most similar songs are...</div>
                <div class="histogram-panel-songItem">
                    <div class="histogram-panel-songContent">
                        <img class="histogram-panel-songImage" src="${secondarySongsArr[0]['track']['ImageURL']}">
                        <div class="histogram-panel-songText">
                            <h3 class="histogram-panel-songTitle">${secondarySongsArr[0]['track']['Title']}</h3>
                            <p class="histogram-panel-songArtist">${secondarySongsArr[0]['track']['Artist']}</p>
                            
                        </div>
                    </div>
                    <div>
                        <div class="histogram-panel-playButton">
                            <a href="${secondarySongsArr[0]['track']['SpotifyURL']}"><img src="assets/svg/play.png"></a>
                        </div>
                    </div>  
                </div>
                <div>
                    <p class="histogram-panel-songTopYear">${parseFloat(secondarySongsArr[0]['similarityScore']).toFixed(2) + '%'} similar &middot; Top 100 in ${secondarySongsArr[0]['track']['TopYear']}</p>
                </div>
            </div>
            <div class="histogram-panel-songContainer">
                <div class="histogram-panel-songItem">
                    <div class="histogram-panel-songContent">
                        <img class="histogram-panel-songImage" src="${secondarySongsArr[1]['track']['ImageURL']}">
                        <div class="histogram-panel-songText">
                            <h3 class="histogram-panel-songTitle">${secondarySongsArr[1]['track']['Title']}</h3>
                            <p class="histogram-panel-songArtist">${secondarySongsArr[1]['track']['Artist']}</p>
                            
                        </div>
                    </div>
                    <div>
                        <div class="histogram-panel-playButton">
                            <a href="${secondarySongsArr[1]['track']['SpotifyURL']}"><img src="assets/svg/play.png"></a>
                        </div>
                    </div>  
                </div>
                <div>
                    <p class="histogram-panel-songTopYear">${parseFloat(secondarySongsArr[1]['similarityScore']).toFixed(2) + '%'} similar &middot; Top 100 in ${secondarySongsArr[1]['track']['TopYear']}</p>
                </div>
            </div>
           `
     }
}