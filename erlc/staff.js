document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.staff-container');
    if (!container) return;

    const workerUrl = 'https://rblxfetcher.imlushotter.workers.dev';  // your deployed Cloudflare Worker URL

    // Since you're a dumbass, i remembered to note it like this so you don't forget the format

    //"userid": "rank", (comma only if theres another following.)
    const staffRanks = {
        "5806093947": "Owner",
        "1005132725": "Co-Owner",
        "1": "Placeholder"
        // Add more staff userIds here if needed
    };

    async function fetchRobloxUser(userId) {
        try {
            const response = await fetch(`${workerUrl}/users/${userId}`);
            if (!response.ok) throw new Error(`Failed to fetch user ${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching Roblox user:', error);
            return null;
        }
    }

    async function fetchUserHeadshotUrl(userId) {
        const url = `${workerUrl}/thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed fetching thumbnail');
            const data = await res.json();
            return data.data && data.data[0] && data.data[0].imageUrl;
        } catch (err) {
            console.error('Error fetching headshot:', err);
            return null;
        }
    }

    // Create a new staffmember element for given userId
    function createStaffMember(userId) {
        const div = document.createElement('div');
        div.className = 'staffmember';
        div.id = userId;
        div.innerHTML = `
            <div class="headshot"><img src="./assets/images/placeholder.png" alt="Staff headshot"></div>
            <h3>Loading...</h3>
            <p>Staff</p>
        `;
        return div;
    }

    // Fill container with staff members up to minimumCount (5 here)
    function fillUpToMinimum(minimumCount = 5) {
        const existingIds = new Set(Array.from(container.children).map(el => el.id.trim()));
        const currentCount = container.children.length;
        if (currentCount >= minimumCount) return;

        const userIds = Object.keys(staffRanks);

        for (const userId of userIds) {
            if (container.children.length >= minimumCount) break;
            if (!existingIds.has(userId)) {
                const newMember = createStaffMember(userId);
                container.appendChild(newMember);
            }
        }
    }

    async function populateStaff() {
        const members = document.querySelectorAll('.staffmember');
        for (const member of members) {
            const userId = member.id.trim();
            if (!userId) continue;

            const userData = await fetchRobloxUser(userId);
            member.querySelector('h3').textContent = userData && userData.name ? userData.name : 'Unknown';

            member.querySelector('p').textContent = staffRanks[userId] || 'Staff';

            const headshotUrl = await fetchUserHeadshotUrl(userId);
            const img = member.querySelector('img');
            img.src = headshotUrl || './assets/images/placeholder.png';
        }
    }

    function duplicateItems() {
        const items = Array.from(container.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            container.appendChild(clone);
        });
    }

    let scrollPos = 0;
    const speed = 0.5;
    const maxScroll = () => container.scrollWidth / 2;
    let isPaused = false;

    container.addEventListener('mouseenter', () => { isPaused = true; });
    container.addEventListener('mouseleave', () => { isPaused = false; });

    function autoScroll() {
        if (!isPaused) {
            scrollPos += speed;
            if (scrollPos >= maxScroll()) scrollPos = 0;
            container.scrollLeft = scrollPos;
        }
        requestAnimationFrame(autoScroll);
    }

    (async () => {
        fillUpToMinimum(5);   // <-- fill to at least 5 members
        await populateStaff();
        duplicateItems();
        autoScroll();
    })();
});