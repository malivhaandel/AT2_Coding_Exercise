/*
 * creative coding 2026 - week 5: image collage and arrays
 * made with the help of karen ann donnachie
 * iteration 8 by mali van haandel
 * debugged by visual studio code
 *
 * interactive physics system
 * images + words behave as particles
 * mouse creates attraction force field
 * click triggers explosion shockwave
 */

let layer1Images = [];
let layer2Images = [];
let layer3Images = [];

let layer1Items = [];
let layer2Items = [];
let layer3Items = [];

let wordItems = [];

let bgH = 0;
let tintHues = [0, 120, 240];

let words = [
  'BAO','CHEESE','CORN','CUCUMBER',
  'DONUT','EGG','LETTUCE','CUSTARD',
  'PRAWN','STRAWBERRY','SUSHI','TOMATO'
];

let shockwaveX = 0;
let shockwaveY = 0;
let shockwavePower = 0;

function preload() {

  const imageNames = [
    'bao', 'cheese', 'corn', 'cucumber',
    'donut', 'egg', 'lettuce', 'port',
    'prawn', 'strawberry', 'sushi', 'tomato'
  ];

  // load images into three visual layers
  for (let i = 0; i < 4; i++) {
    layer1Images.push(loadImage('data/' + imageNames[i] + '.png'));
    layer2Images.push(loadImage('data/' + imageNames[i + 4] + '.png'));
    layer3Images.push(loadImage('data/' + imageNames[i + 8] + '.png'));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  colorMode(HSB, 360, 100, 100, 70);

  // initialise particle systems
  generateCollage();
  generateWords();
}

function draw() {

  // background fade creates motion trail effect
  background(bgH, 80, 95, 15);

  // render image physics layers with colour tinting
  tint(tintHues[0], 80, 95);
  drawItems(layer1Items);

  tint(tintHues[1], 80, 95);
  drawItems(layer2Items);

  tint(tintHues[2], 80, 95);
  drawItems(layer3Items);

  noTint();

  // render typography physics layer
  drawWords();

  // render on-screen instructions
  drawHUD();

  // decay shockwave over time
  shockwavePower *= 0.92;
}

// on-screen instruction display
function drawHUD() {

  push();
  fill(0, 0, 100, 85);
  noStroke();
  textSize(14);
  textAlign(RIGHT, TOP);

  text(
    "MOUSE: PULL\nCLICK: EXPLOSION",
    width - 20,
    20
  );

  pop();
}

// mouse attraction force field (shared by images + words)
function applyMouseForce(obj) {

  let dx = mouseX - obj.x;
  let dy = mouseY - obj.y;
  let d = sqrt(dx * dx + dy * dy);

  let radius = 450;

  // only apply force within radius
  if (d < radius && d > 0.001) {

    let force = pow((radius - d) / radius, 2);

    obj.vx += (dx / d) * force * 1.2;
    obj.vy += (dy / d) * force * 1.2;

    obj.wobble = 0.12;
  }
}

// shockwave explosion force from click
function applyShockwave(obj) {

  if (shockwavePower <= 0.01) return;

  let dx = obj.x - shockwaveX;
  let dy = obj.y - shockwaveY;
  let d = sqrt(dx * dx + dy * dy);

  let radius = 600;

  // radial explosion falloff
  if (d < radius && d > 0.001) {

    let force = pow((radius - d) / radius, 2);

    obj.vx += (dx / d) * force * shockwavePower * 10;
    obj.vy += (dy / d) * force * shockwavePower * 10;

    obj.wobble = 0.25;
  }
}

// image particle system rendering
function drawItems(items) {

  for (let item of items) {

    // apply shared physics forces
    applyMouseForce(item);
    applyShockwave(item);

    // integrate velocity into position
    item.x += item.vx;
    item.y += item.vy;
    item.rot += item.vr;

    // soft boundary force field
    let m = 200;

    if (item.x < m) item.vx += 0.2;
    if (item.x > width - m) item.vx -= 0.2;
    if (item.y < m) item.vy += 0.2;
    if (item.y > height - m) item.vy -= 0.2;

    // velocity damping for stability
    item.vx *= 0.985;
    item.vy *= 0.985;

    // wobble spring system (smooth oscillation)
    item.wobbleSpeed += (0 - item.wobble) * 0.2;
    item.wobbleSpeed *= 0.6;
    item.wobble += item.wobbleSpeed;

    push();
    translate(item.x, item.y);

    rotate(item.rot + item.wobble * 0.3);

    let s = 1 + sin(frameCount * 0.2) * item.wobble * 0.5;

    scale(item.scale * s);

    image(item.image, 0, 0);

    pop();
  }
}

// typography particle system rendering
function drawWords() {

  fill(0, 0, 100, 80);
  noStroke();

  for (let w of wordItems) {

    applyMouseForce(w);
    applyShockwave(w);

    w.x += w.vx;
    w.y += w.vy;
    w.rot += w.vr;

    let m = 200;

    // edge boundary interaction
    if (w.x < m) w.vx += 0.2;
    if (w.x > width - m) w.vx -= 0.2;
    if (w.y < m) w.vy += 0.2;
    if (w.y > height - m) w.vy -= 0.2;

    w.vx *= 0.985;
    w.vy *= 0.985;

    // wobble system for text
    w.wobbleSpeed += (0 - w.wobble) * 0.2;
    w.wobbleSpeed *= 0.6;
    w.wobble += w.wobbleSpeed;

    push();
    translate(w.x, w.y);

    rotate(w.rot + w.wobble * 0.3);

    textSize(w.size * (1 + sin(frameCount * 0.2) * w.wobble * 0.5));
    text(w.word, 0, 0);

    pop();
  }
}

// mouse click triggers explosion + regeneration
function mousePressed() {

  bgH = random(360);

  tintHues[0] = (bgH + random(-30, 30)) % 360;
  tintHues[1] = (bgH + random(90, 150)) % 360;
  tintHues[2] = (bgH + random(180, 240)) % 360;

  shockwaveX = mouseX;
  shockwaveY = mouseY;
  shockwavePower = 1.5;

  generateCollage();
  generateWords();
}

// generate image collage particles
function generateCollage() {

  let total = int(random(3, 5));

  layer1Items = createItems(layer1Images, 1);
  layer2Items = createItems(layer2Images, 1);
  layer3Items = createItems(layer3Images, total - 2);
}

// create physics-enabled image objects
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

// generate word particles
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateCollage();
  generateWords();
}
