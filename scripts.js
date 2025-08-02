// Orbitt JS Presets for Androgynous Ether with Transitions and Lanyard Support + CSS Fade

const data = {
  name: ["Sam", "Orbitt", "BBlum3_ryt"],
  musicgenre: ["hyperpop", "breakcore", "phonk", "metal", "rock", "Skrillex"],
  "programming-languages": ["HTML/CSS", "JavaScript", "Python"]
};

function rollText(id, values, interval = 2500) {
  const el = document.getElementById(id);
  if (!el) return;
  let index = 0;

  // Apply initial transition style
  el.style.transition = "opacity 0.5s ease";

  function fadeAndSwitch() {
    el.style.opacity = 0;
    setTimeout(() => {
      el.textContent = values[index];
      el.style.opacity = 1;
      index = (index + 1) % values.length;
    }, 500);
  }

  fadeAndSwitch();
  setInterval(fadeAndSwitch, interval);
}

document.addEventListener("DOMContentLoaded", () => {
  const delayBetween = 600; // milliseconds between each text init
  let i = 0;

  for (const [id, values] of Object.entries(data)) {
    setTimeout(() => rollText(id, values), i * delayBetween);
    i++;
  }

  // Lanyard Discord presence fetch
  const discordUser = document.getElementById("discorduser");
  if (discordUser) {
    discordUser.style.transition = "opacity 0.5s ease";
    discordUser.style.opacity = 0;
    fetch("https://api.lanyard.rest/v1/users/1393281918526558288")
      .then(res => res.json())
      .then(data => {
        const username = data?.data?.discord_user?.username;
        const discriminator = data?.data?.discord_user?.discriminator;
        if (username && discriminator) {
          discordUser.textContent = `@${username}`;
        } else {
          discordUser.textContent = "@Uh-oh, something went wrong...";
        }
        discordUser.style.opacity = 1;
      })
      .catch(() => {
        discordUser.textContent = "@Uh-oh, something went wrong...";
        discordUser.style.opacity = 1;
      });
  }
});
