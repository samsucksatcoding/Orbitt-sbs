document.addEventListener('DOMContentLoaded', () => {
  const searchbar = document.getElementById('searchbar');
  const links = Array.from(document.querySelectorAll('.sidebar a'));

  document.addEventListener('keydown', (e) => {
    if (
      (e.ctrlKey && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'e')) ||
      (!e.ctrlKey && e.key === '/')
    ) {
      e.preventDefault();
      searchbar.focus();
    }
  });

  searchbar.addEventListener('input', () => {
    const query = searchbar.value.toLowerCase();

    links.forEach(link => {
      const text = link.textContent.toLowerCase();
      if (text.includes(query)) {
        link.style.display = '';
      } else {
        link.style.display = 'none';
      }
    });
  });
});