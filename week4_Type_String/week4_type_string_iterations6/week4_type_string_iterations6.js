/**
 * Creative Coding 2026 - Week 4: Advanced Typography
 * Original Concept by Andy Simionato & KarenAnn Donnachie
 * Iteration 6 by Mali van Haandel
 * Debugged by visual code studio
 *
 * selected words have white background + pink text
 * removed circle stroke
 * selected words center of canvas
 */

let allWords = [];
let para;
let myFont;
let canvas;

let selectCounter = 0;

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
  rectMode(CENTER);

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

  drawSentenceLine();
}

// builds word system from text fileeach word gets a position and a visual size
function buildWords() {

  allWords = [];

  if (!para) return;

  let words = para.join(" ").repeat(2).split(' ');

  for (let i = 0; i < words.length * 3; i++) {

    let word = words[i % words.length];

    // random initial layout position
    let x = random(width);
    let y = random(height);

    // reduced random size range (more controlled typography system)
    let size = random(30, 60);

    allWords.push(new Manifesto(word, x, y, size));
  }
}

/**
 * mouse interaction system
 * left click = select closest word
 * right click = reset full layout
 */
function mousePressed() {

  if (mouseButton === RIGHT) {
    buildWords();
    selectCounter = 0;
    return;
  }

  let closest = null;
  let record = 999999;

  // find closest word to mouse position
  for (let w of allWords) {
    let d = dist(mouseX, mouseY, w.x, w.y);

    if (d < record) {
      record = d;
      closest = w;
    }
  }

  // toggle selection and assign selection order
  if (closest && record < 80) {

    closest.selected = !closest.selected;

    if (closest.selected) {
      closest.selectOrder = selectCounter++;
    } else {
      closest.selectOrder = null;
    }
  }
}

/**
 * draws selected words as a centered sentence line
 * ordered by click sequence
 */
function drawSentenceLine() {

  let selected = allWords.filter(w => w.selected);
  if (selected.length === 0) return;

  selected.sort((a, b) => a.selectOrder - b.selectOrder);

  let spacing = max(18, 60 - selected.length * 1.1);
  let totalWidth = (selected.length - 1) * spacing;

  let startX = width / 2 - totalWidth / 2;
  let y = height / 2;

  for (let i = 0; i < selected.length; i++) {

    let w = selected[i];

    let targetX = startX + i * spacing;

    // override size when in sentence mode
    w.textSizeOverride = 60;

    w.x = lerp(w.x, targetX, 0.12);
    w.y = lerp(w.y, y, 0.12);
  }
}

/**
 * word object class
 * each word has motion, memory, and interaction behaviour
 */
class Manifesto {
  constructor(wordtext, homeX, homeY, size) {

    this.text = wordtext;

    // original position (memory anchor)
    this.homex = homeX;
    this.homey = homeY;

    // initial spawn position (expanded field)
    this.x = random(-width, width * 2);
    this.y = random(-height, height * 2);

    this.size = size;

    this.textSizeOverride = null;

    this.prevx = this.x;
    this.prevy = this.y;

    this.col = color(255, 100, 255);

    this.selected = false;
    this.selectOrder = null;
  }

  move() {

    /**
     * mouse repulsion field
     * pushes words away when cursor is close
     */
    let d = dist(mouseX, mouseY, this.x, this.y);
    let radius = 180;

    if (d < radius) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      let force = pow(1 - d / radius, 2) * 12;

      this.x += cos(angle) * force;
      this.y += sin(angle) * force;
    }

    /**
     * circle repulsion between selected words
     * prevents overlap in sentence mode
     */
    let circleRadius = 250;

    for (let other of allWords) {

      if (!other.selected || other === this) continue;

      let dx = this.x - other.x;
      let dy = this.y - other.y;

      let distVal = sqrt(dx * dx + dy * dy);

      if (distVal < circleRadius && distVal > 0) {

        dx /= distVal;
        dy /= distVal;

        this.x = other.x + dx * circleRadius;
        this.y = other.y + dy * circleRadius;
      }
    }

    //return to original layout when not selected
    if (!this.selected) {
      this.x = lerp(this.x, this.homex, 0.08);
      this.y = lerp(this.y, this.homey, 0.08);
      this.textSizeOverride = null;
    }

    //subtle jitter for organic motion
    let speed = dist(this.x, this.y, this.prevx, this.prevy);

    if (speed < 1.2) {
      let j = this.selected ? 0.05 : 0.5;
      this.x += random(-j, j);
      this.y += random(-j, j);
    }

    this.prevx = this.x;
    this.prevy = this.y;

    // keep within canvas bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {

    textSize(this.textSizeOverride || this.size);

    /**
     * selected word styling:
     * white background + pink text
     */
    if (this.selected) {
      let w = textWidth(this.text);
      let h = this.size;

      noStroke();
      fill(255);
      rect(this.x, this.y, w + 20, h + 10);
    }

    fill(this.selected ? color(255, 100, 255) : this.col);

    text(this.text, this.x, this.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
