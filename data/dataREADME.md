# Data Dictionary

## JJM Entertainment

*This document contains information about the data used in our visualizations.*

### The dataset we used contains every single song in the Top 100 of each year between 2010 and

\2021. Each record represents one song, and the fields contained within it are:

● Title – title of the song

● trackId – the Spotify ID associated with the song

● Popularity – a Spotify index for popularity

● Artist – artist of the song

● artistId – the Spotify ID associated with the artist

● To p Year – the year that the song was top 100 in

● Genre – the genre of the artist that released the song

● Speechiness – detects the presence of spoken words in a track. The more exclusively

speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the

attribute value

● Acousticness – a confidence measure from 0.0 to 1.0 of whether the track is acoustic

● Liveness – the probability that the song was recorded live

● Danceability – describes how suitable a track is for dancing based on a combination of

musical elements including tempo, rhythm stability, beat strength, and overall regularity.

● Energy – represents a perceptual measure of intensity and activity. Typically, energetic

tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach

prelude scores low on the scale

● Loudness – how loud the song is in decibels

● Valence – describes the musical positiveness conveyed by a track. Tracks with high

valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low

valence sound more negative (e.g. sad, depressed, angry)

● Duration – song’s duration in milliseconds

● BPM – song’s beats per minute

● ImageURL – link to the album cover associated with the song

● SpotifyURL – link to the Spotify song

● Release Date – year that the song was released

Our main dataset was all\_data.csv, and the remainder of the data was generated from this

dataset with the exception of top\_song.csv, which was manually derived from research on what

the #1 song each year was.

