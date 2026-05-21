/**
 * Creative Coding 2026 - Week 6: Randomness and noise
 * made with the help of karen ann donnachie
 * iteration 3 by mali van haandel
 * debugged by Visual Studio Code
 *
 * white background
 * mouse interaction - click to pause/play
 * smaller particles for more full and depth
 */

let paused = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // frame rate controls density of generated particles
  frameRate(20);

  // initial background state (white canvas)
  background(255);
}

function draw() {

  // stop rendering when paused is active
  if (paused) return;

  // fade layer using white transparency for smooth trails
  fill(255, 40);
  noStroke();
  rect(0, 0, width, height);

  // particle generation loop
  for (let i = 0; i < 6; i++) {

    // random position across canvas
    let x = random(width);
    let y = random(height);

    // depth value controls size variation
    let depth = random();

    // size system:
    // mostly small circles, some larger for depth emphasis
    let r = depth < 0.7 ? random(8, 18) : random(40, 140);

    // rgb colour generation per particle
    let cr = random(255);
    let cg = random(255);
    let cb = random(255);

    noStroke();

    // glow system:
    // layered circles create soft light aura around particle
    for (let j = 5; j > 0; j--) {
      fill(cr, cg, cb, 18 / j);
      circle(x, y, r * j * 2.2);
    }

    // core particle (main visible body)
    fill(cr, cg, cb);
    circle(x, y, r * 1.4);
  }
}

// toggle animation state on mouse press
function mousePressed() {
  paused = !paused;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
