function initDayCounter() {
  const numberEl = document.querySelector('.day-counter-number');
  const labelEl = document.querySelector('.day-counter-label');
  if (!numberEl) return;

  const start = new Date('2024-06-03T20:00:00');

  function updateCounter() {
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    numberEl.textContent = String(days);
  }

  updateCounter();
  setInterval(updateCounter, 1000);

  if (labelEl) {
    labelEl.textContent = 'days since June 3, 2024 · 8:00 PM';
  }
}

function initCassettePlayer() {
  const player = document.querySelector('.cassette-player');
  if (!player) return;

  const playBtn = player.querySelector('.play-btn');
  const prevBtn = player.querySelector('.prev-btn');
  const nextBtn = player.querySelector('.next-btn');
  const display = player.querySelector('.lcd-text');
  const audio = document.querySelector('#player-audio');
  const playlistItems = Array.from(document.querySelectorAll('.playlist li'));

  if (!playBtn || !prevBtn || !nextBtn || !display || playlistItems.length === 0) {
    return;
  }

  let currentIndex = 0;
  let isPlaying = false;

  function updateDisplayFromIndex(index) {
    const activeItem = playlistItems[index];
    const titleSpan = activeItem.querySelector('.track-title');
    const artistSpan = activeItem.querySelector('.track-artist');

    const titleText = titleSpan ? titleSpan.textContent.trim() : '';
    const artistText = artistSpan ? artistSpan.textContent.trim() : '';

    const text =
      titleText || artistText
        ? `${titleText}${artistText ? ' — ' + artistText : ''}`
        : 'Add your favourite 90s love songs';

    display.textContent = text || 'Add your favourite 90s love songs';
  }

  function setActive(index, autoPlay = false) {
    currentIndex = index;
    playlistItems.forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });

    updateDisplayFromIndex(currentIndex);

    if (!audio) return;

    const src = playlistItems[currentIndex].getAttribute('data-src') || '';

    if (src) {
      if (audio.src !== src) {
        audio.src = src;
      }

      if (autoPlay || isPlaying) {
        isPlaying = true;
        player.classList.add('playing');
        playBtn.textContent = 'Pause';
        audio
          .play()
          .catch(() => {
            // ignore play errors (e.g. autoplay restrictions)
          });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  function togglePlay() {
    if (!audio) {
      isPlaying = !isPlaying;
      player.classList.toggle('playing', isPlaying);
      playBtn.textContent = isPlaying ? 'Pause' : 'Play';
      return;
    }

    const src = playlistItems[currentIndex].getAttribute('data-src') || '';

    if (!isPlaying) {
      if (src) {
        if (!audio.src) {
          audio.src = src;
        }
        audio
          .play()
          .then(() => {
            isPlaying = true;
            player.classList.add('playing');
            playBtn.textContent = 'Pause';
          })
          .catch(() => {
            // user gesture required; do nothing special
          });
      }
    } else {
      audio.pause();
      isPlaying = false;
      player.classList.remove('playing');
      playBtn.textContent = 'Play';
    }
  }

  playBtn.addEventListener('click', () => {
    togglePlay();
  });

  prevBtn.addEventListener('click', () => {
    const nextIndex =
      (currentIndex - 1 + playlistItems.length) % playlistItems.length;
    setActive(nextIndex, isPlaying);
  });

  nextBtn.addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % playlistItems.length;
    setActive(nextIndex, isPlaying);
  });

  playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      setActive(index, true);
    });
  });

  if (audio) {
    audio.addEventListener('ended', () => {
      const nextIndex = (currentIndex + 1) % playlistItems.length;
      setActive(nextIndex, true);
    });
  }

  setActive(0);
}

document.addEventListener('DOMContentLoaded', () => {
  initDayCounter();
  initCassettePlayer();
});

