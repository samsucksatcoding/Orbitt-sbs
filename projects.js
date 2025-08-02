// projects.js

document.addEventListener("DOMContentLoaded", () => {
  const projectsList = document.getElementById("projects");
  const githubUser = "samsucksatcoding";
  const apiUrl = `https://api.github.com/users/${githubUser}/repos`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch repos");
      return response.json();
    })
    .then(repos => {
      projectsList.innerHTML = ""; // Clear loading text
      if (repos.length === 0) {
        projectsList.innerHTML = "<li>No projects found.</li>";
        return;
      }
      repos.forEach(repo => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = repo.html_url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = repo.name;
        li.appendChild(a);
        projectsList.appendChild(li);
      });
    })
    .catch(error => {
      projectsList.innerHTML = `<li>Error loading projects: ${error.message}</li>`;
    });
});