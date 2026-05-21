/*
 * creative coding 2026 - week 3: intro to typography
 * sketch: first_text_to_point_lines
 * iteration 2 by mali van haandel
 * debugged from visual code studio
 * 
 * additional mouse-following star added
 * dots are replaced with star shapes
 */

let myFont;
let points;
let sampleF;

let textString = "star!";
let mouseStarSize = 20;

// preload() runs before setup() to ensure our font is downloaded/loaded first.
function preload() {
  myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sampleF = 0.05;

  buildText();
}

function buildText() {

  // measure text bounds for centering
  let bounds = myFont.textBounds(textString, 0, 0, 300);

  let x = (width - bounds.w) / 2;
  let y = (height / 2) + (bounds.h / 2);

  // extract outline points
  points = myFont.textToPoints(textString, x, y, 300, {
    sampleFactor: sampleF,
    simplifyThreshold: 0
  });
}

function draw() {

  // fun background colour
  background(255, 80, 180);

  for (let i = 0; i < points.length; i++) {

    let p = points[i];

    //  draw the connecting line
    stroke(255, 255, 255, 100);
    strokeWeight(1);
    line(p.x, p.y, mouseX, mouseY);

    // draw the twinkling dot (as star)
    let randomDotColor = color(random(255), random(255), random(255));

    fill(randomDotColor);
    stroke("white");
    strokeWeight(1);

    drawStar(p.x, p.y, 5, 2.5, 5);
  }

  // mouse star (same shape, scale)
  fill(255, 255, 255);
  stroke("white");
  strokeWeight(1);

  drawStar(mouseX, mouseY, mouseStarSize, mouseStarSize * 0.5, 5);
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

// resize canvas + recenter text
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildText();
}
