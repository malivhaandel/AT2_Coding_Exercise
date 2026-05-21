/**
 * Creative Coding 2026 - Week 4: Advanced Typography
 * Original Concept by Andy Simionato & KarenAnn Donnachie
 * Iteration 1 by Mali van Haandel
 * Debugged by Visual Code Studio
 *
 * custom font is loaded
 * backgrounf chnaged to blue
 */

let allWords = []; // stores all word objects
let para;          // stores loaded text file
let myFont;        // custom font

function preload() {
  // load text file into an array of lines
  para = loadStrings("data/mcluhan.txt");

  // load custom font
  myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  // create full screen canvas
  createCanvas(windowWidth, windowHeight);

  // background setup
  background(0, 0, 255);

  fill(255);
  textSize(24);
  textFont(myFont);
  textAlign(CENTER, CENTER);

  // check text loaded correctly
  if (para && para.length > 0) {

    // split first line into words
    let words = para[0].split(' ');

    // create a word object for each word in the text
    for (let i = 0; i < words.length; i++) {

      let x = random(width);
      let y = random(height);

      let newWord = new Manifesto(words[i], x, y);
      allWords.push(newWord);
    }

  } else {
    console.error("Text file not loaded!");
  }
}

function draw() {
  // redraw background each frame
  background(0, 0, 255);

  // update and display all words
  for (let i = 0; i < allWords.length; i++) {
    allWords[i].move();
    allWords[i].display();
  }
}

/**
 * Word object class
 * Each word has position and movement behaviour
 */
class Manifesto {

  constructor(wordText, x, y) {
    this.text = wordText;
    this.x = x;
    this.y = y;
  }

  // movement behaviour for each word
  move() {

    // distance from mouse to word
    let d = dist(mouseX, mouseY, this.x, this.y);

    // if mouse is close, word moves away
    if (d < 100) {

      if (mouseX < this.x) { this.x += 5; }
      if (mouseX > this.x) { this.x -= 5; }
      if (mouseY < this.y) { this.y += 5; }
      if (mouseY > this.y) { this.y -= 5; }

    } else {

      // otherwise small random movement
      this.x += random(-1, 1);
      this.y += random(-1, 1);
    }

    // keep words inside canvas
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  // draw word on screen
  display() {
    text(this.text, this.x, this.y);
  }
}

// resize canvas when window changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
