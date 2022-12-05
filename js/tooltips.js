// helper js file
// functions to render the HTML tooltips for musical features

let tooltips = document.querySelectorAll('[data-tooltip]')

for (let i = 0; i < tooltips.length; i++) {
    let tooltip = tooltips[i]
    let parent = tooltip.parentNode
    let feature = tooltip.dataset.tooltip

    console.log(feature)

    // add tooltip div
    let tooltipDiv = document.createElement("div")
    tooltipDiv.className = "feature-tooltip-container"

    let tooltipText = document.createTextNode(getFeatureTooltip(feature))
    tooltipDiv.appendChild(tooltipText)

    // add event listener
    tooltip.addEventListener('mouseover', function() {
        parent.appendChild(tooltipDiv)
    })

    // add event listener
    tooltip.addEventListener('mouseout', function() {
        parent.removeChild(tooltipDiv)
    })
}

function getFeatureTooltip(feature) {
    console.log(feature)
    let featureDict = {
        'acousticness': 'A confidence measure from 0.0 to 1.0 of whether the track is acoustic.',
        'danceability': 'Describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.',
        'speechiness': 'This detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value.',
        'valence': 'Describes the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).',
        'duration': 'The duration of the track in seconds.',
        'energy': 'Represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale.',
        'releaseYear': 'The year that a song was released.'
    }

    let firstLetter = feature.charAt(0).toUpperCase()
    let remainingLetters = feature.substring(1)
    let properName = firstLetter + remainingLetters

    // let tooltipHTML = `
    //     <div class="feature-tooltip-container">
    //         <h2 class="feature-tooltip-header">${properName}</h2>
    //         <p class="feature-tooltip-description">${featureDict[feature]}</p>
    //     </div>
    // `
    // return tooltipHTML

    return featureDict[feature]
}