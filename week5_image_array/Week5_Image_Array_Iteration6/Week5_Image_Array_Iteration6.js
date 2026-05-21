/**
 * Creative Coding 2026 - Week 5: Image collage and arrays
 * made with the help of Karen ann Donnachie
 * iteration 6 by Mali van Haandel
 * debugged by Visual Studio Code
 *
 * motion trails using transparent background
 * wobble effect when hitting edges
 * layered colour tint system for depth
 */

let layer1Images = [];
let layer2Images = [];
let layer3Images = [];

let layer1Items = [];
let layer2Items = [];
let layer3Items = [];

let bgH = 0;
let tintHues = [0, 120, 240];

function preload() {

  const imageNames = [
    'bao', 'cheese', 'corn', 'cucumber',
    'donut', 'egg', 'lettuce', 'port',
    'prawn', 'strawberry', 'sushi', 'tomato'
  ];

  for (let i = 0; i < 4; i++) {
    layer1Images.push(loadImage('data/' + imageNames[i] + '.png'));
    layer2Images.push(loadImage('data/' + imageNames[i + 4] + '.png'));
    layer3Images.push(loadImage('data/' + imageNames[i + 8] + '.png'));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  // HSB includes alpha channel for motion trails
  colorMode(HSB, 360, 100, 100, 70);

  generateCollage();
}

function draw() {

  // transparent background creates motion trail effect
  background(bgH, 80, 95, 15);

  tint(tintHues[0], 80, 95);
  drawCollageItems(layer1Items);

  tint(tintHues[1], 80, 95);
  drawCollageItems(layer2Items);

  tint(tintHues[2], 80, 95);
  drawCollageItems(layer3Items);

  noTint();
}

// generate collage
function generateCollage() {

  let total = int(random(3, 5));

  layer1Items = generateCollageItems(layer1Images, 1);
  layer2Items = generateCollageItems(layer2Images, 1);
  layer3Items = generateCollageItems(layer3Images, total - 2);
}

// create moving items
function generateCollageItems(imgArray, count) {

  let items = [];

  for (let i = 0; i < count; i++) {

    let img = random(imgArray);
    let item = new CollageItem(img);

    // random spawn position
    item.x = random(width);
    item.y = random(height);

    // velocity system (continuous motion)
    item.speedX = random(-2.5, 2.5);
    item.speedY = random(-2.5, 2.5);

    // rotation system
    item.rotation = random(TWO_PI);
    item.rotationSpeed = random(-0.03, 0.03);

    // scale variation per object
    item.scaling = random(0.4, 1.5);

    items.push(item);
  }

  return items;
}

// update + draw items
function drawCollageItems(items) {

  for (let i = 0; i < items.length; i++) {

    let item = items[i];

    // mouse interaction (repel force field)
    let dx = item.x - mouseX;
    let dy = item.y - mouseY;
    let dist = sqrt(dx * dx + dy * dy);

    let mouseRadius = 200;

    if (dist < mouseRadius && dist > 0.0001) {

      let force = (mouseRadius - dist) / mouseRadius;
      let bumpStrength = 0.35;

      item.speedX += (dx / dist) * force * bumpStrength * 8;
      item.speedY += (dy / dist) * force * bumpStrength * 8;
    }

    // continuous motion update
    item.x += item.speedX;
    item.y += item.speedY;
    item.rotation += item.rotationSpeed;

    // edge repulsion + wobble trigger
    let margin = 200;

    if (item.x < margin) {
      item.speedX += 0.25 * ((margin - item.x) / margin);
      item.wobble = 0.2;
    }

    if (item.x > width - margin) {
      item.speedX -= 0.25 * ((item.x - (width - margin)) / margin);
      item.wobble = 0.2;
    }

    if (item.y < margin) {
      item.speedY += 0.25 * ((margin - item.y) / margin);
      item.wobble = 0.2;
    }

    if (item.y > height - margin) {
      item.speedY -= 0.25 * ((item.y - (height - margin)) / margin);
      item.wobble = 0.2;
    }

    // damping (smooth motion control)
    item.speedX *= 0.985;
    item.speedY *= 0.985;

    // wobble physics (spring system)
    // return force toward rest state
    item.wobbleSpeed += (0 - item.wobble) * 0.2;

    // wobble energy decay
    item.wobbleSpeed *= 0.7;

    // apply wobble velocity
    item.wobble += item.wobbleSpeed;

    push();
    translate(item.x, item.y);

    // visual wobble deformation
    let wobbleScaleX = 1 + sin(frameCount * 0.3) * item.wobble;
    let wobbleScaleY = 1 - sin(frameCount * 0.3) * item.wobble;

    // rotation influenced by wobble
    rotate(item.rotation + item.wobble * 0.5);

    // squash + stretch effect
    scale(item.scaling * wobbleScaleX, item.scaling * wobbleScaleY);

    image(item.image, 0, 0);
    pop();
  }
}

// object
function CollageItem(image) {

  this.image = image;
  this.x = 0;
  this.y = 0;

  this.speedX = 0;
  this.speedY = 0;

  this.rotation = 0;
  this.rotationSpeed = 0;

  this.scaling = 1;

  // wobble system (spring-based deformation)
  this.wobble = 0;
  this.wobbleSpeed = 0;
}

// click = new colours + regenerate
function mousePressed() {

  bgH = random(360);

  tintHues[0] = (bgH + random(-30, 30)) % 360;
  tintHues[1] = (bgH + random(90, 150)) % 360;
  tintHues[2] = (bgH + random(180, 240)) % 360;

  generateCollage();
}

// resize canvas with browser window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateCollage();
}
