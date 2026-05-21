/**
 * Creative Coding 2026 - Week 3: Intro to Typography
 * Sketch: first_text_to_point_lines
 * iteration 4 by mali van haandel
 * debugged from visual code studio
 * 
 * sparkle background system with palette switching
 * click changes colour palette
 * text reacts visually through colour changing
 * text star is corresponds to new colour change instead of random colours
 */

let myFont;
let points;
let sampleF;

let textString = "star!";
let mouseStarSize = 20;

// sparkle system
let sparkles = [];

// palette system
let paletteIndex = 0;

let palettes = [
  { bg: [255, 255, 0], primary: [0, 0, 255], accent: [255, 255, 255] },
  { bg: [20, 20, 255], primary: [255, 100, 255], accent: [255, 255, 255] },
  { bg: [255, 40, 80], primary: [80, 255, 200], accent: [255, 255, 255] },
  { bg: [40, 255, 120], primary: [255, 80, 200], accent: [255, 255, 255] },
  { bg: [120, 60, 255], primary: [255, 200, 80], accent: [255, 255, 255] }
];

// returns current palette
function currentPalette() {
  return palettes[paletteIndex % palettes.length];
}

// load font before setup
function preload() {
  myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sampleF = 0.1;

  buildText();

  // create sparkle particles
  for (let i = 0; i < 200; i++) {
    sparkles.push({
      x: random(width),
      y: random(height),
      r: random(4, 12),
      alpha: random(0, 255),
      twinkle: random(0.02, 0.08),
      phase: random(TWO_PI)
    });
  }
}

// click changes palette
function mousePressed() {
  paletteIndex++;
}

// generate text points
function buildText() {

  let bounds = myFont.textBounds(textString, 0, 0, 300);

  let x = (width - bounds.w) / 2;
  let y = (height / 2) + (bounds.h / 2);

  points = myFont.textToPoints(textString, x, y, 300, {
    sampleFactor: sampleF,
    simplifyThreshold: 0
  });
}

function draw() {

  let pal = currentPalette();

  // background using palette
  background(pal.bg[0], pal.bg[1], pal.bg[2], 220);

  // sparkle layer
  noStroke();
  for (let s of sparkles) {

    s.phase += s.twinkle;
    let pulse = map(sin(s.phase), -1, 1, 0.8, 2);

    if (random() < 0.02) {
      s.alpha = 255;
      s.r = random(1, 3);
    } else {
      s.alpha *= 0.98;
    }

    fill(pal.accent[0], pal.accent[1], pal.accent[2], s.alpha);
    ellipse(s.x, s.y, s.r * pulse);
  }

  for (let i = 0; i < points.length; i++) {

    let p = points[i];

    // line to mouse
    stroke(pal.accent[0], pal.accent[1], pal.accent[2], 50);
    strokeWeight(0.75);
    line(p.x, p.y, mouseX, mouseY);

    // flicker colour for points
    let flicker = random(0.7, 1.2);

    fill(
      pal.primary[0] * flicker,
      pal.primary[1] * flicker,
      pal.primary[2] * flicker
    );

    noStroke();

    drawStar(p.x, p.y, 5, 2.5, 5);
  }

  // mouse star
  fill(pal.primary[0], pal.primary[1], pal.primary[2]);
  noStroke();

  drawStar(mouseX, mouseY, mouseStarSize, mouseStarSize * 0.5, 5);

  // text overlay label
  fill(pal.accent[0], pal.accent[1], pal.accent[2]);
  textFont(myFont);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("i am a", width / 3, height / 2 - 120);
}

// star function
function drawStar(x, y, outer, inner, pointsCount) {

  beginShape();

  for (let i = 0; i < pointsCount * 2; i++) {

    let angle = (i * PI) / pointsCount;
    let r = (i % 2 === 0) ? outer : inner;

    let px = x + cos(angle) * r;
    let py = y + sin(angle) * r;

    vertex(px, py);
  }

  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildText();
}
