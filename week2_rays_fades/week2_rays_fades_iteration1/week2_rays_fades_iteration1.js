/**
 * creative coding 2026 - week 2: shape shifters
 * sketch: draw_rays_and_fade
 * iteration 1 by mali van haandel
 * debugged by Visual Studio Code
 *
 * star shaped mouse
 * size reacts to mouse position
 * uses fading background to create trails
 */

function setup() {
  createCanvas(windowWidth, windowHeight);

  // start with solid yellow background
  background(255, 255, 0);
}

function draw() {

  // fading background
  // creates trail effect using transparent overlay
  background(255, 255, 0, 6);

  // styling
  if (mouseIsPressed) {
    fill(255, 255, 0);
    stroke(255, 0, 0);
  } else {
    fill(0, 0, 255);
    stroke(0);
  }

  strokeWeight(2);

  // size control (mouse + noise)
  let maxSize = map(mouseX, 0, width, 20, 120);

  let speed = map(mouseY, 0, height, 0.005, 0.03);
  let n = noise(frameCount * speed);

  let outer = n * maxSize;
  let inner = outer * 0.5;

  // draw star (replaces original circle)
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
  // save canvas when s is pressed
  if (key === 's') {
    saveCanvas('reactive_star.jpg');
  }
}

// reset background on resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(255, 255, 0);
}
