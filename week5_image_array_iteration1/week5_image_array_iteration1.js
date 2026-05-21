/**
 * Creative Coding 2026 - Week 5: Image collage and arrays
 * made with the help of Karen ann Donnachie
 * iteration 1 by Mali van Haandel
 * debugged by Visual Studio Code
 *
 * added 12 food themed images
 * group images into 3 groups with 4 images max on every click
 * resize and rotate images randomly 
 */

let layer1Images = [];
let layer2Images = [];
let layer3Images = [];

let layer1Items = [];
let layer2Items = [];
let layer3Items = [];

// load images into three layers
function preload() {

  // store all food image names in one array
  const imageNames = [
    'bao', 'cheese', 'corn', 'cucumber',
    'donut', 'egg', 'lettuce', 'port',
    'prawn', 'strawberry', 'sushi', 'tomato'
  ];

  // split images into 3 groups (4 images each)
  for (let i = 0; i < 4; i++) {
    layer1Images.push(loadImage('data/' + imageNames[i] + '.png'));
    layer2Images.push(loadImage('data/' + imageNames[i + 4] + '.png'));
    layer3Images.push(loadImage('data/' + imageNames[i + 8] + '.png'));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noLoop();

  // generate initial collage
  generateCollage();
}

function draw() {
  background(255);

  // draw each collage layer
  drawCollageItems(layer1Items);
  drawCollageItems(layer2Items);
  drawCollageItems(layer3Items);
}

// create collage layout
function generateCollage() {

  // choose total number of images (3 or 4 per layout)
  let total = int(random(3, 5));

  // keep one image in first two layers
  let count1 = 1;
  let count2 = 1;

  // remaining images go into back layer
  let count3 = total - 2;

  // generate items for each layer
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

// generate random collage items
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

  // create required number of items
  for (let i = 0; i < count; i++) {

    // pick random image
    let img = random(imgArray);

    // save image properties into object
    let item = new CollageItem(img);

    // move image to random position on screen
    item.x = centerX + random(-rangeX / 2, rangeX / 2);
    item.y = centerY + random(-rangeY / 2, rangeY / 2);

    // rotate image randomly for messy collage effect
    item.rotation = random(minRotation, maxRotation);

    // resize image randomly for variation
    item.scaling = random(minScale, maxScale);

    items.push(item);
  }

  return items;
}

// draw all items in an array
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

// object to store image properties
function CollageItem(image) {
  this.image = image;
  this.x = 0;
  this.y = 0;
  this.rotation = 0;
  this.scaling = 1;
}

// redraw collage when mouse is clicked
function mousePressed() {
  setup();
  redraw();
}

// resize collage when browser window changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
  redraw();
}
