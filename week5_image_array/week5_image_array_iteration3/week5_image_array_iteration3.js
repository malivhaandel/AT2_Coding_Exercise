/**
 * Creative Coding 2026 - Week 5: Image collage and arrays
 * made with the help of Karen ann Donnachie
 * iteration 3 by Mali van Haandel
 * debugged by Visual Studio Code
 *
 * added layer tint system using HSB colour
 * added tintHues array for separate layer colours
 * generate related random colours for each collage redraw
 * added tint() and noTint() to colour image layers
 */

let layer1Images = [];
let layer2Images = [];
let layer3Images = [];

let layer1Items = [];
let layer2Items = [];
let layer3Items = [];

// background + layer tint system (HSB)
let bgH = 0;
let tintHues = [0, 120, 240];

function preload() {
  const imageNames = [
    "bao","cheese","corn","cucumber",
    "donut","egg","lettuce","port",
    "prawn","strawberry","sushi","tomato"
  ];

  // load images into separate collage layers
  for (let i = 0; i < 4; i++) {
    layer1Images.push(loadImage("data/" + imageNames[i] + ".png"));
    layer2Images.push(loadImage("data/" + imageNames[i + 4] + ".png"));
    layer3Images.push(loadImage("data/" + imageNames[i + 8] + ".png"));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  colorMode(HSB, 360, 100, 100);

  // stop sketch looping continuously
  noLoop();

  // generate random collage layout
  generateCollage();
}

function draw() {
  // background uses its own hue
  background(bgH, 80, 95);

  // layer 1 tint
  tint(tintHues[0], 80, 95);
  drawCollageItems(layer1Items);

  // layer 2 tint
  tint(tintHues[1], 80, 95);
  drawCollageItems(layer2Items);

  // layer 3 tint
  tint(tintHues[2], 80, 95);
  drawCollageItems(layer3Items);

  noTint();
}

// generate collage (3–4 images total)
function generateCollage() {
  let total = int(random(3, 5));
  let count1 = 1;
  let count2 = 1;
  let count3 = total - 2;

  layer1Items = generateCollageItems(layer1Images, count1, width / 2, height / 2, width / 3, height / 4, 0.5, 1.5, 0, PI);
  layer2Items = generateCollageItems(layer2Images, count2, width / 2, height / 2, width / 2, height / 3, 0.3, 1.2, -HALF_PI, HALF_PI);
  layer3Items = generateCollageItems(layer3Images, count3, width / 2, height / 2, width / 2, height, 0.4, 1.0, -PI, PI);
}

// create items
function generateCollageItems(imgArray, count, centerX, centerY, rangeX, rangeY, minScale, maxScale, minRotation, maxRotation) {
  let items = [];

  // create random collage objects
  for (let i = 0; i < count; i++) {
    let img = random(imgArray);
    let item = new CollageItem(img);

    // random image position
    item.x = centerX + random(-rangeX / 2, rangeX / 2);
    item.y = centerY + random(-rangeY / 2, rangeY / 2);

    // random image rotation
    item.rotation = random(minRotation, maxRotation);

    // random image scale
    item.scaling = random(minScale, maxScale);

    items.push(item);
  }

  return items;
}

// draw items
function drawCollageItems(items) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];

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
  this.rotation = 0;
  this.scaling = 1;
}

// click = new collage + new colour system
function mousePressed() {
  setup();
  redraw();

  // background colour
  bgH = random(360);

  // each layer gets its own related hue
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
