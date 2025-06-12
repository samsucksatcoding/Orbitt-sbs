// Age Counter
const birthDate = new Date("2009-07-04T00:00:00Z");
function updateAge() {
  const now = new Date();
  const diffMs = now - birthDate;
  const msInYear = 1000 * 60 * 60 * 24 * 365.2425;
  const age = diffMs / msInYear;
  document.getElementById("age").textContent = `${age.toFixed(8)}`;
}
setInterval(updateAge, 50);
updateAge();
// Anchor Hover Animation
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.links a').forEach(link => {
    const originalText = link.textContent;
    let intervalId;

    function randomChar() {
      const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return pool[Math.floor(Math.random() * pool.length)];
    }

    link.addEventListener('mouseenter', () => {
      const len = originalText.length;
      let scrambled = Array.from({ length: len }, () => randomChar());
      let revealIndex = 0;
      link.textContent = scrambled.join('');

      intervalId = setInterval(() => {
        if (revealIndex >= len) {
          clearInterval(intervalId);
          return;
        }
        scrambled[revealIndex] = originalText[revealIndex];
        link.textContent = scrambled.join('');
        revealIndex++;
      }, 50);
    });

    link.addEventListener('mouseleave', () => {
      clearInterval(intervalId);
      link.textContent = originalText;
    });
  });
});