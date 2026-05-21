/**
 * creative coding 2026 - week 3: intro to typography
 * sketch: first_text_to_point_lines
 * iteration 7 by mali van haandel
 * debugged by Visual Code Studio
 *
 * added addition phrases for every click
 * " i am " is fixed in place
 */

let myFont;
let points = [];

let prefix = "i am";
let stateString = "lowkey overwhelmed";

let mouseStarSize = 20;
let starRotation = 0;

let sparkles = [];
let paletteIndex = 0;

// phrase pool (random generation on click)
let words = [
  "lowkey overwhelmed",
  "currently existing",
  "doing my best",
  "mildly functional",
  "this is fine",
  "probably fine",
  "still loading",
  "just thinking",
  "on standby",
  "socially drained"
];

// colour palette system (cycles on click)
let palettes = [
  { bg: [255, 255, 0], primary: [0, 0, 255], accent: [255, 255, 255] },
  { bg: [20, 20, 255], primary: [255, 100, 255], accent: [255, 255, 255] },
  { bg: [255, 40, 80], primary: [80, 255, 200], accent: [255, 255, 255] },
  { bg: [40, 255, 120], primary: [255, 80, 200], accent: [255, 255, 255] },
  { bg: [120, 60, 255], primary: [255, 200, 80], accent: [255, 255, 255] }
];

// returns current active palette
function currentPalette() {
  return palettes[paletteIndex % palettes.length];
}

function preload() {
  myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  buildSparkles();      // background particle system
  buildPhrasePoints();  // generate initial text shape
}

/**
 * creates animated sparkle background particles
 */
function buildSparkles() {
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

/**
 * converts text into point-based geometry
 * and recenters the full shape on canvas
 */
function buildPhrasePoints() {

  let fontSize = 250;

  let bounds = myFont.textBounds(stateString, 0, 0, fontSize);

  // initial placement based on text bounds
  let x = width / 2 - bounds.w / 2;
  let y = height / 2 + bounds.h / 2;

  points = myFont.textToPoints(stateString, x, y, fontSize, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });

  // calculate bounding box of generated points
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (let p of points) {
    minX = min(minX, p.x);
    maxX = max(maxX, p.x);
    minY = min(minY, p.y);
    maxY = max(maxY, p.y);
  }

  // center correction offset
  let offsetX = (width / 2) - (minX + (maxX - minX) / 2);
  let offsetY = (height / 2) - (minY + (maxY - minY) / 2) + 60;

  for (let p of points) {
    p.x += offsetX;
    p.y += offsetY;
  }
}

/**
 * mouse interaction
 * click cycles palette and generates new phrase
 */
function mousePressed() {
  paletteIndex++;
  stateString = random(words);
  buildPhrasePoints();
}

function draw() {

  let pal = currentPalette();

  background(pal.bg[0], pal.bg[1], pal.bg[2], 220);

  /**
   * sparkle background animation layer
   */
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

  /**
   * decorative background star shape
   */
  push();
  translate(width / 2, height / 2);
  noStroke();
  fill(255, 90);
  drawStar(0, 0, 320, 150, 5);
  pop();

  /**
   * lines from text points to mouse
   */
  stroke(pal.accent[0], pal.accent[1], pal.accent[2], 60);
  strokeWeight(0.8);

  for (let p of points) {
    line(p.x, p.y, mouseX, mouseY);
  }

  /**
   * phrase rendered as star points
   */
  for (let p of points) {
    fill(pal.primary[0], pal.primary[1], pal.primary[2]);
    noStroke();
    drawStar(p.x, p.y, 5, 2.5, 5);
  }

  /**
   * rotating mouse-follow star
   */
  starRotation += 0.05;

  push();
  translate(mouseX, mouseY);
  rotate(starRotation);

  fill(pal.primary[0], pal.primary[1], pal.primary[2]);
  noStroke();
  drawStar(0, 0, mouseStarSize, mouseStarSize * 0.5, 5);
  pop();

  /**
   * static label text
   */
  fill(255);
  noStroke();
  textFont(myFont);
  textSize(70);
  textAlign(CENTER, CENTER);

  text(prefix, width / 3, height / 2 - 100);
}

/**
 * helper: star shape generator
 */
function drawStar(x, y, outer, inner, pointsCount) {
  beginShape();

  for (let i = 0; i < pointsCount * 2; i++) {
    let angle = (i * PI) / pointsCount;
    let r = (i % 2 === 0) ? outer : inner;

    vertex(
      x + cos(angle) * r,
      y + sin(angle) * r
    );
  }

  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildPhrasePoints();
}
