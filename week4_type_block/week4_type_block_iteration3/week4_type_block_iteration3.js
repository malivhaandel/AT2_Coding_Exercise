/**
 * creative coding 2026 - week 4: advanced typography
 * original concept by andy simionato & karenann donnachie
 * iteration 3 by mali van haandel
 * debugged visual studio code
 * 
 * randomised filled stars behind text blocks
 * randomised star shaped
 * green stars
 */

let bgImage;      // Background Image
let bodyFont;     // global variable to store our custom typeface
let contentA = "Static, static, static! Be static! Be static! Movement is static! Move- ment is static! Movement is static because it is the only immutable thing—the only certainty, the only unchangeable. The only certainty is that movement, change and metamorphosis exist. That is why move-ment is static. So-called immobile objects exist only in movement. Immobile, certain and permanent things, ideas, works and beliefs change, transform and disintegrate . Immobile objects are snapshots of a movement whose existence we refuse to accept, because we our- selves are only an instant in the great movement. Movement is the only static, final, permanent and certain thing. … immutability does not exist. all is movement.";
let contentB = "The move from print to digital text precisely models this change. We could, had we been working in a metamorphic display mode rather than a fixed one, have flown into many more radical examples of dynamic text than could be dealt with here. But we have seen enough, perhaps, to suggest that we are not simply voyaging on strange new seas of thought but plowing the old homeric ones as well and trying to make sense of both as one whole and comprehensible textual world. We cannot exist, after all, only by breathing out abstraction, alphabets which do not think; nor only by breathing in animation, alphabets which do; but only by respiration, the life-giving oscillation of the two. That oscillation is what’s next for text.";

let bodySize;
let isDesktop = true;

// fixed stars with random size + fixed rotation
let stars = [];

function preload() {
  bgImage = loadImage("data/fruit_salad.png");
  bodyFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  bodySize = int(width / 70);
  textSize(bodySize);
  textFont(bodyFont);

  if (width < height) {
    isDesktop = false;
  }

  // fixed positions + random size + fixed rotation
  stars = [
    { x: width * 0.2, y: height * 0.3, s: random(0.6, 1.4), r: random(TWO_PI) },
    { x: width * 0.7, y: height * 0.25, s: random(0.6, 1.4), r: random(TWO_PI) },
    { x: width * 0.4, y: height * 0.7, s: random(0.6, 1.4), r: random(TWO_PI) },
  ];
}

function draw() { 
  // background image
  image(bgImage, 0, 0, width, height, 0, 0, bgImage.width, bgImage.height, COVER);

  // opacity overlay for background
  fill(255, 255, 255, 102);
  rect(0, 0, width, height);

  // fixed stars (positions fixed, sizes varied, rotation fixed)
  for (let i = 0; i < stars.length; i++) {
    drawStar(
      stars[i].x,
      stars[i].y,
      // shape size
      100 * stars[i].s,
      200 * stars[i].s,
      5,
      stars[i].r
    );
  }

  // text styling
  fill(0, 102, 255);
  noStroke();
  textAlign(LEFT, TOP);

  // centered layout
  let columnWidth = width * 0.35;
  let gap = width * 0.05;

  let totalWidth = columnWidth * 2 + gap;
  let startX = (width - totalWidth) / 2;

  // vertical centering anchor point
  let startY = height * 0.5;
  let textBlockHeight = 18 * bodySize;
  startY = startY - textBlockHeight / 2;

  // left column (justified text)
  drawJustifiedText(
    contentA,
    startX,
    startY,
    columnWidth,
    bodySize * 1.4
  );

  // right column (justified text)
  drawJustifiedText(
    contentB,
    startX + columnWidth + gap,
    startY,
    columnWidth,
    bodySize * 1.4
  );

  // circle shape
  fill(0);
  circle(width * 0.9, height * 0.9, 50);
}

// full justification function
function drawJustifiedText(txt, x, y, boxWidth, lineHeight) {
  let words = txt.split(' ');
  let line = '';
  let lines = [];

  textSize(bodySize);

  // build lines
  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';

    if (textWidth(testLine) > boxWidth && line !== '') {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }

  lines.push(line.trim());

  // render justified text
  for (let i = 0; i < lines.length; i++) {
    let lineWords = lines[i].split(' ');

    if (i === lines.length - 1 || lineWords.length === 1) {
      text(lines[i], x, y + i * lineHeight);
    } else {
      let wordsWidth = 0;

      for (let w of lineWords) {
        wordsWidth += textWidth(w);
      }

      let spaceSize = (boxWidth - wordsWidth) / (lineWords.length - 1);

      let cursorX = x;

      for (let w of lineWords) {
        text(w, cursorX, y + i * lineHeight);
        cursorX += textWidth(w) + spaceSize;
      }
    }
  }
}

// star shape function
function drawStar(x, y, radius1, radius2, npoints, rot) {
  push();
  translate(x, y);
  rotate(rot);

  fill(80, 200, 120, 255);
  noStroke();

  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2;

  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = cos(a) * radius2;
    let sy = sin(a) * radius2;
    vertex(sx, sy);

    sx = cos(a + halfAngle) * radius1;
    sy = sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  bodySize = int(width / 70);
  textSize(bodySize);
}
