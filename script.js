/* Birthday page interactions: confetti, note modal, candle wish, tilt card, optional music. */

const qs = (sel, root = document) => root.querySelector(sel);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function initBasics() {
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Deep-link customization via query params: ?name=Rohan&age=19&from=Sri
  const url = new URL(window.location.href);
  const name = url.searchParams.get("name");
  const age = url.searchParams.get("age");
  const from = url.searchParams.get("from");

  if (name) {
    const nameEl = qs("#name");
    const mono = qs("#monogram");
    if (nameEl) nameEl.textContent = name;
    if (mono) mono.textContent = name.trim().slice(0, 1).toUpperCase();
    document.title = `Happy Birthday, ${name} 🎂`;
  }
  if (age) {
    const ageEl = qs("#age");
    if (ageEl) ageEl.textContent = age;
  }
  if (from) {
    const fromEl = qs("#from");
    if (fromEl) fromEl.textContent = from;
  }

  const idCode = qs("#idCode");
  if (idCode) {
    const n = (qs("#name")?.textContent || "BDAY").replace(/\s+/g, "").slice(0, 6).toUpperCase();
    idCode.textContent = `HB-${n}-${new Date().getFullYear()}`;
  }
}

function initModal() {
  const modal = qs("#noteModal");
  const btnOpen = qs("#btnOpenNote");
  if (!modal || !btnOpen) return;

  btnOpen.addEventListener("click", () => {
    if (typeof modal.showModal === "function") modal.showModal();
  });

  // click outside closes
  modal.addEventListener("click", (e) => {
    const card = qs(".modal__card", modal);
    if (!card) return;
    const r = card.getBoundingClientRect();
    const isInCard =
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom;
    if (!isInCard) modal.close();
  });

  const btnCopy = qs("#btnCopy");
  btnCopy?.addEventListener("click", async () => {
    const text = qs("#noteText")?.textContent?.trim() || "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied. Send it to him if you want.");
    } catch {
      toast("Couldn’t copy (browser blocked). You can still select + copy.");
    }
  });
}

let toastTimer = null;
function toast(msg) {
  const el = qs("#toast");
  if (!el) return;
  el.textContent = msg;
  el.style.opacity = "1";
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    el.textContent = "";
  }, 2400);
}

function initCandle() {
  const candle = qs("#candle");
  if (!candle) return;
  candle.dataset.off = "false";
  candle.addEventListener("click", () => {
    const isOff = candle.dataset.off === "true";
    candle.dataset.off = isOff ? "false" : "true";
    if (isOff) toast("Flame back on. Another wish?");
    else toast("Wish made. Keep it secret.");
  });
}

function initMood() {
  const btn = qs("#toggleMode");
  if (!btn) return;

  const saved = window.localStorage.getItem("birthdayMood");
  if (saved === "day") document.documentElement.dataset.mood = "day";
  btn.setAttribute("aria-pressed", saved === "day" ? "true" : "false");

  btn.addEventListener("click", () => {
    const isDay = document.documentElement.dataset.mood === "day";
    if (isDay) {
      delete document.documentElement.dataset.mood;
      btn.setAttribute("aria-pressed", "false");
      window.localStorage.setItem("birthdayMood", "night");
    } else {
      document.documentElement.dataset.mood = "day";
      btn.setAttribute("aria-pressed", "true");
      window.localStorage.setItem("birthdayMood", "day");
    }
  });
}

function initTiltCard() {
  const card = qs(".card3d__face");
  const host = qs(".card3d");
  if (!card || !host) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReduced) return;

  function onMove(e) {
    const r = host.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * 10;
    const ry = (x - 0.5) * 12;
    host.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }
  function onLeave() {
    host.style.transform = `rotateX(0deg) rotateY(0deg)`;
  }

  host.addEventListener("mousemove", onMove);
  host.addEventListener("mouseleave", onLeave);
  host.addEventListener("touchmove", (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    onMove({ clientX: t.clientX, clientY: t.clientY });
  });
  host.addEventListener("touchend", onLeave);
}

// Confetti (tiny canvas particle system)
let confetti = null;

function makeConfetti() {
  const canvas = document.createElement("canvas");
  canvas.id = "confettiCanvas";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const colors = ["#8cffc1", "#7aa2ff", "#ff7bd3", "#ffd37a", "#ffffff"];
  const pieces = [];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  function burst(count = 160) {
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: window.innerWidth * (0.15 + Math.random() * 0.7),
        y: window.innerHeight * (0.1 + Math.random() * 0.1),
        vx: (Math.random() - 0.5) * 7,
        vy: -4 - Math.random() * 6,
        g: 0.18 + Math.random() * 0.1,
        r: 3 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.22,
        c: colors[(Math.random() * colors.length) | 0],
        life: 260 + (Math.random() * 80) | 0,
      });
    }
  }

  let raf = 0;
  function tick() {
    raf = window.requestAnimationFrame(tick);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = clamp(p.life / 260, 0, 1);
      ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.4);
      ctx.restore();

      if (p.y > window.innerHeight + 60 || p.life <= 0) pieces.splice(i, 1);
    }

    // auto stop when done
    if (pieces.length === 0) {
      window.cancelAnimationFrame(raf);
      raf = 0;
      canvas.remove();
      window.removeEventListener("resize", resize);
      confetti = null;
    }
  }

  return {
    burst: (n) => {
      burst(n);
      if (!raf) tick();
    },
  };
}

