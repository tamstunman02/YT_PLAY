const audio = document.getElementById('audio');
const playlistEl = document.getElementById('playlist');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeEl = document.getElementById('volume');
const progressFill = document.getElementById('progress-fill');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerCover = document.getElementById('player-cover');
const heroTitle = document.getElementById('hero-title');
const heroMeta = document.getElementById('hero-meta');
const heroCover = document.getElementById('hero-cover');
const showFormBtn = document.getElementById('show-form-btn');
const trackForm = document.getElementById('track-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const likedSongsEl = document.getElementById('liked-songs');
const queueListEl = document.getElementById('queue-list');
const youtubeResultsEl = document.getElementById('youtube-results');
const youtubePlayerWrap = document.getElementById('youtube-player-wrap');
const youtubePlayer = document.getElementById('youtube-player');

let tracks = [];
let currentIndex = 0;
let likedIds = [];
let queue = [];

async function savePlaylist() {
  const response = await fetch('api/playlist.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tracks })
  });

  if (!response.ok) {
    throw new Error('Failed to save playlist');
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function getTrackById(trackId) {
  return tracks.find((track) => String(track.id) === String(trackId));
}

function getLikedState(trackId) {
  return likedIds.includes(String(trackId));
}

async function loadFavorites() {
  try {
    const response = await fetch('api/favorites.php');
    const data = await response.json();
    likedIds = Array.isArray(data.liked) ? data.liked.map(String) : [];
  } catch (error) {
    const saved = JSON.parse(localStorage.getItem('likedSongs') || '[]');
    likedIds = saved.map(String);
  }

  localStorage.setItem('likedSongs', JSON.stringify(likedIds));
  renderLikedSongs();
}

async function saveFavorites() {
  const payload = { liked: likedIds.map(String) };
  try {
    await fetch('api/favorites.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    localStorage.setItem('likedSongs', JSON.stringify(payload.liked));
  }
}

function renderLikedSongs() {
  if (!likedIds.length) {
    likedSongsEl.innerHTML = '<div class="mini-item">No liked songs yet</div>';
    return;
  }

  likedSongsEl.innerHTML = likedIds
    .map((trackId) => {
      const track = getTrackById(trackId);
      if (!track) return '';
      return `
        <div class="mini-item" data-liked-track="${track.id}">
          <div>
            <strong>${track.title}</strong>
            <small>${track.artist}</small>
          </div>
          <span>♥</span>
        </div>
      `;
    })
    .join('');

  likedSongsEl.querySelectorAll('[data-liked-track]').forEach((item) => {
    item.addEventListener('click', () => {
      const trackId = Number(item.dataset.likedTrack);
      const index = tracks.findIndex((track) => String(track.id) === String(trackId));
      if (index >= 0) {
        loadTrack(index, true);
      }
    });
  });
}

function renderQueue() {
  if (!queue.length) {
    queueListEl.innerHTML = '<div class="mini-item">Queue is empty</div>';
    return;
  }

  queueListEl.innerHTML = queue
    .map((trackId) => {
      const track = getTrackById(trackId);
      if (!track) return '';
      return `
        <div class="mini-item" data-queue-track="${track.id}">
          <div>
            <strong>${track.title}</strong>
            <small>${track.artist}</small>
          </div>
          <span>⏭</span>
        </div>
      `;
    })
    .join('');

  queueListEl.querySelectorAll('[data-queue-track]').forEach((item) => {
    item.addEventListener('click', () => {
      const trackId = Number(item.dataset.queueTrack);
      const index = tracks.findIndex((track) => String(track.id) === String(trackId));
      if (index >= 0) {
        loadTrack(index, true);
      }
    });
  });
}

function renderPlaylist() {
  const keyword = searchInput.value.trim().toLowerCase();
  const visibleTracks = keyword
    ? tracks.filter((track) => {
        const haystack = `${track.title} ${track.artist} ${track.album}`.toLowerCase();
        return haystack.includes(keyword);
      })
    : tracks;

  if (!visibleTracks.length) {
    playlistEl.innerHTML = '<p style="padding: 20px; color: #b3b3b3;">No matching songs found.</p>';
    return;
  }

  playlistEl.innerHTML = visibleTracks
    .map((track) => {
      const trackIndex = tracks.findIndex((item) => String(item.id) === String(track.id));
      return `
        <div class="track-row ${trackIndex === currentIndex ? 'active' : ''}" data-index="${trackIndex}">
          <span class="track-index">${trackIndex + 1}</span>
          <div class="track-main">
            <img src="${track.cover}" alt="${track.title}" />
            <div>
              <div class="track-title">${track.title}</div>
            </div>
          </div>
          <span class="track-artist">${track.artist}</span>
          <span class="track-duration">${track.duration}</span>
          <div class="track-actions">
            <button class="like-btn ${getLikedState(track.id) ? 'liked' : ''}" data-like-id="${track.id}" aria-label="Like song">♥</button>
            <button class="queue-btn" data-queue-id="${track.id}" aria-label="Add to queue">＋</button>
          </div>
        </div>
      `;
    })
    .join('');

  document.querySelectorAll('.track-row').forEach((row) => {
    row.addEventListener('click', (event) => {
      if (event.target.closest('.like-btn') || event.target.closest('.queue-btn')) {
        return;
      }

      currentIndex = Number(row.dataset.index);
      loadTrack(currentIndex, true);
    });
  });

  document.querySelectorAll('.like-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const trackId = Number(button.dataset.likeId);
      toggleLike(trackId);
    });
  });

  document.querySelectorAll('.queue-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const trackId = Number(button.dataset.queueId);
      addToQueue(trackId);
    });
  });
}

