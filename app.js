// Create a class to handle the music player
class MusicPlayer {
    constructor() {
        // Initialize the DOM elements
        this.playButton = document.querySelector("#play");
        this.pauseButton = document.querySelector("#pause");
        this.forwardButton = document.querySelector("#fd");
        this.rangeInput = document.querySelector("#range");
        this.durationInput = document.querySelector(".progress-bar");
        this.currentTimeElement = document.querySelector(".curr-time");
        this.totalTimeElement = document.querySelector(".tot-time");
        this.singer = document.querySelector("#singer");
        this.songName = document.querySelector("#song");
        this.cover = document.querySelector("#cover");
        // Define the songs array
        this.songs = [
            {
                singer: "Falak Shabir",
                title: "Ijazat",
                path: "./songs/song.mp3",
                cover: "./assets/ijazat.jpeg"
            },
            {
                singer : "Karan Aujla",
                title: "Softly",
                path: "./songs/s2.mp3",
                cover: "./assets/softly.jpeg"
            }
        ];

        // Set the initial song index and create an Audio object for the current song
        this.currentSongIndex = 0;
        this.currentSong = new Audio(this.songs[this.currentSongIndex].path);
        console.log(this.currentSong)
    }

    // Play the current song
    async play() {
        try {
            await this.currentSong.play();
             
            // Update the singer's name in the HTML
            this.singer.innerHTML = this.songs[this.currentSongIndex].singer;
            this.singer.style = "display:block";
            //change its title too
            this.songName.innerHTML = this.songs[this.currentSongIndex].title;
            this.songName.style = "display:block";

            //update cover
            this.cover.src= this.songs[this.currentSongIndex].cover;
            this.cover.style = "display:block"
            this.cover.style.width = "100%";
            this.cover.style.height = "100%";
            
            this.playButton.style.display = "none";
            this.pauseButton.style.display = "block";
        } catch (error) {
            console.error("Failed to play the song:", error);
        }
    }

    // Pause the current song
    async pause() {
        try {
           await this.currentSong.pause();
            this.playButton.style.display = "block";
            this.pauseButton.style.display = "none";
        } catch (error) {
            console.error("Failed to pause the song:", error);
        }
    }

    // Skip to the next song
    async forward() {
        try {
            // Pause the current song and remove the timeupdate event listener
            this.currentSong.pause();
            this.cover.src = '';
            this.currentSong.removeEventListener("timeupdate", () => this.updateProgress());


            // Update the current song index and create a new Audio object for the next song
            this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
            this.currentSong = new Audio(this.songs[this.currentSongIndex].path);

            // Add a loadedmetadata event listener to update the progress and re-add the timeupdate event listener
            this.currentSong.addEventListener("loadedmetadata", () => {
                this.updateProgress();
                this.currentSong.addEventListener("timeupdate", () => this.updateProgress());
            });

            // Play the next song
            await this.play();
        } catch (error) {
            console.error("Failed to forward the song:", error);
        }
    }
    
    // Set the volume of the current song
    setVolume(volume) {
        this.currentSong.volume = volume;
    }

    // Set the current time of the current song
    setDuration(duration) {
        this.currentSong.currentTime = duration;
    }

    // Update the progress bar and time display
    updateProgress() {
        const currentTime = this.currentSong.currentTime;
        const totalTime = this.currentSong.duration;

        // Calculate the current time in minutes and seconds
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        this.currentTimeElement.innerHTML = `${currentMinutes < 10 ? '0' : ''}${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;

        // Calculate the total time in minutes and seconds
        const totalMinutes = Math.floor(totalTime / 60);
        const totalSeconds = Math.floor(totalTime % 60);
        this.totalTimeElement.innerHTML = `${totalMinutes < 10 ? '0' : ''}${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;

        // Calculate the progress percentage and update the duration input value
        const progress = (currentTime / totalTime) * 100;
        this.durationInput.value = progress;
    }

    // Initialize the music player by adding event listeners
    initialize() {
        this.playButton.addEventListener("click", () => this.play());
        this.pauseButton.addEventListener("click", () => this.pause());
        this.forwardButton.addEventListener("click", () => this.forward());
        this.rangeInput.addEventListener("input", () => {
            const volume = this.rangeInput.value / 100;
            this.setVolume(volume);
        });
        this.durationInput.addEventListener("input", () => {
            const duration = this.durationInput.value;
            this.setDuration(duration);
        });
        this.currentSong.addEventListener("timeupdate", () => this.updateProgress());
    }
}

// Create an instance of the MusicPlayer class
const musicPlayer = new MusicPlayer();
musicPlayer.initialize();
