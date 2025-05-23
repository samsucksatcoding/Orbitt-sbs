document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('projects-toggle');
    const list = document.getElementById('projects-list');
    let loaded = false;

    toggle.addEventListener('click', async () => {
        // Toggle class to animate dropdown
        list.classList.toggle('open');

        if (list.classList.contains('open')) {
            toggle.textContent = 'Projects ▲';

            // Fetch repos only once
            if (!loaded) {
                try {
                    const res = await fetch('https://api.github.com/users/samsucksatcoding/repos');
                    const repos = await res.json();

                    list.innerHTML = ''; // Clear loading/fallback state
                    repos.forEach(repo => {
                        const li = document.createElement('li');
                        li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a> - ${repo.description || 'No description'}`;
                        list.appendChild(li);
                    });

                    loaded = true;
                } catch (err) {
                    console.error(err);
                    list.innerHTML = '<li>Failed to load projects.</li>';
                }
            }
        } else {
            toggle.textContent = 'Projects ▼';
        }
    });
});
