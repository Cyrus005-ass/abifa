const canvas = document.getElementById('poster');
const ctx = canvas.getContext('2d');
const W = 1200, H = 1200;

let portrait = null;
let logoImg = null;
let qrImg = null;
let basImg = null;
let assetsReady = false;

const $ = (id) => document.getElementById(id);

function roundedRect(x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function drawCover(img, x, y, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function init() {
  Promise.all([
    loadImage('image/logo.png').then(img => { logoImg = img; }),
    loadImage('image/qr_code.png').then(img => { qrImg = img; }),
    loadImage('image/bas.png').then(img => { basImg = img; })
  ]).then(() => {
    assetsReady = true;
    draw();
  }).catch(err => {
    console.error('Erreur chargement images:', err);
    assetsReady = true;
    draw();
  });
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  /* Fond */
  ctx.fillStyle = '#16456f';
  ctx.fillRect(0, 0, W, H);

  /* Plaque logo */
  roundedRect(66, 55, 150, 155, 10, '#f5f7f9');
  if (logoImg) {
    ctx.drawImage(logoImg, 82, 70, 128, 135);
  } else {
    ctx.fillStyle = '#16456f';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ABIFA', 140, 132);
  }

  /* Site web */
  ctx.fillStyle = '#f5f7fb';
  ctx.font = '30px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('abifadagori.com', 1130, 150);

  /* Bloc titre */
  ctx.textAlign = 'left';
  ctx.fillStyle = '#f4f6fa';
  ctx.font = '44px Arial';
  ctx.fillText('Je participe au', 78, 310);
  ctx.font = 'bold 72px Arial';
  ctx.fillText('Hackathon', 78, 395);
  ctx.font = 'bold 124px Arial';
  ctx.fillText('ABIFA', 78, 500);
  ctx.fillStyle = '#f58227';
  ctx.font = 'bold 124px Arial';
  ctx.fillText('2026', 78, 620);
  ctx.fillStyle = '#f4f6fa';
  ctx.font = '34px Arial';
  ctx.fillText('Première édition', 78, 670);

  /* Portrait dans un cercle avec anneau orange */
  const cx = 860, cy = 470, r = 200;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
  ctx.clip();
  if (portrait) {
    drawCover(portrait, cx - (r - 8), cy - (r - 8), (r - 8) * 2, (r - 8) * 2);
  } else {
    ctx.fillStyle = '#16456f';
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.fillStyle = '#dce8f1';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Votre photo ici', cx, cy + 12);
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#f58227';
  ctx.lineWidth = 11;
  ctx.stroke();

  /* Informations du participant */
  const name = $('firstName').value.trim() || 'Prénom NOM';
  const city = $('city').value.trim() || 'Ville, Pays';

  ctx.textAlign = 'left';
  ctx.fillStyle = '#f5f7fb';
  const nameSize = Math.min(78, Math.max(38, 700 / (name.length * 0.55)));
  ctx.font = 'bold ' + nameSize + 'px Arial';
  ctx.fillText(name, 78, 870, 950);

  ctx.fillStyle = '#d8e3ed';
  ctx.font = '36px Arial';
  ctx.fillText(city, 78, 910, 950);

  /* Pied de page */
  ctx.fillStyle = '#f3f6f9';
  ctx.fillRect(0, 1000, 1200, 150);
  ctx.fillStyle = '#f58227';
  ctx.fillRect(0, 1000, 1200, 8);

  ctx.fillStyle = '#16456f';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('FORMATION · INNOVATION · ENTREPRENEURIAT', 210, 1060);

  /* bas.png à gauche du texte */
  if (basImg) {
    const bw = 80, bh = 80;
    ctx.drawImage(basImg, 110, 1043, bw, bh);
  }

  ctx.fillStyle = '#283746';
  ctx.font = '24px Arial';
  ctx.fillText('abifadagori.com · Agori, Bénin', 210, 1100);

  /* QR code en bas à droite */
  if (qrImg) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(1052, 1020, 110, 110);
    ctx.drawImage(qrImg, 1056, 1024, 100, 100);
  }
}

/* ---------- Écouteurs ---------- */
$('firstName').addEventListener('input', draw);
$('city').addEventListener('input', draw);

$('photo').addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (!f) return;
  if (!f.type.startsWith('image/')) {
    alert('Veuillez choisir une image.');
    return;
  }
  const url = URL.createObjectURL(f);
  const im = new Image();
  im.onload = () => {
    portrait = im;
    draw();
    URL.revokeObjectURL(url);
  };
  im.src = url;
});

$('download').addEventListener('click', () => {
  draw();
  const base = $('firstName').value.trim() || 'participant';
  const slug = base.replace(/[^a-z0-9]+/gi, '_');
  const a = document.createElement('a');
  a.download = 'Affiche_ABIFA_2026_' + slug + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
});

  $('reset').addEventListener('click', () => {
    $('firstName').value = '';
    $('city').value = '';
    $('photo').value = '';
    portrait = null;
    draw();
  });

/* ---------- Initialisation ---------- */
init();
