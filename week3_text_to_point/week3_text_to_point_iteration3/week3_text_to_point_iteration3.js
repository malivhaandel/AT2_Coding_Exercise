/*
 * creative coding 2026 - week 3: intro to typography
 * sketch: first_text_to_point_lines
 * iteration 3 by mali van haandel
 * debugged from visual code studio
 * 
 * sparkle background system added
 * "i am a" text overlay added with loaded font
 */

let myFont;
let points;
let sampleF;

let textString = "star!";
let mouseStarSize = 20;

// sparkle system
let sparkles = [];

// preload() runs before setup() to ensure font is loaded first
function preload() {
  myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sampleF = 0.05;

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

/**
 * build text outline points and center text
 */
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

  // background colour
  background(255, 80, 180);

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

    fill(255, 255, 255, s.alpha);
    ellipse(s.x, s.y, s.r * pulse);
  }

  // star field (text points)
  for (let i = 0; i < points.length; i++) {

    let p = points[i];

    // draw connecting line
    stroke(255, 255, 255, 100);
    strokeWeight(1);
    line(p.x, p.y, mouseX, mouseY);

    // draw twinkling star at each point
    let randomDotColor = color(random(255), random(255), random(255));

    fill(randomDotColor);
    stroke("white");
    strokeWeight(1);

    drawStar(p.x, p.y, 5, 2.5, 5);
  }

  // mouse star
  fill(255);
  stroke("white");
  strokeWeight(1);

  drawStar(mouseX, mouseY, mouseStarSize, mouseStarSize * 0.5, 5);

  // text overlay
  noStroke();
  fill(255);
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
