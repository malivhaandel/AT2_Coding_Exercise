/**
 * Creative Coding 2026 - Week 5: Image collage and arrays
 * made with the help of Karen ann Donnachie
 * iteration 4 by Mali van Haandel
 * debugged by Visual Studio Code
 *
 * images move around and rotare continuously
 * dynamic floating collage system
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

  // generates first collage layout
  generateCollage();
}

function draw() {

  // background uses base hue
  background(bgH, 80, 95);

  // apply tint to each layer before drawing

  tint(tintHues[0], 80, 95);
  drawCollageItems(layer1Items);

  tint(tintHues[1], 80, 95);
  drawCollageItems(layer2Items);

  tint(tintHues[2], 80, 95);
  drawCollageItems(layer3Items);

  // reset tint so it does not affect other drawings
  noTint();
}

// generate collage
function generateCollage() {

  let total = int(random(3, 5));

  let count1 = 1;
  let count2 = 1;
  let count3 = total - 2;

  layer1Items = generateCollageItems(layer1Images, count1, width / 2, height / 2, width / 3, height / 4, 0.5, 1.5);
  layer2Items = generateCollageItems(layer2Images, count2, width / 2, height / 2, width / 2, height / 3, 0.3, 1.2);
  layer3Items = generateCollageItems(layer3Images, count3, width / 2, height / 2, width / 2, height, 0.4, 1.0);
}

// create moving + spinning items
function generateCollageItems(imgArray, count, centerX, centerY, rangeX, rangeY, minScale, maxScale) {

  let items = [];

  for (let i = 0; i < count; i++) {

    let img = random(imgArray);
    let item = new CollageItem(img);

    // starting position of each image
    item.x = centerX + random(-rangeX / 2, rangeX / 2);
    item.y = centerY + random(-rangeY / 2, rangeY / 2);

    // movement speed in x and y direction
    item.speedX = random(-1.5, 1.5);
    item.speedY = random(-1.5, 1.5);

    // rotation system
    item.rotation = random(TWO_PI);
    item.rotationSpeed = random(-0.02, 0.02);

    // size variation
    item.scaling = random(minScale, maxScale);

    items.push(item);
  }

  return items;
}

// update + draw items
function drawCollageItems(items) {

  for (let i = 0; i < items.length; i++) {

    let item = items[i];

    // update movement every frame
    item.x += item.speedX;
    item.y += item.speedY;

    // update rotation every frame
    item.rotation += item.rotationSpeed;

    // bounce when hitting edges
    let margin = 100;

    if (item.x < margin || item.x > width - margin) {
      item.speedX *= -1;
    }

    if (item.y < margin || item.y > height - margin) {
      item.speedY *= -1;
    }

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

// click = new system + new colours
function mousePressed() {

  setup();
  redraw();

  // new background colour each click
  bgH = random(360);

  // related colour system per layer
  tintHues[0] = (bgH + random(-30, 30)) % 360;
  tintHues[1] = (bgH + random(90, 150)) % 360;
  tintHues[2] = (bgH + random(180, 240)) % 360;
}

// resize canvas with browser window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
  redraw();
}
