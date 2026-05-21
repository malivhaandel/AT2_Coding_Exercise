/**
 * Creative Coding 2026 - Week 5: Image collage
 * made with the help of Karen ann Donnachie
 * iteration by Mali van Haandel
 * debugged by Visual Studio Code
 *
 * added food name texts
 * texts behave like physics - same as images
 * images and texts share same force field logic
 * images and texts respond to edge boundary forces
 * random word generation from food-based dataset
 */

// image layers
let layer1Images = [];
let layer2Images = [];
let layer3Images = [];

// physics objects for images
let layer1Items = [];
let layer2Items = [];
let layer3Items = [];

// word physics objects
let wordItems = [];

// colour system
let bgH = 0;
let tintHues = [0, 120, 240];

// word dataset
let words = [
  "BAO","CHEESE","CORN","CUCUMBER",
  "DONUT","EGG","LETTUCE","CUSTARD",
  "PRAWN","STRAWBERRY","SUSHI","TOMATO"
];

function preload() {

  // image file names
  const imageNames = [
    "bao","cheese","corn","cucumber",
    "donut","egg","lettuce","port",
    "prawn","strawberry","sushi","tomato"
  ];

  // load images into 3 layers
  for (let i = 0; i < 4; i++) {
    layer1Images.push(loadImage("data/" + imageNames[i] + ".png"));
    layer2Images.push(loadImage("data/" + imageNames[i + 4] + ".png"));
    layer3Images.push(loadImage("data/" + imageNames[i + 8] + ".png"));
  }
}

function setup() {

  createCanvas(windowWidth, windowHeight);

  imageMode(CENTER);
  textAlign(CENTER, CENTER);

  // alpha enabled for motion trail look
  colorMode(HSB, 360, 100, 100, 70);

  generateCollage();
  generateWords();
}

function draw() {

  // soft background creates trails
  background(bgH, 80, 95, 15);

  // image layers
  tint(tintHues[0], 80, 95);
  drawItems(layer1Items);

  tint(tintHues[1], 80, 95);
  drawItems(layer2Items);

  tint(tintHues[2], 80, 95);
  drawItems(layer3Items);

  noTint();

  // text physics layer
  drawWords();
}

// image system
function generateCollage() {

  let total = int(random(3, 5));

  layer1Items = createItems(layer1Images, 1);
  layer2Items = createItems(layer2Images, 1);
  layer3Items = createItems(layer3Images, total - 2);
}

function createItems(imgArray, count) {

  let items = [];

  for (let i = 0; i < count; i++) {

    items.push({
      image: random(imgArray),
      x: random(width),
      y: random(height),
      vx: random(-2, 2),
      vy: random(-2, 2),
      rot: random(TWO_PI),
      vr: random(-0.03, 0.03),
      scale: random(0.5, 1.3),
      wobble: 0,
      wobbleSpeed: 0
    });
  }

  return items;
}

function drawItems(items) {

  for (let item of items) {

    // mouse force field
    let dx = item.x - mouseX;
    let dy = item.y - mouseY;
    let d = sqrt(dx * dx + dy * dy);

    if (d < 200 && d > 0.001) {
      let f = (200 - d) / 200;
      item.vx += (dx / d) * f * 2;
      item.vy += (dy / d) * f * 2;
      item.wobble = 0.2;
    }

    // motion update
    item.x += item.vx;
    item.y += item.vy;
    item.rot += item.vr;

    // edge force
    let m = 200;

    if (item.x < m) item.vx += 0.2;
    if (item.x > width - m) item.vx -= 0.2;
    if (item.y < m) item.vy += 0.2;
    if (item.y > height - m) item.vy -= 0.2;

    item.vx *= 0.985;
    item.vy *= 0.985;

    // wobble decay
    item.wobbleSpeed += (0 - item.wobble) * 0.2;
    item.wobbleSpeed *= 0.7;
    item.wobble += item.wobbleSpeed;

    push();
    translate(item.x, item.y);
    rotate(item.rot + item.wobble * 0.5);

    let s = 1 + sin(frameCount * 0.3) * item.wobble;
    scale(item.scale * s);

    image(item.image, 0, 0);
    pop();
  }
}

// word system
function generateWords() {

  wordItems = [];

  for (let i = 0; i < 10; i++) {

    wordItems.push({
      word: random(words),
      x: random(width),
      y: random(height),
      vx: random(-1.5, 1.5),
      vy: random(-1.5, 1.5),
      rot: random(TWO_PI),
      vr: random(-0.02, 0.02),
      size: random(18, 40),
      wobble: 0,
      wobbleSpeed: 0
    });
  }
}

function drawWords() {

  fill(0, 0, 100, 80);
  noStroke();

  for (let w of wordItems) {

    let dx = w.x - mouseX;
    let dy = w.y - mouseY;
    let d = sqrt(dx * dx + dy * dy);

    if (d < 200 && d > 0.001) {
      let f = (200 - d) / 200;
      w.vx += (dx / d) * f * 2;
      w.vy += (dy / d) * f * 2;
      w.wobble = 0.2;
    }

    w.x += w.vx;
    w.y += w.vy;
    w.rot += w.vr;

    let m = 200;

    if (w.x < m) w.vx += 0.2;
    if (w.x > width - m) w.vx -= 0.2;
    if (w.y < m) w.vy += 0.2;
    if (w.y > height - m) w.vy -= 0.2;

    w.vx *= 0.985;
    w.vy *= 0.985;

    w.wobbleSpeed += (0 - w.wobble) * 0.2;
    w.wobbleSpeed *= 0.7;
    w.wobble += w.wobbleSpeed;

    push();
    translate(w.x, w.y);
    rotate(w.rot + w.wobble * 0.5);

    textSize(w.size * (1 + sin(frameCount * 0.3) * w.wobble));
    text(w.word, 0, 0);

    pop();
  }
}

// interaction
function mousePressed() {

  bgH = random(360);

  tintHues[0] = (bgH + random(-30, 30)) % 360;
  tintHues[1] = (bgH + random(90, 150)) % 360;
  tintHues[2] = (bgH + random(180, 240)) % 360;

  generateCollage();
  generateWords();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateCollage();
  generateWords();
}
