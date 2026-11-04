// ===========================
// POP PORTFOLIO - main.js
// ===========================

// ローディング → タイトル登場
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".loader").classList.add("is-done");
    document.body.classList.add("is-loaded");
  }, 700);
});

// 年表示
document.getElementById("year").textContent = new Date().getFullYear();

// スマホメニュー
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav__menu a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// スクロールで出現
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ヒーローの図形パララックス
const shapes = document.querySelectorAll(".shape");
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    shapes.forEach((s) => {
      const speed = parseFloat(s.dataset.speed);
      s.style.translate = `0 ${y * speed}px`;
    });
    ticking = false;
  });
});

// ここから PC（マウス）のみ
const isPointer = window.matchMedia("(hover: hover)").matches;

if (isPointer) {
  // カスタムカーソル（少し遅れてついてくる）
  const cursor = document.querySelector(".cursor");
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    cx += (mx - cx) * 0.2;
    cy += (my - cy) * 0.2;
    cursor.style.left = cx + "px";
    cursor.style.top = cy + "px";
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll("a, button, summary, .card, .skills li").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });

  // カードの3Dチルト
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });

  // 顔の目がマウスを追う
  const pupils = document.querySelectorAll(".face__pupil");
  window.addEventListener("mousemove", (e) => {
    pupils.forEach((p) => {
      const r = p.parentElement.getBoundingClientRect();
      const ang = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
      const d = r.width * 0.22;
      p.style.transform = `translate(${Math.cos(ang) * d}px, ${Math.sin(ang) * d}px)`;
    });
  });
} else {
  // スマホ：目がキョロキョロ
  const pupils = document.querySelectorAll(".face__pupil");
  setInterval(() => {
    const ang = Math.random() * Math.PI * 2;
    pupils.forEach((p) => {
      const d = p.parentElement.offsetWidth * 0.22;
      p.style.transform = `translate(${Math.cos(ang) * d}px, ${Math.sin(ang) * d}px)`;
    });
  }, 1400);
}