function updateNowPlaying() {
  const track = tracks[currentIndex];
  if (!track) return;

  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;
  playerCover.src = track.cover;
  heroTitle.textContent = track.title;
  heroMeta.textContent = `${track.artist} • ${track.album}`;
  heroCover.src = track.cover;
  document.title = `${track.title} • ${track.artist}`;
}

function toggleLike(trackId) {
  const id = String(trackId);
  if (likedIds.includes(id)) {
    likedIds = likedIds.filter((item) => item !== id);
  } else {
    likedIds.push(id);
  }

  saveFavorites();
  renderLikedSongs();
  renderPlaylist();
}

function addToQueue(trackId) {
  const id = String(trackId);
  if (!queue.includes(id)) {
    queue.push(id);
  }
  renderQueue();
}

function playSongById(trackId, autoplay = true) {
  const index = tracks.findIndex((track) => String(track.id) === String(trackId));
  if (index >= 0) {
    loadTrack(index, autoplay);
  }
}

function loadTrack(index, autoplay = false) {
  if (!tracks[index]) return;

  currentIndex = index;
  const track = tracks[index];
  audio.src = track.src;
  audio.load();
  updateNowPlaying();
  renderPlaylist();

  if (autoplay) {
    audio.play();
    playBtn.textContent = '❚❚';
  } else {
    playBtn.textContent = '▶';
  }
}

async function loadPlaylist() {
  try {
    const response = await fetch('api/playlist.php');
    const data = await response.json();
    tracks = data.tracks || [];

    if (!tracks.length) {
      playlistEl.innerHTML = '<p style="padding: 20px; color: #b3b3b3;">No songs found.</p>';
      return;
    }

    queue = tracks.map((track) => String(track.id));
    renderQueue();
    renderPlaylist();
    loadTrack(0, false);
    totalTimeEl.textContent = tracks[0].duration;
  } catch (error) {
    console.error('Failed to load playlist:', error);
    playlistEl.innerHTML = '<p style="padding: 20px; color: #ff9a9a;">Unable to load playlist.</p>';
  }
}

showFormBtn.addEventListener('click', () => {
  trackForm.classList.toggle('hidden');
});

trackForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const newTrack = {
    id: Date.now(),
    title: document.getElementById('input-title').value.trim(),
    artist: document.getElementById('input-artist').value.trim(),
    album: document.getElementById('input-album').value.trim(),
    duration: document.getElementById('input-duration').value.trim(),
    cover: document.getElementById('input-cover').value.trim(),
    src: document.getElementById('input-src').value.trim()
  };

  if (!newTrack.title || !newTrack.artist || !newTrack.album || !newTrack.duration || !newTrack.cover || !newTrack.src) {
    alert('กรอกข้อมูลให้ครบทุกช่อง');
    return;
  }

  tracks.push(newTrack);
  try {
    await savePlaylist();
    renderPlaylist();
    currentIndex = tracks.length - 1;
    loadTrack(currentIndex, true);
    trackForm.reset();
    trackForm.classList.add('hidden');
  } catch (error) {
    console.error(error);
    alert('บันทึก playlist ไม่สำเร็จ');
    tracks.pop();
  }
});

playBtn.addEventListener('click', async () => {
  if (!tracks.length) return;

  if (audio.paused) {
    await audio.play();
    playBtn.textContent = '❚❚';
  } else {
    audio.pause();
    playBtn.textContent = '▶';
  }
});

prevBtn.addEventListener('click', () => {
  if (!tracks.length) return;
  const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(prevIndex, true);
});

nextBtn.addEventListener('click', () => {
  if (!tracks.length) return;

  if (queue.length) {
    const nextId = queue.shift();
    renderQueue();
    if (nextId) {
      playSongById(nextId, true);
      return;
    }
  }

  const nextIndex = (currentIndex + 1) % tracks.length;
  loadTrack(nextIndex, true);
});

volumeEl.addEventListener('input', (event) => {
  audio.volume = Number(event.target.value);
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  if (queue.length) {
    const nextId = queue.shift();
    renderQueue();
    if (nextId) {
      playSongById(nextId, true);
      return;
    }
  }

  const nextIndex = (currentIndex + 1) % tracks.length;
  loadTrack(nextIndex, true);
});

searchInput.addEventListener('input', () => {
  renderPlaylist();
});

searchBtn.addEventListener('click', async () => {
  const keyword = searchInput.value.trim();
  if (!keyword) {
    return;
  }
  await searchYoutube(keyword);
});

searchInput.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const keyword = searchInput.value.trim();
    if (!keyword) {
      return;
    }
    await searchYoutube(keyword);
  }
});

async function searchYoutube(keyword) {
  try {
    const response = await fetch(`api/youtube-search.php?q=${encodeURIComponent(keyword)}`);
    const data = await response.json();

    if (!data.items || !data.items.length) {
      youtubeResultsEl.innerHTML = '<p style="padding: 12px; color: #b3b3b3;">No results found.</p>';
      return;
    }

    youtubeResultsEl.innerHTML = data.items
      .map((item) => `
        <div class="youtube-card" data-video-id="${item.videoId}">
          <img src="${item.thumbnail}" alt="${item.title}" />
          <div class="youtube-card-body">
            <h4>${item.title}</h4>
            <p>${item.channel}</p>
          </div>
        </div>
      `)
      .join('');

    youtubeResultsEl.querySelectorAll('.youtube-card').forEach((card) => {
      card.addEventListener('click', () => {
        const videoId = card.dataset.videoId;
        youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        youtubePlayerWrap.classList.remove('hidden');
      });
    });
  } catch (error) {
    console.error('YouTube search failed:', error);
    youtubeResultsEl.innerHTML = '<p style="padding: 12px; color: #ff9a9a;">Unable to search YouTube right now.</p>';
  }
}

audio.volume = 0.75;

loadFavorites();
loadPlaylist();
