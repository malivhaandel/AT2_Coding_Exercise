/**
 * Creative Coding 2026 - Week 4: Advanced Typography
 * Original Concept by Andy Simionato & KarenAnn Donnachie
 * Iteration 5 by Mali van Haandel
 * Debugged by visual code studio
 *
 * selected words form circular interaction fields
 * interaction fields crease a repulsion
 * reselected to default state
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

  // disable browser context menu for right-click interaction
  canvas.elt.oncontextmenu = (e) => e.preventDefault();

  textFont(myFont);
  textAlign(CENTER, CENTER);

  buildWords();
}

function draw() {
  background(0, 0, 255);

  // render selected words above unselected words
  let sorted = [...allWords].sort((a, b) => a.selected - b.selected);

  for (let w of sorted) {
    w.move();
    w.display();
  }
}

/**
 * builds the word system from the loaded text
 * each word is assigned a position, memory anchor, and size
 */
function buildWords() {

  allWords = [];

  if (!para) return;

  let words = para.join(" ").repeat(3).split(' ');

  for (let i = 0; i < words.length * 3; i++) {

    let word = words[i % words.length];

    let homeX = random(width);
    let homeY = random(height);

    let size = random(30, 100);

    allWords.push(new Manifesto(word, homeX, homeY, size));
  }
}

/**
 * mouse interaction
 * left click toggles selection
 * right click rebuilds the system
 */
function mousePressed() {

  if (mouseButton === RIGHT) {
    buildWords();
    return;
  }

  let closest = null;
  let record = 999999;

  for (let w of allWords) {
    let d = dist(mouseX, mouseY, w.x, w.y);

    if (d < record) {
      record = d;
      closest = w;
    }
  }

  if (closest && record < 80) {
    closest.selected = !closest.selected;
  }
}

class Manifesto {
  constructor(wordtext, homeX, homeY, size) {

    this.text = wordtext;

    // memory anchor position
    this.homex = homeX;
    this.homey = homeY;

    // spawn position (expanded field for dynamic entry)
    this.x = random(-width, width * 2);
    this.y = random(-height, height * 2);

    this.size = Number(size);

    this.prevx = this.x;
    this.prevy = this.y;

    // default idle colour
    this.col = color(255, 100, 255);

    this.selected = false;
  }

  move() {

    // distance from mouse
    let d = dist(mouseX, mouseY, this.x, this.y);

    let radius = 120;

    // mouse repulsion field
    if (d < radius) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      let force = map(d, 0, radius, 6, 0);

      this.x += cos(angle) * force;
      this.y += sin(angle) * force;
    }

    // selected-word interaction field
    let circleRadius = 250;

    for (let other of allWords) {

      if (!other.selected || other === this) continue;

      let dx = this.x - other.x;
      let dy = this.y - other.y;

      let d2 = sqrt(dx * dx + dy * dy);

      if (d2 < circleRadius && d2 > 0) {

        dx /= d2;
        dy /= d2;

        this.x = other.x + dx * circleRadius;
        this.y = other.y + dy * circleRadius;
      }
    }

    // memory return behaviour
    let pull = this.selected ? 0.02 : 0.08;

    this.x = lerp(this.x, this.homex, pull);
    this.y = lerp(this.y, this.homey, pull);

    // micro jitter for organic motion
    let speed = dist(this.x, this.y, this.prevx, this.prevy);

    if (speed < 1.2) {
      let j = this.selected ? 0.1 : 0.5;
      this.x += random(-j, j);
      this.y += random(-j, j);
    }

    this.prevx = this.x;
    this.prevy = this.y;

    // keep within bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {

    textSize(this.size);

    // selected state highlight
    if (this.selected) {
      fill(255);
    } else {
      fill(this.col);
    }

    text(this.text, this.x, this.y);

    // visual debug for selected interaction radius
    if (this.selected) {
      noFill();
      stroke(255, 80);
      circle(this.x, this.y, 240);
      noStroke();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
