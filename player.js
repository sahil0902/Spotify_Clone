// Create a class to handle the music player
class MusicPlayer {
    constructor() {
        // Initialize the DOM elements
        this.playButton = document.querySelector("#play");
        this.pauseButton = document.querySelector("#pause");
        this.forwardButton = document.querySelector("#fd");
        this.reverseButton = document.querySelector("#rd")
        this.rangeInput = document.querySelector("#vol");
        this.durationInput = document.querySelector(".progress-bar");
        this.currentTimeElement = document.querySelector(".curr-time");
        this.totalTimeElement = document.querySelector(".tot-time");
        this.singer = document.querySelector("#singer");
        this.songName = document.querySelector("#song");
        this.cover = document.querySelector("#cover");
        let back = document.querySelector("#backout");
        back.onclick = function() {
            console.log("ss");
            let b = document.querySelector(".back");
            b.style.bottom = '0';
        
            setTimeout(()=>{
                window.location.href = 'index.html';
            },500)
        }
        // Define the songs array
        this.songs = [
            {
                singer: "Falak Shabir",
                title: "Ijazat",
                path: "./songs/song.mp3",
                cover: "./assets/ijazat.jpeg",
                pic : "./assets/falakshabir.jpg"
            },
            {
                singer : "Karan Aujla",
                title: "Softly",
                path: "./songs/s2.mp3",
                cover: "./assets/softly.jpeg",
                pic : "./assets/KaranAujla.jpg"
            },
            {
                singer : "Shubh",
                title: "King Shit",
                path: "./songs/KingShit.mp3",
                cover: "./assets/shubh.jpg",
                pic : "./assets/shubhpic.jpg"
            }
        ];

        // Set the initial song index and create an Audio object for the current song
        this.currentSongIndex = 0;
        this.currentSong = new Audio(this.songs[this.currentSongIndex].path);
        console.log(this.currentSong)
    }

    // Play the current song
    play() {
        return new Promise((resolve, reject) => {
            this.currentSong.play()
                .then(() => {
                    // Update cover
                    this.cover.src = this.songs[this.currentSongIndex].cover;
                    
                    this.singer.innerHTML = this.songs[this.currentSongIndex].singer;
                    
                    // Change its title too
                    this.songName.innerHTML = this.songs[this.currentSongIndex].title;
                  
    
                    // Change the background image
                    document.documentElement.style.setProperty('--bg-image', `url(${this.songs[this.currentSongIndex].pic})`);
           
                    this.playButton.style.display = "none";
                    this.pauseButton.style.display = "block";
    
                    resolve();
                }).then(() => {
                    let cov =  this.cover.src
                    applyAnimation(cov,'forwards');
                    })
                   
        });
    }
    // Pause the current song
    async pause() {
        try {
            this.currentSong.pause();
          
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
            await this.play().then(() => {
                applyAnimation(cov,'forwards');
                console.log("calling");
            });
        } catch (error) {
            console.error("Failed to forward the song:", error);
        }
    }
     // go to the prev song
     async reverse() {
        ///only if there's at least one song 
         if (this.currentSongIndex >0) {
    
            try {
                // Check if there is at least one song in the playlist
               
                // Pause the current song and remove the timeupdate event listener
                this.currentSong.pause();
                 this.cover.src = '';
                 this.currentSong.removeEventListener("timeupdate", () => this.updateProgress());
    
    
                // Update the current song index and create a new Audio object for the next song
                this.currentSongIndex = (this.currentSongIndex - 1) % this.songs.length;
               this.currentSong = new Audio(this.songs[this.currentSongIndex].path);
    
                // Add a loadedmetadata event listener to update the progress and re-add the timeupdate event listener
                this.currentSong.addEventListener("loadedmetadata", () => {
                    this.updateProgress();
                    this.currentSong.addEventListener("timeupdate", () => this.updateProgress());
                });
    
                // Play the next song
                await this.play().then(()=>{
                    applyAnimation(cov,'reverse');
                });
            } catch (error) {
                console.error("Failed to forward the song:", error);
            }
            }
            else{
                //if first set its to 0
                this.currentSong.currentTime = 0;
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
        this.reverseButton.addEventListener("click",()=> this.reverse());
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

function applyAnimation(cov, direction = 'forwards') {
    // Start with the original cover
    this.cover.src = cov;

    // Apply a CSS transition to the cover's opacity
    this.cover.style.transition = 'opacity 1s ease-in-out';
    this.cover.style.opacity = 1;

    setTimeout(() => {
        try {
            console.log("fade in calling");
            // Add an animation to the singer element
            this.singer.style.animation = `
                fadeIn 1s ease-in-out ${direction},
                hangingPosition 1s ease-in-out ${direction},
                changesize 1s ease-in-out ${direction}
            `;

            // Define the fadeIn keyframes
            const fadeInKeyframes = `
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
            `;

            // Define the hangingPosition keyframes
            const hangingPositionKeyframes = `
                @keyframes hangingPosition {
                    0% {
                        transform: translateX(50px);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
            `;
            const changesizeframe = `
            @keyframes changesize {
                0% {
                    font-size: 0.8rem;
                
                100%{
                    font-size:1.5rem;
                }
            }
            `;

            // Create a style element and append the keyframes to it
            const styleElement = document.createElement('style');
            styleElement.innerHTML = fadeInKeyframes + hangingPositionKeyframes + changesizeframe;
            document.head.appendChild(styleElement);

            // Fade out the cover
            this.cover.style.opacity = 0;

            // After the transition ends, remove the cover
            this.cover.addEventListener('transitionend', () => {
                this.cover.src = '';
            }, { once: true });

        } catch (e) {
            console.log("e", e);
        }

    }, 2000)
}

// Create an instance of the MusicPlayer class
const musicPlayer = new MusicPlayer();
musicPlayer.initialize();
