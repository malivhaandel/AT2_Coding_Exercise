/**
 * Creative Coding 2026 - Week 6: Randomness and noise
 * made with the help of karen ann donnachie
 * iteration 1 by Mali van Haandel
 * debugged by Visual Studio Code
 *
 * size variation fro depth
 * colours and position are generated per frame
 */

function setup() {
  createCanvas(windowWidth, windowHeight);

  // slows generation slightly for smoother visual reading
  frameRate(20);

  // initial background fill before particles appear
  background(0);
}

function draw() {

  // fade previous frame using translucent rectangle
  // this creates persistent trails instead of hard clearing
  fill(0, 40);
  noStroke();
  rect(0, 0, width, height);

  // generate multiple particles per frame
  // increasing this = denser visual field
  for (let i = 0; i < 10; i++) {

    // random position across full canvas
    let x = random(width);
    let y = random(height);

    // depth value controls probability of size variation
    // acts like pseudo-3d distribution
    let depth = random();

    // most circles are small, some become large "foreground" particles
    let r = depth < 0.7 ? random(2, 8) : random(15, 80);

    // rgb colour generation for full spectrum randomness
    let cr = random(255);
    let cg = random(255);
    let cb = random(255);

    fill(cr, cg, cb);
    noStroke();

    // draw particle
    circle(x, y, r);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
