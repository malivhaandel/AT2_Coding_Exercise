/**
 * creative coding 2026 - week 2: shape shifters
 * sketch: draw_rays_and_fade
 * iteration 2 by mali van haandel
 * debugged by Visual Studio Code
 *
 * inverted when click
 * changed the opacity to 40
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
  // fading background
  background(255, 255, 0, 40);

  // styling
  if (mouseIsPressed) {
    fill(255, 255, 0);
    stroke(255, 0, 0);
  } else {
    fill(0, 0, 255);
    stroke(0);
  }

  // optional inversion (not fully used visually yet, but kept for structure)
  if (inverted) {
    fill(0, 0, 255);
    stroke(255, 0, 0);
  }

  noStroke();

  // size control (mouse + smooth random)
  let maxSize = map(mouseX, 0, width, 20, 120);
  let speed = map(mouseY, 0, height, 0.01, 0.2);

  let outer = noise(frameCount * speed) * maxSize;
  let inner = outer * 0.5;

  // draw star
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
  if (key === 's') {
    saveCanvas('reactive_star.jpg');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(255, 255, 0); 
}
