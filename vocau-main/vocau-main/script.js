const userId1 = '1310932740048293929';
const osuUserId = '30451639';
const osuApiKey = 'e18da6ccb059530f523cd7f1bf4ae8d82c2eb59b';

const avatarElement1 = document.getElementById('avatar1');
const nicknameElement1 = document.getElementById('nickname-text1');
const subnickElement1 = document.getElementById('subnick1');
const nitroBadge1 = document.getElementById('nitro-badge1');
const boostBadge1 = document.getElementById('boost-badge1');
const osuAvatar = document.getElementById('osu-avatar');
const osuName = document.getElementById('osu-name');
const osuCountry = document.getElementById('osu-country');
const osuPp = document.getElementById('osu-pp');
const osuRank = document.getElementById('osu-rank');
const osuAcc = document.getElementById('osu-acc');
const osuPlays = document.getElementById('osu-plays');
const audioElement = document.getElementById('audio');
const musicPanel = document.querySelector('.music-panel');
const musicTitle = document.getElementById('music-title');
const musicArtist = document.getElementById('music-artist');
const musicCurrent = document.getElementById('music-current');
const musicDuration = document.getElementById('music-duration');
const musicSeek = document.getElementById('music-seek');
const musicPlay = document.getElementById('music-play');
const musicBack = document.getElementById('music-back');
const musicForward = document.getElementById('music-forward');
const musicVolume = document.getElementById('music-volume');

async function fetchLanyardData(userId, avatarElement, nicknameElement, subnickElement, nitroBadge, boostBadge) {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const data = await response.json();

    if (data.success) {
      const { discord_user, premium_type } = data.data;

      const nickname = discord_user.global_name || discord_user.username;
      nicknameElement.textContent = nickname;

      subnickElement.textContent = `@${discord_user.username}`;

      avatarElement.src = `https://cdn.discordapp.com/avatars/${userId}/${discord_user.avatar}.png?size=512`;

      if (premium_type === 2) {
        nitroBadge.classList.remove('hidden');
      }
      if (premium_type === 1) {
        boostBadge.classList.remove('hidden');
      }
    } else {
      nicknameElement.textContent = 'Usuário não encontrado';
      subnickElement.textContent = '';
    }
  } catch (error) {
    nicknameElement.textContent = 'Erro ao carregar';
    subnickElement.textContent = '';
  }
}

fetchLanyardData(userId1, avatarElement1, nicknameElement1, subnickElement1, nitroBadge1, boostBadge1);

function formatTime(value) {
  if (!Number.isFinite(value)) {
    return '0:00';
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updatePlayerUI() {
  if (!audioElement) {
    return;
  }
  const duration = audioElement.duration || 0;
  const current = audioElement.currentTime || 0;
  if (musicDuration) {
    musicDuration.textContent = formatTime(duration);
  }
  if (musicCurrent) {
    musicCurrent.textContent = formatTime(current);
  }
  if (musicSeek) {
    const progress = duration ? (current / duration) * 100 : 0;
    musicSeek.value = String(progress);
  }
  if (musicPlay) {
    if (audioElement.paused) {
      musicPlay.classList.remove('is-playing');
    } else {
      musicPlay.classList.add('is-playing');
    }
  }
}

if (musicPanel) {
  const title = musicPanel.dataset.title;
  const artist = musicPanel.dataset.artist;
  if (title && musicTitle) {
    musicTitle.textContent = title;
  }
  if (artist && musicArtist) {
    musicArtist.textContent = artist;
  }
}

if (audioElement) {
  audioElement.addEventListener('timeupdate', updatePlayerUI);
  audioElement.addEventListener('loadedmetadata', updatePlayerUI);
  audioElement.addEventListener('play', updatePlayerUI);
  audioElement.addEventListener('pause', updatePlayerUI);
  updatePlayerUI();
}

if (musicPlay && audioElement) {
  musicPlay.addEventListener('click', () => {
    if (audioElement.paused) {
      audioElement.play().catch(() => {});
    } else {
      audioElement.pause();
    }
  });
}

if (musicBack && audioElement) {
  musicBack.addEventListener('click', () => {
    audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
  });
}

if (musicForward && audioElement) {
  musicForward.addEventListener('click', () => {
    audioElement.currentTime = Math.min(audioElement.duration || 0, audioElement.currentTime + 10);
  });
}

if (musicSeek && audioElement) {
  musicSeek.addEventListener('input', () => {
    const duration = audioElement.duration || 0;
    audioElement.currentTime = (Number(musicSeek.value) / 100) * duration;
  });
}

if (musicVolume && audioElement) {
  musicVolume.addEventListener('input', () => {
    audioElement.volume = Number(musicVolume.value);
    if (audioElement.volume > 0) {
      audioElement.muted = false;
    }
    updatePlayerUI();
  });
}

function formatNumber(value) {
  const number = Number(value);
  if (Number.isNaN(number)) {
    return '-';
  }
  return new Intl.NumberFormat('pt-BR').format(number);
}

async function fetchOsuProfile(userId, apiKey) {
  if (!apiKey) {
    osuName.textContent = 'osu! api';
    osuCountry.textContent = 'adicione sua api key';
    return;
  }
  try {
    const response = await fetch(`https://osu.ppy.sh/api/get_user?k=${apiKey}&u=${userId}&type=id`);
    const data = await response.json();
    if (Array.isArray(data) && data[0]) {
      const profile = data[0];
      osuAvatar.src = `https://a.ppy.sh/${profile.user_id}`;
      osuName.textContent = profile.username;
      osuCountry.textContent = `${profile.country} · lvl ${Math.round(Number(profile.level) || 0)}`;
      osuPp.textContent = formatNumber(profile.pp_raw);
      osuRank.textContent = `#${formatNumber(profile.pp_rank)}`;
      osuAcc.textContent = `${Number(profile.accuracy).toFixed(2)}%`;
      osuPlays.textContent = formatNumber(profile.playcount);
    } else {
      osuName.textContent = 'perfil não encontrado';
      osuCountry.textContent = '';
    }
  } catch (error) {
    osuName.textContent = 'erro no osu!';
    osuCountry.textContent = '';
  }
}

fetchOsuProfile(osuUserId, osuApiKey);
