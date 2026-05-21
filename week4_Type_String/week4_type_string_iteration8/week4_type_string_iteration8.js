/**
 * Creative Coding 2026 - Week 4: Advanced Typography
 * Original Concept by Andy Simionato & KarenAnn Donnachie
 * Iteration 8 by Mali van Haandel
 * debugged Visual Code Studio
 *
 * background changes colour when click on background
 * also chnanges texts like accents 
 */

let allWords = [];
let para;
let fontNormal;
let fontSelected;
let selectCounter = 0;

let paletteIndex = 0;

// colour palette system (background / primary / accent)
let palettes = [
  { bg: [20, 20, 255], primary: [255, 100, 255], accent: [255, 255, 255] },
  { bg: [255, 40, 80], primary: [80, 255, 200], accent: [255, 255, 255] },
  { bg: [40, 255, 120], primary: [255, 80, 200], accent: [255, 255, 255] },
  { bg: [120, 60, 255], primary: [255, 200, 80], accent: [255, 255, 255] }
];

function preload() {
  para = loadStrings("data/mcluhan.txt");
  fontNormal = loadFont("data/BootzyTM.ttf");
  fontSelected = loadFont("data/soopafre.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  buildWords();
}

// returns active colour palette
function currentPalette() {
  return palettes[paletteIndex % palettes.length];
}

function mousePressed() {

  if (mouseButton === RIGHT) {
    buildWords();
    selectCounter = 0;
    return;
  }

  let clickedOnWord = false;

  let closest = null;
  let record = 999999;

  // find closest word
  for (let w of allWords) {
    let d = dist(mouseX, mouseY, w.x, w.y);
    if (d < record) {
      record = d;
      closest = w;
    }
  }

  // toggle selection
  if (closest && record < 80) {
    clickedOnWord = true;

    closest.selected = !closest.selected;

    if (closest.selected) {
      closest.selectOrder = selectCounter++;
    } else {
      closest.selectOrder = null;
    }
  }

  // background click → cycle palette
  if (!clickedOnWord) {
    paletteIndex++;
  }
}

function draw() {
  let pal = currentPalette();

  background(pal.bg);

  for (let w of allWords) {
    w.move();
    w.display(pal);
  }

  drawSentenceLine(pal);
}

// build word system
function buildWords() {
  allWords = [];
  if (!para) return;

  let words = para.join(" ").repeat(3).split(' ');

  for (let i = 0; i < words.length * 3; i++) {
    let word = words[i % words.length];

    allWords.push(
      new Manifesto(
        word,
        random(width),
        random(height),
        random(30, 100)
      )
    );
  }
}

 //sentence line system (selected words)
function drawSentenceLine(pal) {

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

    w.textSizeOverride = 40;

    // lock into sentence formation
    w.x = lerp(w.x, targetX, 0.15);
    w.y = lerp(w.y, y, 0.15);
  }
}

/**
 * word object system
 */
class Manifesto {

  constructor(wordtext, homeX, homeY, size) {
    this.text = wordtext;

    // memory anchor (return position)
    this.homex = homeX;
    this.homey = homeY;

    // spawn position (expanded field)
    this.x = random(width);
    this.y = random(height);

    this.size = size;
    this.textSizeOverride = null;

    this.prevx = this.x;
    this.prevy = this.y;

    this.selected = false;
    this.selectOrder = null;

    // star rotation value
    this.rotation = random(TWO_PI);
  }

  move() {

    // unselected words respond to mouse field
    if (!this.selected) {

      let d = dist(mouseX, mouseY, this.x, this.y);
      let radius = 180;

      // mouse repulsion
      if (d < radius) {
        let angle = atan2(this.y - mouseY, this.x - mouseX);
        let force = pow(1 - d / radius, 2) * 12;

        this.x += cos(angle) * force;
        this.y += sin(angle) * force;
      }

      // return to home position
      this.x = lerp(this.x, this.homex, 0.08);
      this.y = lerp(this.y, this.homey, 0.08);

      // jitter (idle motion)
      this.x += random(-0.6, 0.6);
      this.y += random(-0.6, 0.6);

      this.textSizeOverride = null;
    }

    // selected word collision system
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

    // bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display(pal) {

    textFont(this.selected ? fontSelected : fontNormal);
    textSize(this.textSizeOverride || this.size);

    let d = dist(mouseX, mouseY, this.x, this.y);
    let isHover = d < 120;

    let primary = color(pal.primary);
    let accent = color(pal.accent);

    if (this.selected) {
      push();
      translate(this.x, this.y);
      rotate(this.rotation);

      let outer = this.size * 1.8;
      let inner = this.size * 0.9;

      noStroke();
      fill(accent);

      beginShape();
      for (let i = 0; i < 10; i++) {
        let angle = map(i, 0, 10, 0, TWO_PI);
        let r = i % 2 === 0 ? outer : inner;
        vertex(cos(angle) * r, sin(angle) * r);
      }
      endShape(CLOSE);

      pop();
    }

    // text colour system
    if (this.selected) {
      fill(primary);
    } else {
      fill(isHover ? accent : primary);
    }

    // draw word
    text(this.text, this.x, this.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
