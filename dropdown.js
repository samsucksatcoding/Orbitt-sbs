const projectsToggle = document.getElementById('projects-toggle');
const projectsDropdown = document.getElementById('projects-list');
let dropdownOpen = false;

projectsToggle.addEventListener('click', async () => {
    if (!dropdownOpen) {
        if (!projectsDropdown.hasChildNodes()) {
            try {
                const response = await fetch('https://api.github.com/users/samsucksatcoding/repos');
                const repos = await response.json();
                projectsDropdown.innerHTML = '';
                repos.forEach(repo => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a> - ${repo.description || 'No description'}`;
                    projectsDropdown.appendChild(li);
                });
            } catch (e) {
                projectsDropdown.innerHTML = '<li>Failed to load projects. Try again later.</li>';
            }
        }
        projectsDropdown.classList.add('open');
        dropdownOpen = true;
        projectsToggle.textContent = 'Projects ▲';
    } else {
        projectsDropdown.classList.remove('open');
        dropdownOpen = false;
        projectsToggle.textContent = 'Projects ▼';
    }
});
