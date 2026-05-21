/**
 * Creative Coding 2026 - Week 6: Randomness and noise
 * made with the help of karen ann donnachie
 * iteration 8 by mali van haandel
 * debugged by Visual Studio Code
 *
 * more glowing effect + stars
 * right click to reset canvas with lock so "pause" does not overlap
 */

let started = false;
let paused = false;
let resetting = false;

// background colour system (lerped over time)
let bgR = 255;
let bgG = 255;
let bgB = 255;

let targetBgR = 255;
let targetBgG = 255;
let targetBgB = 255;

// font
let myFont;
let canvas;

// particle array
let particles = [];

// reset timer
let resetTimer = 0;

function preload() {
    myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    frameRate(20);
    background(255);

    textFont(myFont);

    // disable right click menu
    canvas.elt.oncontextmenu = () => false;

    resetAll(true);
}

function draw() {

    // start screen
    if (!started) {
        background(255);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(24);
        text("CLICK TO START", width / 2, height / 2);
        return;
    }

    // reset state (locks everything temporarily)
    if (resetting) {

        paused = false;

        background(255);

        fill(0);
        textAlign(CENTER, CENTER);
        textSize(28);
        text("RESETTING...", width / 2, height / 2);

        resetTimer++;

        if (resetTimer > 40) {
            resetting = false;
        }

        return;
    }

    // pause state (freezes frame)
    if (paused) {
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(28);
        text("PAUSED", width / 2, height / 2);
        return;
    }

    // background update
    updateBackground();

    // change target background colours over time
    if (frameCount % 50 === 0) {
        targetBgR = random(255);
        targetBgG = random(255);
        targetBgB = random(255);
    }

    // mouse controls speed + spawn rate
    let intensity = map(mouseX, 0, width, 0.3, 3.5);
    let spawnRate = floor(map(mouseX, 0, width, 10, 1));

    // soft background noise particles
    for (let i = 0; i < 3; i++) {
        noStroke();
        fill(random(255), random(255), random(255), 20);
        circle(random(width), random(height), random(2, 10));
    }

    // spawn particles
    if (frameCount % spawnRate === 0) {
        spawnParticle();
    }

    // limit particle count
    if (particles.length > 140) {
        particles.splice(0, 1);
    }

    // particle system update
    for (let p of particles) {

        p.x += p.vx * intensity;
        p.y += p.vy * intensity;

        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        noStroke();

        let alphaBase = p.depth < 0.7 ? 35 : 90;

        // glow effect
        for (let j = 5; j > 0; j--) {
            fill(p.cr, p.cg, p.cb, alphaBase / j);
            circle(p.x, p.y, p.r * j * 1.5);
        }

        // main particle
        fill(p.cr, p.cg, p.cb);

        if (p.r > 12) {
            drawStar(p.x, p.y, p.r * 0.3, p.r, 5);
        } else {
            circle(p.x, p.y, p.r);
        }
    }

    // UI text
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("< slow                          speed >", width / 2, height / 2);
}

// reset system
function resetAll(isInit = false) {

    particles = [];

    bgR = bgG = bgB = 255;
    targetBgR = targetBgG = targetBgB = 255;

    background(255);

    if (!isInit) {
        resetting = true;
        resetTimer = 0;
    }
}

// spawn particle
function spawnParticle() {
    particles.push({
        x: random(width),
        y: random(height),
        vx: random(-1, 1),
        vy: random(-1, 1),
        r: random(4, 70),
        depth: random(),
        cr: random(255),
        cg: random(255),
        cb: random(255)
    });
}

// background lerp system
function updateBackground() {
    bgR = lerp(bgR, targetBgR, 0.02);
    bgG = lerp(bgG, targetBgG, 0.02);
    bgB = lerp(bgB, targetBgB, 0.02);

    fill(bgR, bgG, bgB, 40);
    noStroke();
    rect(0, 0, width, height);
}

// input
function mousePressed() {

    if (resetting) return;

    if (!started) {
        started = true;
        return;
    }

    paused = !paused;
}

function mouseDragged() {
    if (resetting) return false;
}

function mouseReleased() {
    if (resetting) return;

    if (mouseButton === RIGHT) {
        resetAll(false);
    }
}

// star shape
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
