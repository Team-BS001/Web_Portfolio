(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  document.body.classList.add('loading');
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  let n = 0;
  const tick = () => {
    n += Math.max(1, Math.round((100 - n) / 12));
    if (n > 100) n = 100;
    $('#count').textContent = n;
    $('#bar').style.width = n + '%';
    if (n < 100) return setTimeout(tick, 30);
    setTimeout(() => {
      $('#loader').classList.add('done');
      document.body.classList.remove('loading');
      document.body.classList.add('ready');
    }, 300);
  };
  tick();

  /* ---------- Custom cursor ---------- */
  const cur = $('#cursor'), dot = $('#cursorDot');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px)`;
  });
  (function follow() {
    cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
    cur.style.transform = `translate(${cx}px,${cy}px)`;
    requestAnimationFrame(follow);
  })();
  $$('[data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
  });

  /* ---------- Mobile menu ---------- */
  $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('menu-open'));
  $$('#nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  /* ---------- Scroll reveal + counters ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      const b = $('[data-count]', en.target);
      if (b) countUp(b);
      io.unobserve(en.target);
    });
  }, { threshold: 0.2 });
  $$('.reveal').forEach(el => io.observe(el));
  function countUp(el) {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1600;
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- Horizontal works scroll ---------- */
  const works = $('.works'), track = $('#track');
  const mq = matchMedia('(max-width:768px)');
  function hScroll() {
    if (mq.matches) return;
    const r = works.getBoundingClientRect();
    const max = works.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / max));
    const dist = track.scrollWidth - innerWidth;
    track.style.transform = `translateX(${-dist * p}px)`;
  }
  addEventListener('scroll', hScroll, { passive: true });
  addEventListener('resize', hScroll);

  /* ---------- Magnetic button ---------- */
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.15}px,${y * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  /* ---------- Hero particle canvas ---------- */
  const cv = $('#bg'), ctx = cv.getContext('2d');
  let W, H, pts = [];
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.offsetWidth; H = cv.offsetHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.floor((W * H) / 18000);
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3
    }));
  }
  resize(); addEventListener('resize', resize);
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
      if (d < 120) { p.x += dx / d; p.y += dy / d; }
      ctx.fillStyle = 'rgba(17,17,17,.35)';
      ctx.fillRect(p.x, p.y, 1.5, 1.5);
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 110) {
        ctx.strokeStyle = `rgba(17,17,17,${(1 - d / 110) * .12})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  })();
})();
