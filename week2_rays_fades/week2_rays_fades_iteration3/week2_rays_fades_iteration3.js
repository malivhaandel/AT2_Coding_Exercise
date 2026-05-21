/**
 * creative coding 2026 - week 2: shape shifters
 * sketch: draw_rays_and_fade
 * iteration 3 by mali van haandel
 *
 * inverted when click
 * changed the opacity to 40
 */

let inverted = false;

function mousePressed() {
  inverted = !interverted;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 255, 0);
}

function draw() {

  // fading background
  // creates trail effect using low alpha overlay
  background(255, 255, 0, 40);

  // styling
  // switches between two visual states depending on mouse press
  if (mouseIsPressed) {
    fill(255, 255, 0);
    stroke(255, 0, 0);
  } else {
    fill(0, 0, 255);
    stroke(0);
  }

  noStroke;

  // size control (mouse + smooth variation)
  // mouseX controls overall scale, mouseY controls noise speed
  let maxSize = map(mouseX, 0, width, 20, 120);
  let speed = map(mouseY, 0, height, 0.01, 0.2);

  let outer = maxSize;
  let inner = outer * 0.5;

  // draw star shape around mouse position
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
  // saves image when pressing 's'
  if (key === 's') {
    saveCanvas('reactive_star.jpg');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(255, 255, 0);
}
