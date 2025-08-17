const GITHUB_USER = "samsucksatcoding";

async function fetchRepos() {
    const repoRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos`);
    if (!repoRes.ok) {
        console.error("Failed to fetch repos:", repoRes.status);
        return [];
    }
    return await repoRes.json();
}

async function checkForProjectCard(repoName) {
    const fileNames = ["ProjectCard.png", "ProjectCard.jpg"];
    for (let file of fileNames) {
        const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${repoName}/main/${file}`;
        try {
            const res = await fetch(fileUrl, { method: "HEAD" });
            if (res.ok) return fileUrl;
        } catch (err) {
            console.warn(`Error checking ${fileUrl}:`, err);
        }
    }
    return null;
}

async function replacePlaceholders() {
    const repos = await fetchRepos();
    const cards = document.querySelectorAll(".proj-card");

    let cardIndex = 0;
    for (let repo of repos) {
        if (cardIndex >= cards.length) break;

        const card = cards[cardIndex];
        const imgEl = card.querySelector("img");
        const titleEl = card.querySelector("h3");
        const descEl = card.querySelector("p");

        const projectCardUrl = await checkForProjectCard(repo.name);
        if (projectCardUrl) {
            imgEl.src = projectCardUrl;
            imgEl.alt = repo.name;
        }

        titleEl.textContent = repo.name;
        descEl.textContent = repo.description || "No description provided.";

        cardIndex++;
    }
}

document.addEventListener("DOMContentLoaded", replacePlaceholders);