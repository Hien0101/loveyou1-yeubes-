const canvas = document.getElementById("galaxy");
const ctx = canvas.getContext("2d");

let cw = (canvas.width = window.innerWidth);
let ch = (canvas.height = window.innerHeight);
let cX = cw / 2,
  cY = ch / 2;

window.addEventListener("resize", () => {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
  cX = cw / 2;
  cY = ch / 2;
});

const stars = [],
  N = 5000;
let zMain = 1.8,
  tzMain = 1.8;

for (let i = 0; i < N; i++) {
  stars.push({
    r0: 50 + Math.random() * Math.max(cw, ch),
    a: Math.random() * 2 * Math.PI,
    s: 0.00002 + Math.random() * 0.0002,
    z: Math.random(),
    sz: 0.7 + Math.random() * 3,
    et: 0.3 + Math.random() * 0.7,
    c: `hsl(${Math.random() * 360},80%,${70 + Math.random() * 20}%)`,
  });
}

canvas.addEventListener("mousemove", (e) => {
  const dx = e.clientX - cX,
    dy = e.clientY - cY;
  tzMain = 1.8 + (Math.hypot(dx, dy) / Math.max(cw, ch)) * 3;
});
canvas.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  const dx = t.clientX - cX,
    dy = t.clientY - cY;
  tzMain = 1.8 + (Math.hypot(dx, dy) / Math.max(cw, ch)) * 3;
  e.preventDefault();
});

canvas.addEventListener("click", (e) => {
  const dx = e.clientX - cX;
  const dy = e.clientY - cY;
  const dist = Math.hypot(dx, dy);

  const starRadius = getStarRadius(); // sử dụng lại hàm responsive bên dưới

  if (dist < starRadius + 15) {
    window.location.href = "https://hien0101.github.io/loveyou-b-iucuame/";
  } else {
    stars.forEach((s) => {
      s.r0 = 50 + Math.random() * Math.max(cw, ch);
    });
  }
});

function getStarRadius() {
  let base = Math.min(cw, ch) / 12;
  if (cw < 600 || ch < 600) {
    base *= 0.75; // thu nhỏ ngôi sao to hơn nữa trên điện thoại
  }
  return base;
}

function drawGalaxy() {
  ctx.clearRect(0, 0, cw, ch);
  zMain += (tzMain - zMain) * 0.05;

  const quadR = Math.max(cw, ch);
  [
    ["rgba(255,0,255,0.2)", -1, -1],
    ["rgba(0,255,255,0.2)", 1, -1],
    ["rgba(255,255,0,0.2)", -1, 1],
    ["rgba(0,255,128,0.2)", 1, 1],
  ].forEach(([col, ix, iy]) => {
    const g = ctx.createRadialGradient(
      cX + (ix * quadR) / 3,
      cY + (iy * quadR) / 3,
      0,
      cX + (ix * quadR) / 3,
      cY + (iy * quadR) / 3,
      quadR
    );
    g.addColorStop(0, col);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);
  });

  // sao bé elip quay
  stars.forEach((s) => {
    s.a += s.s;
    const scale = (1 - s.z) * zMain;
    const dist = s.r0 * scale;
    const x = cX + dist * Math.cos(s.a);
    const y = cY + dist * s.et * Math.sin(s.a);
    ctx.beginPath();
    ctx.arc(x, y, s.sz * scale * 0.7, 0, 2 * Math.PI);
    ctx.fillStyle = s.c;
    ctx.fill();
  });

  // ngôi sao to responsive
  const starRadius = getStarRadius();
  const mg = ctx.createRadialGradient(cX, cY, 0, cX, cY, starRadius);
  mg.addColorStop(0, "white");
  mg.addColorStop(0.3, "#ffdd66");
  mg.addColorStop(1, "rgba(255,200,0,0.1)");

  ctx.beginPath();
  ctx.arc(cX, cY, starRadius * (1 + (zMain - 1.8) * 0.2), 0, 2 * Math.PI);
  ctx.fillStyle = mg;
  ctx.fill();

  requestAnimationFrame(drawGalaxy);
}

drawGalaxy();
