/**
 * Creative Coding 2026 - Week 4: Advanced Typography
 * Original Concept by Andy Simionato & KarenAnn Donnachie
 * iteration 6 by Mali van Haandel
 * debugged Visual Studio Code
 * 
 * stars are smaller
 * increased body text size
 * added static background typography layer
 * improved visual hierarchy between background and foreground text
 * added layered depth using opacity-based overlays
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
  bodySize = width / 60;

  generateStars();
}

function draw() {

  let p = palettes[paletteIndex];

  image(bgImage, 0, 0, width, height);
  
  fill(p.bg[0], p.bg[1], p.bg[2], 110);
  rect(0, 0, width, height);

  fill(255, 255, 255, 80);
  rect(0, 0, width, height);

  // static background typography layer (centered reference composition)
  push();

  textFont(bodyFont);
  textAlign(CENTER, CENTER);

  // large-scale typographic background element
  let staticSize = width * 0.3;
  textSize(staticSize);

  fill(255, 255, 255);

  let staticGap = height * 0.18;
  let cx = width / 2;
  let cy = height / 2;

  // repeated structural text anchors
  text("STATIC", cx, cy - staticGap);
  text("STATIC", cx, cy + staticGap);

  // subtle offset shadow layer for depth perception
  fill(0, 0, 255, 15);
  text("STATIC", cx + 10, cy - staticGap + 10);
  text("STATIC", cx + 10, cy + staticGap + 10);

  pop();

  // star field behind typographic layers (decorative depth layer)
  for (let s of stars) {
    drawStar(
      s.x,
      s.y,
      50 * s.s,
      100 * s.s,
      5,
      s.r + frameCount * 0.003,
      p.accent
    );
  }

  // primary text styling (foreground readability layer)
  fill(p.primary[0], p.primary[1], p.primary[2]);
  noStroke();
  textAlign(LEFT, TOP);

  let columnWidth = width * 0.35;
  let gap = width * 0.05;

  let totalWidth = columnWidth * 2 + gap;
  let startX = (width - totalWidth) / 2;

  let startY = height * 0.5 - (18 * bodySize) / 2;

  drawJustifiedText(contentA, startX, startY, columnWidth, bodySize * 1.4);
  drawJustifiedText(contentB, startX + columnWidth + gap, startY, columnWidth, bodySize * 1.4);
}

function generateStars() {

  stars = [];

  let count = 3;

  while (stars.length < count) {

    let s = random(0.6, 1.4);

    let x = random(width * 0.1, width * 0.9);
    let y = random(height * 0.15, height * 0.85);

    let ok = true;

    for (let o of stars) {
      if (dist(x, y, o.x, o.y) < 120) {
        ok = false;
        break;
      }
    }

    if (ok) {
      stars.push({
        x,
        y,
        s,
        r: random(TWO_PI)
      });
    }
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
