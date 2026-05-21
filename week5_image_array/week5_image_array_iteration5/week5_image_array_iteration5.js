/**
 * Creative Coding 2026 - Week 5: Image collage and arrays
 * made with the help of Karen ann Donnachie
 * iteration 5 by Mali van Haandel
 * debugged by Visual Studio Code
 *
 * reacts to mouse
 * smooth spinning
 * stronger mouse "bump" force
 * soft 200px edge boundary force field
 */

let layer1Images = [];
let layer2Images = [];
let layer3Images = [];

let layer1Items = [];
let layer2Items = [];
let layer3Items = [];

// colour system
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
  colorMode(HSB, 360, 100, 100);

  generateCollage();
}

function draw() {

  background(bgH, 80, 95);

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

    // random spawn position (full screen)
    item.x = random(width);
    item.y = random(height);

    // movement velocity (continuous motion system)
    item.speedX = random(-2.5, 2.5);
    item.speedY = random(-2.5, 2.5);

    // rotation system (smooth spin)
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


    // STRONGER mouse bump interaction
    let dx = item.x - mouseX;
    let dy = item.y - mouseY;
    let dist = sqrt(dx * dx + dy * dy);

    let mouseRadius = 200;

    if (dist < mouseRadius && dist > 0.0001) {

      let force = (mouseRadius - dist) / mouseRadius;

      // stronger impulse force
      let bumpStrength = 0.35;

      item.speedX += (dx / dist) * force * bumpStrength * 8;
      item.speedY += (dy / dist) * force * bumpStrength * 8;
    }

    // continuous motion update
    item.x += item.speedX;
    item.y += item.speedY;

    // rotation update
    item.rotation += item.rotationSpeed;

    // edge repulsion (soft 200px boundary field)
    let margin = 200;

    if (item.x < margin) {
      item.speedX += 0.25 * ((margin - item.x) / margin);
    }

    if (item.x > width - margin) {
      item.speedX -= 0.25 * ((item.x - (width - margin)) / margin);
    }

    if (item.y < margin) {
      item.speedY += 0.25 * ((margin - item.y) / margin);
    }

    if (item.y > height - margin) {
      item.speedY -= 0.25 * ((item.y - (height - margin)) / margin);
    }

    // damping (smooth motion control)
    item.speedX *= 0.985;
    item.speedY *= 0.985;

    // render image
    push();
    translate(item.x, item.y);
    rotate(item.rotation);
    scale(item.scaling);
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
}

// click = new colours + regenerate
function mousePressed() {

  bgH = random(360);

  tintHues[0] = (bgH + random(-30, 30)) % 360;
  tintHues[1] = (bgH + random(90, 150)) % 360;
  tintHues[2] = (bgH + random(180, 240)) % 360;

  generateCollage();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateCollage();
}
