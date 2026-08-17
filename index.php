<!DOCTYPE html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Spotify Style MP3 Player</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="assets/css/style.css" />
  </head>
  <body>
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="logo">◉</div>
          <span>Spotify</span>
        </div>

        <nav class="nav">
          <a class="active" href="#">Home</a>
          <a href="#">Search</a>
          <a href="#">Your Library</a>
        </nav>

        <div class="playlist-box">
          <h3>Playlists</h3>
          <ul>
            <li>Liked Songs</li>
            <li>Chill Mix</li>
            <li>Night Drive</li>
          </ul>
        </div>

        <div class="library-panel">
          <h3>Liked Songs</h3>
          <div id="liked-songs" class="mini-list"></div>
        </div>

        <div class="queue-panel">
          <h3>Queue</h3>
          <div id="queue-list" class="mini-list"></div>
        </div>

        <div class="add-track-box">
          <button id="show-form-btn" class="add-track-btn">+ Add Song</button>
          <form id="track-form" class="track-form hidden">
            <input type="text" id="input-title" placeholder="Song title" required />
            <input type="text" id="input-artist" placeholder="Artist" required />
            <input type="text" id="input-album" placeholder="Album" required />
            <input type="text" id="input-duration" placeholder="Duration (e.g. 3:42)" required />
            <input type="url" id="input-cover" placeholder="Cover image URL" required />
            <input type="url" id="input-src" placeholder="MP3 URL" required />
            <button type="submit">Save</button>
          </form>
        </div>
      </aside>

      <main class="main-panel">
        <header class="topbar">
          <div class="nav-arrows">
            <button id="sidebar-toggle" class="sidebar-toggle" aria-label="Collapse sidebar" type="button">‹</button>
            <button id="screen-toggle" class="screen-toggle" aria-label="Close screen" type="button">✕</button>
            <button aria-label="Back">‹</button>
            <button aria-label="Forward">›</button>
          </div>
          <div class="search-box">
            <span>⌕</span>
            <input id="search-input" type="text" placeholder="Search songs, artist, album" />
            <button id="search-btn" class="search-btn" type="button">Search</button>
          </div>
          <div class="user-pill">Kampanart</div>
        </header>

        <section class="hero">
          <div class="hero-cover">
            <img id="hero-cover" src="" alt="Current track cover" />
          </div>
          <div class="hero-copy">
            <span class="eyebrow">Playlist</span>
            <h1 id="hero-title">Loading...</h1>
            <p id="hero-meta">Please wait</p>
          </div>
        </section>

        <section class="track-list-wrap">
          <div class="list-header">
            <span>#</span>
            <span>Title</span>
            <span>Artist</span>
            <span>Duration</span>
          </div>
          <div id="playlist" class="track-list"></div>
        </section>

        <section class="youtube-results-wrap">
          <div class="section-header">
            <h3>Search from YouTube</h3>
          </div>
          <div id="youtube-results" class="youtube-results"></div>
        </section>

        <section id="youtube-player-wrap" class="youtube-player-wrap hidden">
          <iframe id="youtube-player" src="" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </section>
      </main>
    </div>

    <footer class="player-bar">
      <div class="now-playing">
        <img id="player-cover" src="" alt="Album art" />
        <div>
          <strong id="player-title">Select a song</strong>
          <small id="player-artist">Artist</small>
        </div>
      </div>

      <div class="controls-wrap">
        <div class="controls">
          <button class="icon-btn" id="prev-btn" aria-label="Previous">⏮</button>
          <button class="play-btn" id="play-btn" aria-label="Play">▶</button>
          <button class="icon-btn" id="next-btn" aria-label="Next">⏭</button>
        </div>

        <div class="progress-wrap">
          <span id="current-time">0:00</span>
          <div class="progress-bar">
            <div id="progress-fill" class="progress-fill"></div>
          </div>
          <span id="total-time">0:00</span>
        </div>
      </div>

      <div class="volume-box">
        <span>🔊</span>
        <input type="range" min="0" max="1" step="0.01" value="0.75" id="volume" />
      </div>
    </footer>

    <audio id="audio" preload="metadata"></audio>

    <script src="assets/js/app.js"></script>
  </body>
</html>
