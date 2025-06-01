const userId = "934530409293824020";

const statusEl = document.getElementById("discord-status");
const customStatusEl = document.getElementById("custom-status");

function updateStatus(data) {
    const presence = data.discord_status;
    const activities = data.activities;
    const custom = activities.find(act => act.type === 4);

    const presenceMap = {
        "online": "🟢 online",
        "idle": "🟡 idle",
        "dnd": "🔴 do not disturb",
        "offline": "⚫ offline"
    };
    statusEl.textContent = presenceMap[presence] || "⚫ unknown";

    if (custom) {
        const emoji = custom.emoji ?
            (custom.emoji.id
                ? `<img src="https://cdn.discordapp.com/emojis/${custom.emoji.id}.${custom.emoji.animated ? 'gif' : 'png'}" class="emoji" style="width:1em;height:1em;vertical-align:text-bottom;"> `
                : `${custom.emoji.name} `)
            : "";

        customStatusEl.innerHTML = `${emoji}${custom.state || ''}`;
    } else {
        customStatusEl.textContent = "no custom status";
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