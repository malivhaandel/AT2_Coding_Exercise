/**
 * creative coding 2026 - week 2: shape shifters
 * sketch: draw_rays_and_fade
 * iteration 6 by mali van haandel
 * debugged by Visual Studio Code
 *
 * stars persist and fade over time
 * background uses low alpha fade for trails
 */

let inverted = false;   // global colour + background state
let stars = [];         // memory array for all created stars

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 255, 0);
}

function mousePressed() {

  // toggle global colour mode
  inverted = !inverted;

  // create new star at mouse position
  stars.push({
    x: mouseX,
    y: mouseY,
    size: random(30, 180),
    burst: true,
    life: 255   // controls fade over time
  });
}

function draw() {

  // background system
  // fades + switches colour mode using alpha
  if (inverted) {
    background(0, 0, 255, 15);
  } else {
    background(255, 255, 0, 15);
  }

  noStroke();

  // render stored stars
  // loop backwards so fading removal works safely
  for (let i = stars.length - 1; i >= 0; i--) {

    let s = stars[i];

    // decrease life value over time (fade effect)
    s.life -= 2;

    // remove fully faded stars
    if (s.life <= 0) {
      stars.splice(i, 1);
      continue;
    }

    // star colour follows current mode + fade alpha
    if (inverted) {
      fill(255, 255, 0, s.life);
    } else {
      fill(0, 0, 255, s.life);
    }

    // burst scaling for visual emphasis
    let finalSize = s.burst ? s.size * 1.4 : s.size;

    drawStar(s.x, s.y, finalSize, finalSize * 0.5, 5);
  }

  // live star system
  // follows mouse and reacts to position
  let maxSize = map(mouseX, 0, width, 10, 250);
  let outer = maxSize;
  let inner = outer * 0.5;

  // live star colour matches current mode
  if (inverted) {
    fill(255, 255, 0);
  } else {
    fill(0, 0, 255);
  }

  drawStar(mouseX, mouseY, outer, inner, 5);
}

// star drawing function
// generates procedural star using alternating radii
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
  background(255, 255, 0);
}
