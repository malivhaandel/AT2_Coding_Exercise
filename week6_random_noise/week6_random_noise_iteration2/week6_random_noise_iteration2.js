/**
 * Creative Coding 2026 - Week 6: Randomness and noise
 * made with the help of karen ann donnachie
 * iteration 2 by mali van haandel
 * debugged by Visual Studio Code
 *
 * layered glow effect using multiple circles
 * soft like effect
 * dense energetic motion
 */

function setup() {
  createCanvas(windowWidth, windowHeight);

  // frame rate controls how dense and fast particles appear
  frameRate(20);

  // initial background setup
  background(0);
}

function draw() {

  // fading layer creates persistent motion trails
  fill(0, 40);
  noStroke();
  rect(0, 0, width, height);

  // particle generation loop
  for (let i = 0; i < 10; i++) {

    // random position per particle
    let x = random(width);
    let y = random(height);

    // depth controls size behaviour
    let depth = random();

    // size system:
    // mostly smaller circles, sometimes larger for depth variation
    let r = depth < 0.7 ? random(5, 20) : random(30, 140);

    // rgb colour generation per particle
    let cr = random(255);
    let cg = random(255);
    let cb = random(255);

    noStroke();

    // glow system:
    // multiple layers with decreasing alpha create soft aura
    for (let j = 5; j > 0; j--) {
      fill(cr, cg, cb, 18 / j);
      circle(x, y, r * j * 2.2);
    }

    // core particle (bright centre)
    fill(cr, cg, cb);
    circle(x, y, r * 1.3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
