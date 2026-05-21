/**
 * Creative Coding 2026 - Week 4: Advanced Typography
 * Original Concept by Andy Simionato & KarenAnn Donnachie
 * iteration 2 by Mali van Haandel
 * debugged Visual Studio Code
 *
 * added translucent overlay layer (rectangle) to adjust background visibility
 * implemented full text justification system for both columns
 * responsive liquid layout centering for multi-column composition
 */

let bgImage;      // Background Image
let bodyFont;     // Global variable to store our custom typeface
let contentA = "Static, static, static! Be static! Be static! Movement is static! Move- ment is static! Movement is static because it is the only immutable thing—the only certainty, the only unchangeable. The only certainty is that movement, change and metamorphosis exist. That is why move- ment is static. So-called immobile objects exist only in movement. Immobile, certain and permanent things, ideas, works and beliefs change, transform and disintegrate . Immobile objects are snapshots of a movement whose existence we refuse to accept, because we our- selves are only an instant in the great movement. Movement is the only static, final, permanent and certain thing. … Immutability does not exist. All is movement.";
let contentB = "The move from print to digital text precisely models this change. We could, had we been working in a metamorphic display mode rather than a fixed one, have flown into many more radical examples of dynamic text than could be dealt with here. But we have seen enough, perhaps, to suggest that we are not simply voyaging on strange new seas of thought but plowing the old Homeric ones as well and trying to make sense of both as one whole and comprehensible textual world. We cannot exist, after all, only by breathing out abstraction, alphabets which do not think; nor only by breathing in animation, alphabets which do; but only by respiration, the life-giving oscillation of the two. That oscillation is what’s next for text.";

let bodySize;
let isDesktop = true;

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
}

function draw() { 
  // background image layer
  image(bgImage, 0, 0, width, height, 0, 0, bgImage.width, bgImage.height, COVER);

  // translucent overlay for background control / readability
  fill(255, 255, 255, 102);
  rect(0, 0, width, height);

  // text styling
  fill(0, 102, 255);
  noStroke();
  textAlign(LEFT, TOP);

  // responsive centered column layout
  let columnWidth = width * 0.35;
  let gap = width * 0.05;

  let totalWidth = columnWidth * 2 + gap;
  let startX = (width - totalWidth) / 2;

  // vertical centering anchor
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

  // ui element (navigation dot)
  fill(0);
  circle(width * 0.9, height * 0.9, 50);
}

// full justification text renderer
function drawJustifiedText(txt, x, y, boxWidth, lineHeight) {
  let words = txt.split(' ');
  let line = '';
  let lines = [];

  textSize(bodySize);

  // build lines based on available width
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

  // render justified lines
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  bodySize = int(width / 70);
  textSize(bodySize);
}
