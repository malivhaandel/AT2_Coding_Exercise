/**
 * Creative Coding 2026 - Week 6: Randomness and noise
 * made with the help of karen ann donnachie
 * iteration 5 by mali van haandel
 * debugged by Visual Studio Code
 *
 * background slowly changes colours 
 * added " pause " text with custom font with start state
 */

let started = false;
let paused = false;

// background colour (current state)
let bgR = 255;
let bgG = 255;
let bgB = 255;

// target background colour (smooth transition destination)
let targetBgR = 255;
let targetBgG = 255;
let targetBgB = 255;

// custom font asset
let myFont;

function preload() {
    // load external font before setup
    myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(20);

    // initial blank canvas
    background(255);

    // apply custom font globally
    textFont(myFont);
}

function draw() {

    // initial start screen state
    if (!started) {
        background(255);

        textAlign(CENTER, CENTER);
        textSize(24);
        fill(0);

        // instruction prompt
        text("CLICK TO START", width / 2, height / 2);

        return;
    }

    // main animation loop (disabled when paused)
    if (!paused) {

        // update background colour gradually each frame
        updateBackground();

        // occasionally choose a new target colour
        if (frameCount % 50 === 0) {
            targetBgR = random(255);
            targetBgG = random(255);
            targetBgB = random(255);
        }

        // particle generation loop
        for (let i = 0; i < 6; i++) {

            let x = random(width);   // random x position
            let y = random(height);  // random y position

            let depth = random();    // depth value controls scale behaviour

            // size distribution (mostly small, some large)
            let r = depth < 0.7 ? random(2, 8) : random(15, 80);

            // random rgb colour per particle
            let cr = random(255);
            let cg = random(255);
            let cb = random(255);

            noStroke();

            // glow intensity depends on depth
            let alphaBase = depth < 0.7 ? 35 : 90;

            // glow layering system (stacked circles)
            for (let j = 5; j > 0; j--) {
                fill(cr, cg, cb, alphaBase / j);
                circle(x, y, r * j * 1.5);
            }

            // main shape rendering
            fill(cr, cg, cb);

            // switch between circle and star based on size
            if (r > 12) {
                push();
                translate(x, y);

                // slow rotation animation
                rotate(frameCount * 0.01);

                drawStar(0, 0, r * 0.3, r, 5);
                pop();
            } else {
                circle(x, y, r);
            }
        }

    } else {
        // paused overlay state
        drawPauseText();
    }
}

// smooth background transition system
function updateBackground() {

    // interpolate current background toward target colour
    bgR = lerp(bgR, targetBgR, 0.02);
    bgG = lerp(bgG, targetBgG, 0.02);
    bgB = lerp(bgB, targetBgB, 0.02);

    fill(bgR, bgG, bgB, 40);
    noStroke();

    // translucent overlay creates motion trails
    rect(0, 0, width, height);
}

// pause state text display
function drawPauseText() {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(28);

    text("PAUSED", width / 2, height / 2);
}

// interaction system (start + toggle pause)
function mousePressed() {

    // first click starts the animation
    if (!started) {
        started = true;
        return; // prevents immediate pause toggle
    }

    // toggle pause state
    paused = !paused;
}

// star shape generator (procedural geometry)
function drawStar(x, y, innerR, outerR, points) {

    let angle = TWO_PI / points;
    let halfAngle = angle / 2;

    beginShape();

    for (let a = 0; a < TWO_PI; a += angle) {

        let sx = x + cos(a) * outerR;
        let sy = y + sin(a) * outerR;
        vertex(sx, sy);

        sx = x + cos(a + halfAngle) * innerR;
        sy = y + sin(a + halfAngle) * innerR;
        vertex(sx, sy);
    }

    endShape(CLOSE);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
