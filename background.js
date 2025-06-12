const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const mouse = { x: null, y: null };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

const PURPLE = '#a873ff';

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
    if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = PURPLE;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.opacity = 1;
  }

  update() {
    this.radius += 4;
    this.opacity -= 0.015;
  }

  draw() {
    ctx.beginPath();
    ctx.shadowColor = PURPLE;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = `rgba(168, 115, 255, ${this.opacity})`; // glow purple ripple
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadowBlur
  }

  isVisible() {
    return this.opacity > 0;
  }

  affect(particle) {
    const dx = particle.x - this.x;
    const dy = particle.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.radius && dist > this.radius - 10) {
      const angle = Math.atan2(dy, dx);
      particle.vx += Math.cos(angle) * 0.5;
      particle.vy += Math.sin(angle) * 0.5;
    }
  }
}

const particles = [];
const ripples = [];
const particleCount = 150;

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

window.addEventListener('click', e => {
  ripples.push(new Ripple(e.clientX, e.clientY));
});

function connectParticles() {
  const maxDistance = 100;
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDistance) {
        const opacity = 1 - dist / maxDistance;
        ctx.strokeStyle = `rgba(168, 115, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - particles[a].x;
      const dy = mouse.y - particles[a].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const opacity = 1 - dist / 150;
        ctx.strokeStyle = `rgba(168, 115, 255, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(particles[a].x, particles[a].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  for (let i = ripples.length - 1; i >= 0; i--) {
    const ripple = ripples[i];
    ripple.update();
    ripple.draw();

    particles.forEach(p => ripple.affect(p));

    if (!ripple.isVisible()) {
      ripples.splice(i, 1);
    }
  }

  connectParticles();

  requestAnimationFrame(animate);
}

animate();