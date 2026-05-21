/**
 * Creative Coding 2026 - Week 4: Advanced Typography
 * Original Concept by Andy Simionato & KarenAnn Donnachie
 * Iteration 7 by Mali van Haandel
 * debugged by Visual Studio Code
 *
 * selected words = star highlight + pink text styling
 * 
 */

let allWords = [];
let para;
let fontNormal;
let fontSelected;
let selectCounter = 0;

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

function draw() {
  background(0, 0, 255);

  let sorted = [...allWords].sort((a, b) => a.selected - b.selected);

  for (let w of sorted) {
    w.move();
    w.display();
  }

  drawSentenceLine();
}

// DENSE FIELD (kept messy + organic)
function buildWords() {
  allWords = [];
  if (!para) return;

  let words = para.join(" ").repeat(3).split(' ');
  let density = 3;

  for (let i = 0; i < words.length * density; i++) {
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

// selection system
function mousePressed() {
  if (mouseButton === RIGHT) {
    buildWords();
    selectCounter = 0;
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

    if (closest.selected) {
      closest.selectOrder = selectCounter++;
    } else {
      closest.selectOrder = null;
    }
  }
}

//sentence line
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

    w.textSizeOverride = 40;

    w.x = lerp(w.x, targetX, 0.12);
    w.y = lerp(w.y, y, 0.12);
  }
}

// WORD CLASS
class Manifesto {
  constructor(wordtext, homeX, homeY, size) {
    this.text = wordtext;

    this.homex = homeX;
    this.homey = homeY;

    this.x = random(-width, width * 2);
    this.y = random(-height, height * 2);

    this.size = size;
    this.textSizeOverride = null;

    this.prevx = this.x;
    this.prevy = this.y;

    this.selected = false;
    this.selectOrder = null;
// rotation used for star shape animation (adds visual variation per word)
    this.rotation = random(TWO_PI);
  }

  move() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    let radius = 180;

    // mouse repulsion
    if (d < radius) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      let force = pow(1 - d / radius, 2) * 12;

      this.x += cos(angle) * force;
      this.y += sin(angle) * force;
    }

    // selected repulsion
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

    // return home
    if (!this.selected) {
      this.x = lerp(this.x, this.homex, 0.08);
      this.y = lerp(this.y, this.homey, 0.08);

      // subtle jitter ONLY for unselected words
      this.x += random(-0.6, 0.6);
      this.y += random(-0.6, 0.6);

      this.textSizeOverride = null;
    }

    this.prevx = this.x;
    this.prevy = this.y;

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {
    textFont(this.selected ? fontSelected : fontNormal);
    textSize(this.textSizeOverride || this.size);

    let d = dist(mouseX, mouseY, this.x, this.y);
    let isHover = d < 120;

    // STAR highlight for selected words
    if (this.selected) {
      push();
      translate(this.x, this.y);
 // apply per-word rotation (gives each star unique motion feel)
      rotate(this.rotation);
// star size scales with word size for consistency
      let outer = this.size * 1.8; // outer star radius (points)
      let inner = this.size * 0.9; // inner star radius (indent)

      noStroke();
      fill(255);
// draw procedural star using alternating vertices
      beginShape();
      for (let i = 0; i < 10; i++) {
        let angle = map(i, 0, 10, 0, TWO_PI);
        // alternate between outer and inner radius
        let r = i % 2 === 0 ? outer : inner;
        vertex(cos(angle) * r, sin(angle) * r);
      }
      endShape(CLOSE);

      pop();
    }

    // text colors
    if (this.selected) {
      fill(color(255, 100, 255));
    } else {
      fill(isHover ? 255 : color(255, 100, 255));
    }

    text(this.text, this.x, this.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
