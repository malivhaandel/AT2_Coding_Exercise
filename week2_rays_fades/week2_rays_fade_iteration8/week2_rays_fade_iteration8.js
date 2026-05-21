/**
 * creative coding 2026 - week 2: shape shifters
 * sketch: draw_rays_and_fade
 * iteration by mali van haandel
 * debugged by Visual Studio Code
 * 
 * click cycles colour palette
 */

let stars = [];
let paletteIndex = 0;

let palettes = [
  // original blue / yellow mode
  { bg: [255, 255, 0], primary: [0, 0, 255], accent: [255, 255, 255] },

  // palette 1
  { bg: [20, 20, 255], primary: [255, 100, 255], accent: [255, 255, 255] },

  // palette 2
  { bg: [255, 40, 80], primary: [80, 255, 200], accent: [255, 255, 255] },

  // palette 3
  { bg: [40, 255, 120], primary: [255, 80, 200], accent: [255, 255, 255] },

  // palette 4
  { bg: [120, 60, 255], primary: [255, 200, 80], accent: [255, 255, 255] }
];

function currentPalette() {
  return palettes[paletteIndex % palettes.length];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function mousePressed() {

  // cycle palette on click
  paletteIndex++;

  // create new star at mouse position
  stars.push({
    x: mouseX,
    y: mouseY,

    vx: random(-0.3, 0.3),   // horizontal drift
    vy: random(0.5, 1.5),    // gravity / fall motion

    rot: random(TWO_PI),     // initial rotation
    rotSpeed: random(-0.02, 0.02), // rotation speed

    size: random(30, 180),   // star size variation
    burst: true,             // click-created star flag
    life: 255                // fade value (alpha over time)
  });
}

function draw() {

  let pal = currentPalette();

  // background fade (trail effect using alpha)
  background(pal.bg[0], pal.bg[1], pal.bg[2], 40);

  noStroke();

  // draw + update stored stars
  for (let i = stars.length - 1; i >= 0; i--) {

    let s = stars[i];

    // movement system (drift + gravity)
    s.x += s.vx;
    s.y += s.vy;

    // rotation system
    s.rot += s.rotSpeed;

    // fade system (life decay)
    s.life -= 1.8;

    // remove star when fully faded
    if (s.life <= 0) {
      stars.splice(i, 1);
      continue;
    }

    push();
    translate(s.x, s.y);
    rotate(s.rot);

    // star colour uses palette primary with fading alpha
    fill(
      pal.primary[0],
      pal.primary[1],
      pal.primary[2],
      s.life
    );

    // burst stars slightly larger
    let finalSize = s.burst ? s.size * 1.4 : s.size;

    drawStar(0, 0, finalSize, finalSize * 0.5, 5);

    pop();
  }

  // live star follows mouse
  let size = map(mouseX, 0, width, 10, 220);

  fill(
    pal.primary[0],
    pal.primary[1],
    pal.primary[2]
  );

  drawStar(mouseX, mouseY, size, size * 0.5, 5);
}

// reusable star drawing function
function drawStar(x, y, outer, inner, points) {

  beginShape();

  for (let i = 0; i < points * 2; i++) {

    let angle = (i * PI) / points;
    let r = (i % 2 === 0) ? outer : inner;

    let px = x + cos(angle) * r;
    let py = y + sin(angle) * r;

    vertex(px, py);
  }

  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
