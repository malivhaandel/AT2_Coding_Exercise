/**
 * creative coding 2026 - week 2: shape shifters
 * sketch: draw_rays_and_fade
 * iteration by mali van haandel
 * debugged by Visual Studio Code
 *
 * stars fall with gravity + drift motion
 * stars rotate for visual energy
 */

let inverted = false;   // global mode (controls colour theme)
let stars = [];         // stores all generated stars

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 255, 0);
}

function mousePressed() {

  // toggle colour mode on click
  inverted = !inverted;

  // create new star with motion + lifecycle properties
  stars.push({
    x: mouseX,
    y: mouseY,

    vx: random(-0.3, 0.3),   // horizontal drift (wind)
    vy: random(0.5, 1.5),    // gravity / downward motion

    rot: random(TWO_PI),     // initial rotation angle
    rotSpeed: random(-0.02, 0.02), // rotation velocity

    size: random(30, 180),   // base size variation
    burst: true,             // marks click-generated stars
    life: 255                // opacity / fade value
  });
}

function draw() {

  // background system
  // fades and switches colour theme using alpha
  if (inverted) {
    background(0, 0, 255, 12);   // blue mode
  } else {
    background(255, 255, 0, 12); // yellow mode
  }

  noStroke();

  // update + render star system
  for (let i = stars.length - 1; i >= 0; i--) {

    let s = stars[i];

    // physics update (gravity + drift)
    s.x += s.vx;
    s.y += s.vy;

    // rotation update
    s.rot += s.rotSpeed;

    // fade over time
    s.life -= 1.8;

    // remove fully faded stars
    if (s.life <= 0) {
      stars.splice(i, 1);
      continue;
    }

    // transform for rotation
    push();
    translate(s.x, s.y);
    rotate(s.rot);

    // colour + transparency based on mode
    if (inverted) {
      fill(255, 255, 0, s.life);
    } else {
      fill(0, 0, 255, s.life);
    }

    // burst scaling for visual emphasis
    let finalSize = s.burst ? s.size * 1.3 : s.size;

    drawStar(0, 0, finalSize, finalSize * 0.5, 5);

    pop();
  }

  // live star system
  // follows mouse and reacts to position
  let maxSize = map(mouseX, 0, width, 10, 220);
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

// reusable star shape function
// builds star using alternating outer/inner radius points
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
