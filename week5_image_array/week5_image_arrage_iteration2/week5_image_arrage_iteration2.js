/**
 * Creative Coding 2026 - Week 5: Image collage and arrays
 * made with the help of Karen ann Donnachie
 * iteration 2 by Mali van Haandel
 * debugged by Visual Studio Code
 *
 * added global background variables from white to colour (bgH, bgS, bgB)
 * changed colourMode HSB, 360, 100, 100
 * generate new colours with every redraw
 */

let layer1Images = [];
let layer2Images = [];
let layer3Images = [];

let layer1Items = [];
let layer2Items = [];
let layer3Items = [];

// saturated background colour (HSB)
let bgH = 0;
let bgS = 80;
let bgB = 95;

function preload() {

  // array storing all image names
  const imageNames = [
    'bao', 'cheese', 'corn', 'cucumber',
    'donut', 'egg', 'lettuce', 'port',
    'prawn', 'strawberry', 'sushi', 'tomato'
  ];

  // split images into 3 layers
  for (let i = 0; i < 4; i++) {
    layer1Images.push(loadImage('data/' + imageNames[i] + '.png'));
    layer2Images.push(loadImage('data/' + imageNames[i + 4] + '.png'));
    layer3Images.push(loadImage('data/' + imageNames[i + 8] + '.png'));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // draw images from centre point
  imageMode(CENTER);

  // enables saturated colour system
  colorMode(HSB, 360, 100, 100);

  noLoop();

  // generate first collage layout
  generateCollage();
}

function draw() {

  // saturated background
  background(bgH, bgS, bgB);

  // draw collage layers in order
  drawCollageItems(layer1Items);
  drawCollageItems(layer2Items);
  drawCollageItems(layer3Items);
}

// generate collage (3–4 images total)
function generateCollage() {

  // random number of total images
  let total = int(random(3, 5));

  // keep one image in top layers
  let count1 = 1;
  let count2 = 1;

  // remaining images go into last layer
  let count3 = total - 2;

  // generate front layer
  layer1Items = generateCollageItems(
    layer1Images,
    count1,
    width / 2,
    height / 2,
    width / 3,
    height / 4,
    0.5,
    1.5,
    0,
    PI
  );

  // generate middle layer
  layer2Items = generateCollageItems(
    layer2Images,
    count2,
    width / 2,
    height / 2,
    width / 2,
    height / 3,
    0.3,
    1.2,
    -HALF_PI,
    HALF_PI
  );

  // generate background layer
  layer3Items = generateCollageItems(
    layer3Images,
    count3,
    width / 2,
    height / 2,
    width / 2,
    height,
    0.4,
    1.0,
    -PI,
    PI
  );
}

// create items
function generateCollageItems(
  imgArray,
  count,
  centerX,
  centerY,
  rangeX,
  rangeY,
  minScale,
  maxScale,
  minRotation,
  maxRotation
) {

  let items = [];

  // create random collage objects
  for (let i = 0; i < count; i++) {

    // choose random image
    let img = random(imgArray);

    // store image properties
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

    // move image into position
    translate(item.x, item.y);

    // rotate image
    rotate(item.rotation);

    // resize image
    scale(item.scaling);

    image(item.image, 0, 0);

    pop();
  }
}

// object
function CollageItem(image) {

  // image file
  this.image = image;

  // image position
  this.x = 0;
  this.y = 0;

  // image rotation angle
  this.rotation = 0;

  // image scale amount
  this.scaling = 1;
}

// click = new collage + new saturated background colour
function mousePressed() {

  // regenerate collage
  setup();
  redraw();

  // only saturated colours (no dull tones)
  bgH = random(360);
  bgS = random(70, 100);
  bgB = random(85, 100);
}

// resize canvas with browser window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
  redraw();
}
