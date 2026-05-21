/**
 * Creative Coding 2026 - Week 4: Advanced Typography
 * Original Concept by Andy Simionato & KarenAnn Donnachie
 * Iteration 3 by Mali van Haandel
 * Debugged by visual code studio
 *
 * motion tracking when interacting with mouse
 * white highlight
 * removed jittering
 * increase density 
 */

let allWords = []; // stores all word objects
let para;          // loaded text file
let myFont;        // custom font

function preload() {
  // load text and font before setup runs
  para = loadStrings("data/mcluhan.txt");
  myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  background(0, 0, 255);
  textFont(myFont);
  textAlign(CENTER, CENTER);

  // ensure text file is loaded
  if (para && para.length > 0) {

    // convert full text into word array and repeat for density (repeat(x) for repeat words
    let words = para.join(" ").repeat(3).split(' ');
    let density = 3;

    // create word objects
    for (let i = 0; i < words.length * density; i++) {

      let word = words[i % words.length];

      // random starting position
      let x = random(width);
      let y = random(height);

      // random font size per word instance
      let size = random(30, 100);

      allWords.push(new Manifesto(word, x, y, size));
    }
  }
}

function draw() {
  // clear frame each update
  background(0, 0, 255);

  // update and render all words
  for (let w of allWords) {
    w.move();
    w.display();
  }
}

class Manifesto {
  constructor(wordText, x, y, size) {
    this.text = wordText;

    // current position
    this.x = x;
    this.y = y;

    // original (home) position for memory behaviour
    this.homeX = x;
    this.homeY = y;

    // font size
    this.size = size;

    // previous position for motion tracking
    this.prevX = x;
    this.prevY = y;

    // current colour
    this.col = color(255);
  }

  move() {

    // calculate distance between mouse and word
    let d = dist(mouseX, mouseY, this.x, this.y);

    // mouse interaction field
    if (d < 260 && d > 5) {

      // direction away from mouse
      let angle = atan2(this.y - mouseY, this.x - mouseX);

      // force decreases with distance
      let force = map(d, 0, 260, 6, 0);

      this.x += cos(angle) * force;
      this.y += sin(angle) * force;
    }

    // return to original position (memory system)
    this.x += (this.homeX - this.x) * 0.08;
    this.y += (this.homeY - this.y) * 0.08;

    // damping to reduce micro jitter
    this.x *= 0.999;
    this.y *= 0.999;

    // calculate movement speed
    let speed = dist(this.x, this.y, this.prevX, this.prevY);

    // map speed to intensity for colour variation
    let intensity = map(speed, 0, 10, 80, 255);
    intensity = constrain(intensity, 80, 255);

    // colour system:
    // white when interacting with mouse
    // pink when in idle/motion state
    if (d < 260) {
      this.col = color(255);
    } else {
      this.col = color(255, intensity, 255);
    }

    // update previous position
    this.prevX = this.x;
    this.prevY = this.y;

    // keep within canvas bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {
    // set font size per word
    textSize(this.size);

    // apply colour
    fill(this.col);

    // render word
    text(this.text, this.x, this.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
