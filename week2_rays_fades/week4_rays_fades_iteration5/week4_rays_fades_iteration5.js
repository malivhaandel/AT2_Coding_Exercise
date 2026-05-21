/**
 * creative coding 2026 - week 2: shape shifters
 * sketch: draw_rays_and_fade
 * iteration 5 by mali van haandel
 * debugged from visual code studio
 *
 * interactive star system with persistent memory
 * click creates stored burst stars
 * stars remain on canvas and persist over time
 * background fades to create motion trails
 */

let inverted = false;   // tracks background + colour mode
let stars = [];         // stores all clicked stars

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 255, 0);
}

// click system
// toggles colour mode and stores star position
function mousePressed() {
  inverted = !inverted;

  // store burst star in memory array
  stars.push({
    x: mouseX,
    y: mouseY,
    size: random(30, 180),
    burst: true
  });
}

function draw() {

  // background system
  // fades using alpha and switches between modes
  if (inverted) {
    background(0, 0, 255, 40);   // blue mode
  } else {
    background(255, 255, 0, 40); // yellow mode
  }

  noStroke();

  // draw stored stars
  // stars persist in fixed positions
  for (let s of stars) {

    // star colour follows current mode
    if (inverted) {
      fill(255, 255, 0);
    } else {
      fill(0, 0, 255);
    }

    // burst stars are slightly larger
    let finalSize = s.burst ? s.size * 1.4 : s.size;

    drawStar(s.x, s.y, finalSize, finalSize * 0.5, 5);
  }

  // live star system
  // follows mouse and reacts to position
  let maxSize = map(mouseX, 0, width, 10, 250);
  let outer = maxSize;
  let inner = outer * 0.5;

  // live star colour matches mode
  if (inverted) {
    fill(255, 255, 0);
  } else {
    fill(0, 0, 255);
  }

  drawStar(mouseX, mouseY, outer, inner, 5);
}

// star function
// procedural star using alternating radius values
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

// resize handler
// keeps canvas responsive and resets background
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(255, 255, 0);
}