function initConfetti() {
  const btn = qs("#btnConfetti");
  if (!btn) return;
  btn.addEventListener("click", () => {
    confetti = confetti || makeConfetti();
    confetti?.burst(180);
    toast("Wishing you an insane year ahead.");
  });
}

// Optional “music”: generated tones with WebAudio so no assets needed.
function initMusic() {
  const btn = qs("#toggleMusic");
  if (!btn) return;

  let ctx = null;
  let master = null;
  let isOn = false;
  let timer = 0;

  function stop() {
    isOn = false;
    btn.setAttribute("aria-pressed", "false");
    if (timer) window.clearInterval(timer);
    timer = 0;
    if (master) master.gain.setValueAtTime(0.0001, ctx.currentTime);
  }

  function start() {
    isOn = true;
    btn.setAttribute("aria-pressed", "true");

    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.04;
      master.connect(ctx.destination);
    }

    // simple lo-fi-ish chord loop
    const chords = [
      [261.63, 329.63, 392.0], // C
      [293.66, 369.99, 440.0], // D
      [220.0, 277.18, 329.63], // A-
      [246.94, 311.13, 369.99], // B♭
    ];
    let idx = 0;

    const playChord = () => {
      if (!ctx || !master) return;
      const now = ctx.currentTime;
      const dur = 0.9;
      const chord = chords[idx % chords.length];
      idx++;

      chord.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.03 / (i + 1), now + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(g);
        g.connect(master);
        osc.start(now);
        osc.stop(now + dur + 0.02);
      });

      // tiny click percussion
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      noise.buffer = buffer;
      const ng = ctx.createGain();
      ng.gain.value = 0.03;
      noise.connect(ng);
      ng.connect(master);
      noise.start(now);
    };

    playChord();
    timer = window.setInterval(playChord, 950);
  }

  // respect autoplay restrictions: only start on user click
  btn.addEventListener("click", async () => {
    try {
      if (ctx && ctx.state === "suspended") await ctx.resume();
    } catch {
      // ignore
    }
    if (isOn) stop();
    else start();
  });
}

function initLikeModals() {
  const modal = qs("#likeModal");
  const titleEl = qs("#likeModalTitle");
  const bodyEl = qs("#likeModalBody");
  const placeholderEl = qs("#likeModalPlaceholder");
  const closeBtn = qs("#likeModalClose");
  if (!modal || !bodyEl || !titleEl) return;

  function clearMedia() {
    const vid = qs("video", bodyEl);
    const img = qs("img", bodyEl);
    if (vid) {
      vid.pause();
      vid.removeAttribute("src");
      vid.load();
      vid.remove();
    }
    if (img) img.remove();
    if (placeholderEl) placeholderEl.hidden = false;
  }

  function openLike(title, src, type) {
    clearMedia();
    titleEl.textContent = title || "—";
    if (src && (type === "video" || type === "image")) {
      if (placeholderEl) placeholderEl.hidden = true;
      if (type === "video") {
        const video = document.createElement("video");
        video.controls = true;
        video.playsInline = true;
        video.src = src;
        video.className = "likeModal__media";
        bodyEl.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = src;
        img.alt = title;
        img.className = "likeModal__media";
        bodyEl.appendChild(img);
      }
    }
    if (typeof modal.showModal === "function") modal.showModal();
  }

  document.querySelectorAll(".likeCard").forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.getAttribute("data-like-title") || "";
      const src = (card.getAttribute("data-like-src") || "").trim();
      const type = (card.getAttribute("data-like-type") || "video").toLowerCase();
      openLike(title, src, type);
    });
  });

  closeBtn?.addEventListener("click", () => {
    clearMedia();
    modal.close();
  });

  modal.addEventListener("close", clearMedia);
  modal.addEventListener("click", (e) => {
    const card = qs(".likeModal__card", modal);
    if (!card) return;
    const r = card.getBoundingClientRect();
    const inCard = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inCard) {
      clearMedia();
      modal.close();
    }
  });
}

function boot() {
  initBasics();
  initModal();
  initLikeModals();
  initCandle();
  initMood();
  initTiltCard();
  initConfetti();
  initMusic();
}

window.addEventListener("DOMContentLoaded", boot);

