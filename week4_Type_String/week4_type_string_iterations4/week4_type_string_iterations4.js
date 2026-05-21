/**
 * Creative Coding 2026 - Week 4: Advanced Typography
 * Original Concept by Andy Simionato & KarenAnn Donnachie
 * Iteration 4 by Mali van Haandel
 * Debugged by visual code studio
 *
 * word clustering system to center
 * left click selects words - turns white
 * right click to redraw words
 * reintroduced jittering
 */

let allWords = [];
let para;
let myFont;
let canvas;

function preload() {
  para = loadStrings("data/mcluhan.txt");
  myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  // disable browser context menu on canvas (needed for right-click interaction)
  canvas.elt.oncontextmenu = (e) => e.preventDefault();

  textFont(myFont);
  textAlign(CENTER, CENTER);

  buildWords();
}

function draw() {
  background(0, 0, 255);

  // update + render all word objects
  for (let w of allWords) {
    w.move();
    w.display();
  }
}
// rebuilds full word system (used for reset + initialization)
function buildWords() {

  allWords = [];

  if (!para) return;

  // convert full text into repeated word stream for density control
  let words = para.join(" ").repeat(3).split(' ');

  for (let i = 0; i < words.length * 3; i++) {

    let word = words[i % words.length];

    // random initial placement
    let x = random(width);
    let y = random(height);

    // random font size per instance (visual hierarchy)
    let size = random(30, 100);

    allWords.push(new Manifesto(word, x, y, size));
  }
}

function mousePressed() {

  // right click resets system
  if (mouseButton === RIGHT) {
    buildWords();
    return;
  }

  // find closest word to mouse
  let closest = null;
  let record = 999999;

  for (let w of allWords) {
    let d = dist(mouseX, mouseY, w.x, w.y);

    if (d < record) {
      record = d;
      closest = w;
    }
  }

  // toggle selection if close enough
  if (closest && record < 80) {
    closest.selected = !closest.selected;
  }
}
class Manifesto {
  constructor(wordtext, x, y, size) {

    this.text = wordtext;

    // current position
    this.x = x;
    this.y = y;

    // memory anchors (return behaviour)
    this.homex = x;
    this.homey = y;

    // gravity target position (soft clustering behaviour)
    this.targetX = random(width);
    this.targetY = random(height);

    // font size
    this.size = size;

    // previous position for motion tracking
    this.prevx = x;
    this.prevy = y;

    // base colour (idle state)
    this.col = color(255, 100, 255);

    // selection state
    this.selected = false;
  }

  move() {

    // distance from mouse
    let d = dist(mouseX, mouseY, this.x, this.y);

    // mouse repulsion field
    if (d < 120) {

      let angle = atan2(this.y - mouseY, this.x - mouseX);
      let force = map(d, 0, 120, 6, 0);

      this.x += cos(angle) * force;
      this.y += sin(angle) * force;
    }

    // memory return system (soft easing toward original position)
    this.x += (this.homex - this.x) * 0.05;
    this.y += (this.homey - this.y) * 0.05;

    // gravity system (gentle clustering behaviour)
    this.x += (this.targetX - this.x) * 0.01;
    this.y += (this.targetY - this.y) * 0.01;

    // motion tracking (used for jitter control)
    let speed = dist(this.x, this.y, this.prevx, this.prevy);

    // low-speed jitter (adds organic instability)
    if (speed < 1.2) {
      this.x += random(-0.6, 0.6);
      this.y += random(-0.6, 0.6);
    }

    // store previous position
    this.prevx = this.x;
    this.prevy = this.y;

    // keep within canvas bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {

    // font size per word instance
    textSize(this.size);

    // selection overrides colour
    if (this.selected) {
      fill(255);
    } else {
      fill(this.col);
    }

    // render word
    text(this.text, this.x, this.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
