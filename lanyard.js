const userId = "934530409293824020";
const socket = new WebSocket("wss://api.lanyard.rest/socket");

const usernameEl = document.getElementById("username");
const customStatusEl = document.getElementById("custom-status");
const statusDot = document.getElementById("status-dot");
const avatarImg = document.getElementById("avatar");

function updateStatus(data) {
    const user = data.discord_user;
    const presence = data.discord_status;
    const activities = data.activities;
    const custom = activities.find(act => act.type === 4);
    const game = activities.find(act => act.type === 0);
    const spotify = data.spotify;

    usernameEl.textContent = `${user.username}`;
    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
    statusDot.className = "status " + presence;

    if (custom) {
        const emoji = custom.emoji ? (custom.emoji.animated ? `<img src="https://cdn.discordapp.com/emojis/${custom.emoji.id}.gif" class="emoji"> ` : `${custom.emoji.name} `) : "";
        customStatusEl.innerHTML = `${emoji}${custom.state || ''}`;
    } else {
        customStatusEl.textContent = "No custom status";
    }

    const spotifyContainer = document.getElementById("spotify-status");
    const spotifyAlbum = document.getElementById("spotify-album");
    const spotifyText = document.getElementById("spotify-text");

    if (spotify && spotifyContainer && spotifyAlbum && spotifyText) {
        spotifyAlbum.src = spotify.album_art_url;
        spotifyAlbum.alt = `Album cover for ${spotify.song}`;
        spotifyText.textContent = `Listening to ${spotify.song} by ${spotify.artist}`;
        spotifyContainer.style.display = "flex";
    } else if (spotifyContainer) {
        spotifyContainer.style.display = "none";
    }

    const gameContainer = document.getElementById("game-status");
    if (game && gameContainer) {
        gameContainer.textContent = `🎮 Playing ${game.name}${game.state ? ` — ${game.state}` : ""}`;
        gameContainer.style.display = "block";
    } else if (gameContainer) {
        gameContainer.style.display = "none";
    }
}

function setupSocket() {
    const socket = new WebSocket("wss://api.lanyard.rest/socket");

    socket.onopen = () => {
        socket.send(JSON.stringify({
            op: 2,
            d: {
                subscribe_to_id: userId
            }
        }));
    };

    socket.onmessage = (event) => {
        const { t, d } = JSON.parse(event.data);
        if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
            updateStatus(d);
        }
    };

    socket.onclose = () => {
        setTimeout(setupSocket, 5000);
    };

    socket.onerror = () => {
        socket.close();
    };
}

async function fetchStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await response.json();
        if (json.success) {
            updateStatus(json.data);
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

setupSocket();

setInterval(fetchStatus, 1);

fetchStatus();