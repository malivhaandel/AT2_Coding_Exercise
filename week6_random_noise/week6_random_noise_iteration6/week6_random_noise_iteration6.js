/**
 * Creative Coding 2026 - Week 6: Randomness and noise
 * made with the help of karen ann donnachie
 * iteration 6 by mali van haandel
 * debugged by Visual Studio Code
 *
 * speed interaction via mouse position - left - slow, rigth - speed
 */

let started = false;
let paused = false;

// background colour (current values used for lerp transition)
let bgR = 255;
let bgG = 255;
let bgB = 255;

// target background colour (randomly updated over time)
let targetBgR = 255;
let targetBgG = 255;
let targetBgB = 255;

// custom font asset
let myFont;
let canvas;

function preload() {
    // load font before sketch starts
    myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    frameRate(20);

    // initial background fill
    background(255);

    // apply custom font globally
    textFont(myFont);

    // disable default right click + drag behaviour on canvas
    canvas.elt.oncontextmenu = () => false;
    canvas.elt.onmousedown = () => false;
}

function draw() {

    // start screen state (no animation yet)
    if (!started) {
        background(255);

        textAlign(CENTER, CENTER);
        textSize(24);
        fill(0);

        // user instruction
        text("CLICK TO START", width / 2, height / 2);

        return;
    }

    // main animation loop
    if (!paused) {

        // update background fade system
        updateBackground();

        // periodically shift target background colour
        if (frameCount % 50 === 0) {
            targetBgR = random(255);
            targetBgG = random(255);
            targetBgB = random(255);
        }

        // mouse-controlled global speed factor
        let speedFactor = map(mouseX, 0, width, 0.2, 3);

        // ---------------------------------
        // BACKGROUND PARTICLE LAYER
        // ---------------------------------
        // soft low-opacity particles for depth
        for (let i = 0; i < 4; i++) {

            let x = random(width);
            let y = random(height);

            let r = random(2, 14);

            let cr = random(255);
            let cg = random(255);
            let cb = random(255);

            noStroke();
            fill(cr, cg, cb, 18);

            circle(x, y, r * speedFactor * 0.7);
        }

        // ---------------------------------
        // FOREGROUND PARTICLE SYSTEM
        // ---------------------------------
        // main glowing particles + stars
        for (let i = 0; i < 6; i++) {

            let x = random(width);
            let y = random(height);

            let depth = random(); // controls size + glow intensity

            // size distribution (small + large mix)
            let r = depth < 0.7 ? random(2, 8) : random(15, 80);

            let cr = random(255);
            let cg = random(255);
            let cb = random(255);

            noStroke();

            // glow strength based on depth
            let alphaBase = depth < 0.7 ? 35 : 90;

            // layered glow effect
            for (let j = 5; j > 0; j--) {
                fill(cr, cg, cb, alphaBase / j);
                circle(x, y, r * j * 1.5 * speedFactor);
            }

            // core shape rendering
            fill(cr, cg, cb);

            // star for larger particles, circle for smaller ones
            if (r > 12) {
                push();
                translate(x, y);
                rotate(frameCount * 0.01 * speedFactor);
                drawStar(0, 0, r * 0.3, r, 5);
                pop();
            } else {
                circle(x, y, r * speedFactor);
            }
        }

        // UI hint text (speed indicator)
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(20);

        text("< slow                          speed >", width / 2, height / 2);

    } else {
        // paused state overlay
        drawPauseText();
    }
}

// smooth background transition system
function updateBackground() {

    // interpolate current colour toward target colour
    bgR = lerp(bgR, targetBgR, 0.02);
    bgG = lerp(bgG, targetBgG, 0.02);
    bgB = lerp(bgB, targetBgB, 0.02);

    fill(bgR, bgG, bgB, 40);
    noStroke();

    // transparent rectangle creates motion trails
    rect(0, 0, width, height);
}

// pause screen UI
function drawPauseText() {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(28);

    text("PAUSED", width / 2, height / 2);
}

// interaction system (start + pause toggle)
function mousePressed() {

    if (!started) {
        started = true;
        return;
    }

    paused = !paused;
}

// prevent drag scrolling / touch behaviour
function mouseDragged() {
    return false;
}

// procedural star shape generator
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

// handle responsive canvas resizing
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
