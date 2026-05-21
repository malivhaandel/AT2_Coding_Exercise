/**
 * Creative Coding 2026 - Week 6: Randomness and noise
 * made with the help of karen ann donnachie
 * iteration 4 by mali van haandel
 * debugged by Visual Studio Code
 *
 * glowing circles + occasional star shapes
 * depth-based size variation system
 * start screen " click to start "
 */

let started = false;
let paused = false;

let themeR = 0;
let themeG = 0;
let themeB = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // controls update speed of particle generation
  frameRate(20);

  // initial blank canvas state
  background(255);
}

function draw() {

  // start screen before interaction begins
  if (!started) {
    background(255);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("CLICK TO START", width / 2, height / 2);
    return;
  }

  // only update simulation when not paused
  if (!paused) {

    // fading layer creates smooth trails over time
    fill(255, 40);
    noStroke();
    rect(0, 0, width, height);

    // particle generation loop
    for (let i = 0; i < 6; i++) {

      // random position per particle
      let x = random(width);
      let y = random(height);

      // depth value controls size distribution
      let depth = random();

      // size system:
      // mostly small particles, some larger for emphasis
      let r = depth < 0.7 ? random(2, 8) : random(15, 80);

      // random colour per particle
      let cr = random(255);
      let cg = random(255);
      let cb = random(255);

      noStroke();

      // glow intensity based on depth
      let alphaBase = depth < 0.7 ? 35 : 90;

      // glow system:
      // layered circles create soft halo effect
      for (let j = 5; j > 0; j--) {
        fill(cr, cg, cb, alphaBase / j);
        circle(x, y, r * j * 1.5);
      }

      // main particle rendering
      fill(cr, cg, cb);

      // shape variation:
      // larger particles become stars, smaller remain circles
      if (r > 12) {
        push();
        translate(x, y);

        // slow rotation adds motion energy
        rotate(frameCount * 0.01);

        drawStar(0, 0, r * 0.3, r, 5);
        pop();
      } else {
        circle(x, y, r);
      }
    }
  }
}

// interaction: start and pause toggle + colour shift
function mousePressed() {
  started = true;
  paused = !paused;

  // theme values reserved for future colour control
  themeR = random(255);
  themeG = random(255);
  themeB = random(255);
}

// star drawing utility function
function drawStar(x, y, innerR, outerR, points) {

  let angle = TWO_PI / points;
  let halfAngle = angle / 2;

  beginShape();

  // build star by alternating inner and outer vertices
  for (let a = 0; a < TWO_PI; a += angle) {

    let sx = x + cos(a) * outerR;
    let sy = y + sin(a) * outerR;
    vertex(sx, sy);

    sx = x + cos(a + halfAngle) * innerR;
    sy = y + sin(a + halfAngle) * innerR;
    vertex(sx, sy);
  }

  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
