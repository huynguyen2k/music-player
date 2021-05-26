const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $('#play-list');
const singerName = $('#player-header .song-name');
const songImg = $('#player-header img');
const audio = $('#player-header audio');

const musicPlayerElement = $('#music-player');
const controlArea = $('#control-area');
const controlBar = $('#control-bar');
const activatedBar = $('#activated-bar');
const cdPlayer = $('#cd-player');

const playBtn = $('#play-btn');
const nextBtn = $('#next-btn');
const preBtn = $('#pre-btn');
const shuffleBtn = $('#shuffle-btn');
const repeatBtn = $('#repeat-btn');

const app = {    
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    currentIndex: 0,
    songs: [
        {
            name: 'Đông Miên',
            singer: 'Tư Nam',
            src: 'assets/music/song1.mp3',
            image: 'assets/image/song1.jpg'
        },
        {
            name: 'Thời Không Sai Lệch',
            singer: 'Ngải Thần',
            src: 'assets/music/song2.mp3',
            image: 'assets/image/song2.jpg'
        },
        {
            name: 'Đom Đóm',
            singer: 'Jack',
            src: 'assets/music/song3.mp3',
            image: 'assets/image/song3.jpg'
        },
        {
            name: 'Em Của Ngày Hôm Qua',
            singer: 'Sơn Tùng MTP',
            src: 'assets/music/song4.mp3',
            image: 'assets/image/song4.jpg'
        },
        {
            name: 'Em Không Sai Chúng Ta Sai',
            singer: 'Erik',
            src: 'assets/music/song5.mp3',
            image: 'assets/image/song5.jpg'
        },
        {
            name: 'Nhất Tiếu Khuynh Thành',
            singer: 'Trịnh Quốc Phong',
            src: 'assets/music/song6.mp3',
            image: 'assets/image/song6.jpg'
        },
        {
            name: 'Nơi Này Có Anh',
            singer: 'Sơn Tùng MTP',
            src: 'assets/music/song7.mp3',
            image: 'assets/image/song7.jpg'
        },
        {
            name: 'Sóng Gió',
            singer: 'Jack',
            src: 'assets/music/song8.mp3',
            image: 'assets/image/song8.jpg'
        }
    ],
    playedSongsIndex: [],

    initPlayedSongsIndex() {
        let length = this.songs.length;

        for (let i = 0; i < length; i++) {
            this.playedSongsIndex.push(i);
        }
    },

    renderSongs() {
        let songsAsHTML = this.songs.map((song, index) => {
            return `
            <div class="song" song-index="${index}">
                <div class="song__img">
                    <img src="${song.image}" alt="${song.name}">
                </div>
                <div class="song__info">
                    <h3 class="song-name">${song.name}</h3>
                    <p class="singer-name">${song.singer}</p>
                </div>
            </div>
            `;
        });

        $('#play-list').innerHTML = songsAsHTML.join('');      
    },

    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            }
        });
    },

    loadCurrentSong() {
        let playedSong = playList.querySelector('.song--active');
        let currentSong = playList.querySelector(`.song[song-index="${this.currentIndex}"]`);

        if (playedSong != null) {
            playedSong.classList.remove('song--active');
        }

        currentSong.classList.add('song--active');
        // currentSong.scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'center'
        // });

        singerName.textContent = this.currentSong.name;
        songImg.src = this.currentSong.image;
        audio.src = this.currentSong.src;
    },

    nextSong() {
        this.currentIndex++;

        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
    },

    preSong() {
        this.currentIndex--;
        
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
    },

    shuffleSong() {
        let playedIndex = this.playedSongsIndex.indexOf(this.currentIndex);
        
        if (playedIndex >= 0) {
            this.playedSongsIndex.splice(playedIndex, 1);
        }

        if (this.playedSongsIndex.length === 0) {
            this.initPlayedSongsIndex();
        }

        let shuffleIndex = Math.floor(Math.random() * this.playedSongsIndex.length);
        this.currentIndex = this.playedSongsIndex[shuffleIndex];

    },

    handleEvents() {
        const musicPlayer = this;

        const playCD = cdPlayer.animate([
            { transform: 'rotate(0)' },
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            easing: 'linear',
            iterations: Infinity
        });
        playCD.pause();


        // musicPlayerElement.onscroll = function() {
        //     const topControlArea = controlArea.getBoundingClientRect().top;
        // }


        playBtn.onclick = function() {
            musicPlayer.isPlaying = !musicPlayer.isPlaying;
            
            if (musicPlayer.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        }

        audio.onplay = function() {
            playCD.play();
            playBtn.classList.add('playing');
        }

        audio.onpause = function() {
            playCD.pause();
            playBtn.classList.remove('playing');
        }

        audio.ontimeupdate = function() {
            let duration = audio.duration || 100;
            let progressBar = (audio.currentTime / duration * 100).toFixed(4);

            activatedBar.style.width = progressBar + '%';
        }

        audio.onended = function() {
            if (musicPlayer.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        controlBar.onclick = function(e) {
            let activatedPercent = (e.offsetX / controlBar.offsetWidth).toFixed(4);
            let currentTime = activatedPercent * audio.duration;
            
            audio.currentTime = currentTime;
        }

        preBtn.onclick = function() {
            if (musicPlayer.isShuffle) {
                musicPlayer.shuffleSong();
            } else {
                musicPlayer.preSong();
            }

            musicPlayer.loadCurrentSong();
            audio.play();
        }

        nextBtn.onclick = function() {
            if (musicPlayer.isShuffle) {
                musicPlayer.shuffleSong();
            } else {
                musicPlayer.nextSong();
            }
            
            musicPlayer.loadCurrentSong();
            audio.play();
        }

        shuffleBtn.onclick = function() {
            musicPlayer.isShuffle = !musicPlayer.isShuffle;
            shuffleBtn.classList.toggle('button--active');
        }

        repeatBtn.onclick = function() {
            musicPlayer.isRepeat = !musicPlayer.isRepeat;
            repeatBtn.classList.toggle('button--active');
        }

        playList.onclick = function(e) {
            let song = e.target.closest('.song:not(.song--active)');
            
            if (song) {
                let songIndex = song.getAttribute('song-index');

                musicPlayer.currentIndex = +songIndex;
                musicPlayer.loadCurrentSong();
                audio.play();
            }
        }
    },

    start() {
        this.defineProperties();

        this.initPlayedSongsIndex();

        this.renderSongs();

        this.loadCurrentSong();

        this.handleEvents();
    }


};

app.start();