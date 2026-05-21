/**
 * creative coding 2026 - week 2: shape shifters
 * sketch: draw_rays_and_fade
 * iteration 4 by mali van haandel
 *
 * background + star invert on click
 * opacity creates soft fading trail effect
 * click toggles colour state
 */

let inverted = false;

function mousePressed() {
  inverted = !inverted;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 255, 0);
}

function draw() {

  // background system
  // toggles between two colour states using inverted flag
  if (inverted) {
    background(0, 0, 255, 40); // blue fade
  } else {
    background(255, 255, 0, 40); // yellow fade
  }

  noStroke();

  // star colour system
  // star always contrasts background state
  if (inverted) {
    fill(255, 255, 0); // yellow star
  } else {
    fill(0, 0, 255); // blue star
  }

  // size control
  // mouseX controls overall scale of the star
  let maxSize = map(mouseX, 0, width, 20, 120);
  let outer = maxSize;
  let inner = outer * 0.5;

  // star construction
  // alternating outer/inner radius creates star shape
  beginShape();
  for (let i = 0; i < 10; i++) {

    let angle = i * PI / 5;
    let r = (i % 2 === 0) ? outer : inner;

    let x = mouseX + cos(angle) * r;
    let y = mouseY + sin(angle) * r;

    vertex(x, y);
  }
  endShape(CLOSE);
}

function keyPressed() {
  // save canvas as image when pressing 's'
  if (key === 's') {
    saveCanvas('reactive_star.jpg');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // reset background on resize
  background(255, 255, 0);
}
