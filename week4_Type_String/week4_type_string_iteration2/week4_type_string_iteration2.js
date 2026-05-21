/**
 * Creative Coding 2026 - Week 4: Advanced Typography
 * Original Concept by Andy Simionato & KarenAnn Donnachie
 * Iteration 2 by Mali van Haandel
 * Debugged by Visual Code Studio
 *
 * words have random sizes
 * words remember their original positions and return over time
 * words density increase
 */

let allWords = []; // stores all word objects in the system
let para;          // holds loaded text file
let myFont;        // custom font

function preload() {
  // load text file and font before setup runs
  para = loadStrings("data/mcluhan.txt");
  myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // base styling for text system
  background(0, 0, 255); // blue background
  fill(255);             // white text
  textFont(myFont);      // apply custom font
  textAlign(CENTER, CENTER);

  // only run if text file loads correctly
  if (para && para.length > 0) {

    // combine text into one stream and repeat for density
    let words = para.join(" ").repeat(3).split(' ');

    // create a Manifesto object for each word
    for (let i = 0; i < words.length; i++) {

      // random starting position for each word
      let x = random(width);
      let y = random(height);

      // random size for visual hierarchy and variation
      let size = random(12, 80);

      // store word as independent object
      allWords.push(new Manifesto(words[i], x, y, size));
    }
  }
}

function draw() {
  // redraw background every frame to remove trails
  background(0, 0, 255);

  // update and render each word object
  for (let w of allWords) {
    w.move();
    w.display();
  }
}

class Manifesto {

  constructor(wordText, x, y, size) {
    this.text = wordText;

    // current position (changes every frame)
    this.x = x;
    this.y = y;

    // home position (stored for return behaviour)
    this.homeX = x;
    this.homeY = y;

    // individual word size
    this.size = size;
  }

  move() {

    // distance between mouse and word
    let d = dist(mouseX, mouseY, this.x, this.y);

    // mouse interaction zone (repulsion force)
    if (d < 200) {

      // calculate direction away from mouse
      let angle = atan2(this.y - mouseY, this.x - mouseX);

      // push word away from mouse
      this.x += cos(angle) * 4;
      this.y += sin(angle) * 4;

    } else {

      // return to original position over time (soft memory system)
      this.x += (this.homeX - this.x) * 0.08;
      this.y += (this.homeY - this.y) * 0.08;

      // small random drift for organic movement
      this.x += random(-0.5, 0.5);
      this.y += random(-0.5, 0.5);
    }

    // keep words inside canvas bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {

    // set individual text size per word
    textSize(this.size);

    // draw word on screen
    text(this.text, this.x, this.y);
  }
}
  // keep canvas responsive to window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
