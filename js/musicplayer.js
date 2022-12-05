// ADAPTED from https://codepen.io/JavaScriptJunkie/pen/qBWrRyg
// Credit:  Mini Music Player - Muhammed Erdem, ADAPTATION by JuHye Mun

/*
design by Voicu Apostol.
design: https://dribbble.com/shots/3533847-Mini-Music-Player
I can't find any open music api or mp3 api so i have to download all musics as mp3 file.
You can fork on github: https://github.com/muhammederdem/mini-player
*/

console.log("musicplayer enter")

new Vue({
    el: "#app",
    data() {
      return {
        audio: null,
        circleLeft: null,
        barWidth: null,
        duration: null,
        currentTime: null,
        isTimerPlaying: false,
        // CHANGE TO #1 SONG PER YEAR
        tracks: [
          {
            name: "drivers license",
            artist: "Olivia Rodrigo",
            cover: "https://m.media-amazon.com/images/I/41GOpp3tSJL._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/driverslicense.mp3",
            url: "https://youtu.be/ZmDBbnmKpqQ",
            year: "2021",
            favorited: false,
            genre: "Pop",
						danceability: "0.561",
						energy: "0.431"
          },
          {
            name: "Blinding Lights",
            artist: "The Weeknd",
            cover: "https://m.media-amazon.com/images/I/41t3sP+X6nL._UXNaN_FMwebp_QL85_.jpg",
            source: "assets/mp3/BlindingLights.mp3",
            url: "https://youtu.be/4NRXx6U8ABQ",
            year: "2020",
            favorited: false,
            genre: "Canadian Contemporary R&B",
						danceability: "0.514",
						energy: "0.73"
          },
          {
            name: "Señorita",
            artist: "Shawn Mendes & Camila Cabello",
            cover: "https://m.media-amazon.com/images/I/51r4sILyMML._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/Senorita.mp3",
            url: "https://youtu.be/Pkh8UtuejGw",
            year: "2019",
            favorited: false,
            genre: "Canadian Pop",
						danceability: "0.759",
						energy: "0.548"
          },
          {
            name: "God's Plan",
            artist: "Drake",
            cover: "https://m.media-amazon.com/images/I/51yTr7RZK6L._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/GodsPlan.mp3",
            url: "https://youtu.be/xpVfcZ0ZcFM",
            year: "2018",
            favorited: false,
            genre: "Canadian Hip Hop",
						danceability: "0.754",
						energy: "0.449"
          },
          {
            name: "Shape of You",
            artist: "Ed Sheeran",
            cover: "https://m.media-amazon.com/images/I/61fPYcsUGRL._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/ShapeofYou.mp3",
            url: "https://youtu.be/JGwWNGJdvx8",
            year: "2017",
            favorited: false,
            genre: "Pop",
						danceability: "0.825",
						energy: "0.652"
          },
          {
            name: "One Dance",
            artist: "Drake",
            cover: "https://m.media-amazon.com/images/I/41xGePdQITL._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/OneDance.mp3",
            url: "https://youtu.be/qL7zrWcv6XY",
            year: "2016",
            favorited: false,
            genre: "Canadian Hip Hop",
						danceability: "0.792",
						energy: "0.625"
          },
          {
            name: "Lean On",
            artist: "Major Lazer",
            cover: "https://m.media-amazon.com/images/I/51Eh7q-8ucL._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/LeanOn.mp3",
            url: "https://youtu.be/YqeW9_5kURI",
            year: "2015",
            favorited: false,
            genre: "Dance Pop",
						danceability: "0.723",
						energy: "0.809"
          },
          {
            name: "Happy",
            artist: "Pharrell Williams",
            cover: "https://m.media-amazon.com/images/I/51ZDwgg4HFL._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/Happy.mp3",
            url: "https://youtu.be/ZbZSe6N_BXs",
            year: "2014",
            favorited: false,
            genre: "Hip Hop",
						danceability: "0.647",
						energy: "0.822"
          },
          {
            name: "Can't Hold Us",
            artist: "Macklemore & Ryan Lewis",
            cover: "https://m.media-amazon.com/images/I/51-mkLBVPoL._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/CantHoldUs.mp3",
            url: "https://youtu.be/2zNSgSzhBfM",
            year: "2013",
            favorited: false,
            genre: "Dance Pop",
						danceability: "0.641",
						energy: "0.922"
          },
          {
            name: "Somebody That I Used to Know",
            artist: "Gotye",
            cover: "https://m.media-amazon.com/images/I/51IFGiApz8L._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/SomebodyThatIUsedToKnow.mp3",
            url: "https://youtu.be/8UVNT4wvIGY",
            year: "2012",
            favorited: false,
            genre: "Australian Pop",
						danceability: "0.864",
						energy: "0.495"
          },
          {
            name: "Pumped Up Kicks",
            artist: "Foster The People",
            cover: "https://m.media-amazon.com/images/I/615V+KPyhiL._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/PumpedUpKicks.mp3",
            url: "https://youtu.be/SDTZ7iX4vTQ",
            year: "2011",
            favorited: false,
            genre: "Indietronica",
						danceability: "0.733",
						energy: "0.71"
          },
          {
            name: "TiK ToK",
            artist: "Kesha",
            cover: "https://m.media-amazon.com/images/I/61bqP3BMkUL._UX500_FMwebp_QL85_.jpg",
            source: "assets/mp3/TiKToK.mp3",
            url: "https://youtu.be/iP6XpLQM2Cs",
            year: "2010",
            favorited: false,
            genre: "Dance Pop",
						danceability: "0.755",
						energy: "0.837"
          }
        ],
        currentTrack: null,
        currentTrackIndex: 0,
        transitionName: null
      };
    },
    methods: {
      play() {
        if (this.audio.paused) {
          this.audio.play();
          this.isTimerPlaying = true;
        } else {
          this.audio.pause();
          this.isTimerPlaying = false;
        }
      },
      generateTime() {
        let width = (100 / this.audio.duration) * this.audio.currentTime;
        this.barWidth = width + "%";
        this.circleLeft = width + "%";
        let durmin = Math.floor(this.audio.duration / 60);
        let dursec = Math.floor(this.audio.duration - durmin * 60);
        let curmin = Math.floor(this.audio.currentTime / 60);
        let cursec = Math.floor(this.audio.currentTime - curmin * 60);
        if (durmin < 10) {
          durmin = "0" + durmin;
        }
        if (dursec < 10) {
          dursec = "0" + dursec;
        }
        if (curmin < 10) {
          curmin = "0" + curmin;
        }
        if (cursec < 10) {
          cursec = "0" + cursec;
        }
        this.duration = durmin + ":" + dursec;
        this.currentTime = curmin + ":" + cursec;
      },
      updateBar(x) {
        let progress = this.$refs.progress1;
        let maxduration = this.audio.duration;
        let position = x - progress1.offsetLeft;
        let percentage = (100 * position) / progress1.offsetWidth;
        if (percentage > 100) {
          percentage = 100;
        }
        if (percentage < 0) {
          percentage = 0;
        }
        this.barWidth = percentage + "%";
        this.circleLeft = percentage + "%";
        this.audio.currentTime = (maxduration * percentage) / 100;
        this.audio.play();
      },
      clickProgress(e) {
        this.isTimerPlaying = true;
        this.audio.pause();
        this.updateBar(e.pageX);
      },
      prevTrack() {
        this.transitionName = "scale-in";
        this.isShowCover = false;
        if (this.currentTrackIndex > 0) {
          this.currentTrackIndex--;
        } else {
          this.currentTrackIndex = this.tracks.length - 1;
        }
        this.currentTrack = this.tracks[this.currentTrackIndex];
        this.resetPlayer();
      },
      nextTrack() {
        this.transitionName = "scale-out";
        this.isShowCover = false;
        if (this.currentTrackIndex < this.tracks.length - 1) {
          this.currentTrackIndex++;
        } else {
          this.currentTrackIndex = 0;
        }
        this.currentTrack = this.tracks[this.currentTrackIndex];
        this.resetPlayer();
      },
      resetPlayer() {
        this.barWidth = 0;
        this.circleLeft = 0;
        this.audio.currentTime = 0;
        this.audio.src = this.currentTrack.source;
        setTimeout(() => {
          if(this.isTimerPlaying) {
            this.audio.play();
          } else {
            this.audio.pause();
          }
        }, 300);
      },
      favorite() {
        this.tracks[this.currentTrackIndex].favorited = !this.tracks[
          this.currentTrackIndex
        ].favorited;
      }
    },
    created() {
      let vm = this;
      this.currentTrack = this.tracks[0];
      this.audio = new Audio();
      this.audio.src = this.currentTrack.source;
      this.audio.ontimeupdate = function() {
        vm.generateTime();
      };
      this.audio.onloadedmetadata = function() {
        vm.generateTime();
      };
      this.audio.onended = function() {
        vm.nextTrack();
        this.isTimerPlaying = true;
      };
  
      // this is optional (for preload covers)
      for (let index = 0; index < this.tracks.length; index++) {
        const element = this.tracks[index];
        let link = document.createElement('link');
        link.rel = "prefetch";
        link.href = element.cover;
        link.as = "image"
        document.head.appendChild(link)
      }
    }
  });
  
  console.log("musicplayer")