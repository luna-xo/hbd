const qs = (sel, root = document) => root.querySelector(sel);

function initNameFromQuery() {
  const url = new URL(window.location.href);
  const name = url.searchParams.get("name");
  const el = qs("#vName");
  if (name && el) el.textContent = name;
}

function initCopy() {
  const btn = qs("#vCopy");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const text = qs("#vNote")?.textContent?.trim() || "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied ✓";
      setTimeout(() => (btn.textContent = "Copy this note"), 2000);
    } catch {
      btn.textContent = "Couldn’t copy";
      setTimeout(() => (btn.textContent = "Copy this note"), 2000);
    }
  });
}

function initHearts() {
  const canvas = qs("#vHearts");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const hearts = [];
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  function spawnHeart(x, y) {
    hearts.push({
      x,
      y,
      vy: -0.6 - Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      size: 10 + Math.random() * 10,
      life: 260 + (Math.random() * 80) | 0,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.04,
    });
  }

  for (let i = 0; i < 50; i++) {
    spawnHeart(
      window.innerWidth * (0.2 + Math.random() * 0.6),
      window.innerHeight * (0.4 + Math.random() * 0.4),
    );
  }

  canvas.addEventListener("click", (e) => {
    for (let i = 0; i < 8; i++) spawnHeart(e.clientX, e.clientY);
  });

  function drawHeart(x, y, s, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.bezierCurveTo(-1.4, -2.3, -3, -0.7, 0, 2);
    ctx.bezierCurveTo(3, -0.7, 1.4, -2.3, 0, -1);
    ctx.closePath();
    const grd = ctx.createLinearGradient(-1, -2, 1, 2);
    grd.addColorStop(0, "rgba(255, 230, 240, 0.9)");
    grd.addColorStop(1, "rgba(255, 77, 109, 0.9)");
    ctx.fillStyle = grd;
    ctx.shadowColor = "rgba(255, 77, 109, 0.9)";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    requestAnimationFrame(tick);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.life -= 1;
      h.rot += h.vr;
      const alpha = Math.max(0, Math.min(1, h.life / 260));
      ctx.globalAlpha = alpha;
      drawHeart(h.x, h.y, h.size / 26, h.rot);
      if (h.life <= 0 || h.y < -40) hearts.splice(i, 1);
    }
  }
  tick();
}

window.addEventListener("DOMContentLoaded", () => {
  initNameFromQuery();
  initCopy();
  initHearts();
});

