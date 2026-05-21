/**
 * creative coding 2026 - week 4: advanced typography
 * original concept by andy simionato & karenann donnachie
 * iteration 7 by mali van haandel
 * debugged visual studio code
 * 
 * stars orbit around position
 * stars are constrained to avoid central text columns
 * star spawn zone excludes text layout area
 * stars now use background colour instead of fixed white
 * subtle orbital motion applied to star positions
 */

let bgImage;      
let bodyFont;     

let contentA = "Static, static, static! Be static! Be static! Movement is static! Move-ment is static! Movement is static because it is the only immutable thing—the only certainty, the only unchangeable. The only certainty is that movement, change and metamorphosis exist. That is why move-ment is static. So-called immobile objects exist only in movement. Immobile, certain and permanent things, ideas, works and beliefs change, transform and disintegrate . Immobile objects are snapshots of a movement whose existence we refuse to accept, because we our-selves are only an instant in the great movement. Movement is the only static, final, permanent and certain thing. … Immutability does not exist. All is movement.";
let contentB = "The move from print to digital text precisely models this change. We could, had we been working in a metamorphic display mode rather than a fixed one, have flown into many more radical examples of dynamic text than could be dealt with here. But we have seen enough, perhaps, to suggest that we are not simply voyaging on strange new seas of thought but plowing the old Homeric ones as well and trying to make sense of both as one whole and comprehensible textual world. We cannot exist, after all, only by breathing out abstraction, alphabets which do not think; nor only by breathing in animation, alphabets which do; but only by respiration, the life-giving oscillation of the two. That oscillation is what’s next for text.";

let bodySize;
let stars = [];
let paletteIndex = 0;

// colour palettes (click to cycle)
let palettes = [
  { bg: [255, 255, 0], primary: [0, 0, 255], accent: [255, 255, 255] },
  { bg: [20, 20, 255], primary: [255, 100, 255], accent: [255, 255, 255] },
  { bg: [255, 40, 80], primary: [80, 255, 200], accent: [255, 255, 255] },
  { bg: [40, 255, 120], primary: [255, 80, 200], accent: [255, 255, 255] },
  { bg: [120, 60, 255], primary: [255, 200, 80], accent: [255, 255, 255] }
];

function preload() {
  bgImage = loadImage("data/fruit_salad.png");
  bodyFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  textFont(bodyFont);
  bodySize = width / 70;

  generateStars();
}

function draw() {

  let p = palettes[paletteIndex];

  image(bgImage, 0, 0, width, height);
  
  fill(p.bg[0], p.bg[1], p.bg[2], 110);
  rect(0, 0, width, height);

  fill(255, 255, 255, 80);
  rect(0, 0, width, height);

  // static background typography layer
  push();

  textFont(bodyFont);
  textAlign(CENTER, CENTER);

  let staticSize = width * 0.3;
  textSize(staticSize);

  fill(255, 255, 255);

  let staticGap = height * 0.18;
  let cx = width / 2;
  let cy = height / 2;

  text("STATIC", cx, cy - staticGap);
  text("STATIC", cx, cy + staticGap);

  fill(0, 0, 255, 15);
  text("STATIC", cx + 10, cy - staticGap + 10);
  text("STATIC", cx + 10, cy + staticGap + 10);

  pop();

  // star field setup (keeps stars outside text layout zone)
  let columnWidth = width * 0.35;
  let gap = width * 0.05;
  let totalWidth = columnWidth * 2 + gap;
  let startX = (width - totalWidth) / 2;
  let endX = startX + totalWidth;

  // orbiting stars animation
  for (let s of stars) {

    let orbitX = s.x + sin(frameCount * 0.02 + s.angleOffset) * 15;
    let orbitY = s.y + cos(frameCount * 0.02 + s.angleOffset) * 15;

    drawStar(
      orbitX,
      orbitY,
      50 * s.s,
      100 * s.s,
      5,
      s.r + frameCount * 0.003,
      p.bg
    );
  }

  fill(p.primary[0], p.primary[1], p.primary[2]);
  noStroke();
  textAlign(LEFT, TOP);

  let startY = height * 0.5 - (18 * bodySize) / 2;

  drawJustifiedText(contentA, startX, startY, columnWidth, bodySize * 1.4);
  drawJustifiedText(contentB, startX + columnWidth + gap, startY, columnWidth, bodySize * 1.4);
}

/* star generation with layout-safe placement */
function generateStars() {

  stars = [];

  let count = 5;

  let columnWidth = width * 0.35;
  let gap = width * 0.05;
  let totalWidth = columnWidth * 2 + gap;
  let startX = (width - totalWidth) / 2;
  let endX = startX + totalWidth;

  while (stars.length < count) {

    let x = random(width);
    let y = random(height);

    // prevent stars from spawning inside text columns
    let inLeftText = (x > startX && x < startX + columnWidth);
    let inRightText = (x > startX + columnWidth + gap && x < endX);

    if (inLeftText || inRightText) continue;

    stars.push({
      x,
      y,
      s: random(0.6, 1.2),
      r: random(TWO_PI),
      angleOffset: random(TWO_PI)
    });
  }
}

function drawJustifiedText(txt, x, y, w, h) {

  textSize(bodySize);

  let lines = [];
  let line = "";

  for (let word of txt.split(" ")) {

    let test = line + word + " ";

    if (textWidth(test) > w && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = test;
    }
  }

  lines.push(line.trim());

  for (let i = 0; i < lines.length; i++) {

    let words = lines[i].split(" ");

    if (i === lines.length - 1 || words.length === 1) {
      text(lines[i], x, y + i * h);
    } else {

      let usedWidth = 0;

      for (let word of words) usedWidth += textWidth(word);

      let space = (w - usedWidth) / (words.length - 1);
      let cx = x;

      for (let word of words) {
        text(word, cx, y + i * h);
        cx += textWidth(word) + space;
      }
    }
  }
}

function drawStar(x, y, r1, r2, n, rot, col) {
  push();
  translate(x, y);
  rotate(rot);

  fill(col);
  noStroke();

  let angle = TWO_PI / n;

  beginShape();

  for (let a = 0; a < TWO_PI; a += angle) {
    vertex(cos(a) * r2, sin(a) * r2);
    vertex(cos(a + angle / 2) * r1, sin(a + angle / 2) * r1);
  }

  endShape(CLOSE);
  pop();
}

function mousePressed() {
  paletteIndex = (paletteIndex + 1) % palettes.length;
  generateStars();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  bodySize = width / 70;
}
