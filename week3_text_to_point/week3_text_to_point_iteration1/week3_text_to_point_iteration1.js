/**
 * creative coding 2026 - week 3: intro to typography
 * sketch: first_text_to_point_lines
 * iteration 1 by mali van haandel
 * debugged from visual code studio
 *
 * loaded custom font
 * changed background to pink
 * " diamond " to " star!"
 * white outline
 */

let myFont;
let points;
let sampleF;

let textString = "star!";

// preload font before setup runs
function preload() {
  myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // controls density of text outline points
  sampleF = 0.05;

  buildText();
}

/**
 * generates text outline points and centers text on canvas
 */
function buildText() {

  // measure text bounds for centering alignment
  let bounds = myFont.textBounds(textString, 0, 0, 300);

  let x = (width - bounds.w) / 2;
  let y = (height / 2) + (bounds.h / 2);

  // convert text into vector outline points
  points = myFont.textToPoints(textString, x, y, 300, {
    sampleFactor: sampleF,
    simplifyThreshold: 0
  });
}

function draw() {

  // background reset each frame (animation system)
  background(255, 80, 180);

  // loop through all text points
  for (let i = 0; i < points.length; i++) {

    let p = points[i];

    // --- line system (point to mouse connection) ---
    // draws dynamic lines from each text point to cursor
    stroke(255, 255, 255, 100);
    strokeWeight(1);
    line(p.x, p.y, mouseX, mouseY);

    // --- dot system (twinkling points) ---
    // random colour per frame for animated flicker effect
    let randomDotColor = color(
      random(150, 255),
      random(80, 200),
      random(150, 255)
    );

    fill(randomDotColor);
    stroke("white");
    strokeWeight(1);

    // draw point as small circle
    ellipse(p.x, p.y, 10, 10);
  }
}

/**
 * resize handler
 * keeps text centered when window changes
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildText();
}
