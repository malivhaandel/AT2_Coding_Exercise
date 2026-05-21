/**
 * Creative Coding 2026 - Week 6: Randomness and noise
 * made with the help of karen ann donnachie
 * iteration 7 by mali van haandel
 * debugged by Visual Studio Code
 *
 * particle system
 * smooth background colour shifting
 * multi-layer circles with glow-based rendering
 * controlled generation and less spam-like
 * 
 */


let started = false;
let paused = false;

// background colour (current values used for lerp smoothing)
let bgR = 255;
let bgG = 255;
let bgB = 255;

// target background colour (randomly updated over time)
let targetBgR = 255;
let targetBgG = 255;
let targetBgB = 255;

// font asset
let myFont;
let canvas;

// main particle array (persistent system)
let particles = [];

function preload() {
    // load custom font before sketch starts
    myFont = loadFont("data/BootzyTM.ttf");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    frameRate(20);

    // initial canvas state
    background(255);

    // apply custom font globally
    textFont(myFont);

    // disable right click + default mouse actions on canvas
    canvas.elt.oncontextmenu = () => false;
    canvas.elt.onmousedown = () => false;

    // initial particle population
    for (let i = 0; i < 25; i++) {
        spawnParticle();
    }
}

function draw() {

    // start screen state (no simulation running yet)
    if (!started) {
        background(255);

        textAlign(CENTER, CENTER);
        textSize(24);
        fill(0);

        text("CLICK TO START", width / 2, height / 2);
        return;
    }

    // main simulation loop (paused state disables updates)
    if (!paused) {

        // smooth background transition system
        updateBackground();

        // periodically change target background colour
        if (frameCount % 50 === 0) {
            targetBgR = random(255);
            targetBgG = random(255);
            targetBgB = random(255);
        }

        // mouse controls:
        // - intensity = particle speed
        // - spawnRate = how often new particles appear
        let intensity = map(mouseX, 0, width, 0.3, 3.5);
        let spawnRate = floor(map(mouseX, 0, width, 10, 1));

        // background noise particles (low opacity layer)
        for (let i = 0; i < 3; i++) {
            fill(random(255), random(255), random(255), 18);
            noStroke();
            circle(random(width), random(height), random(2, 10));
        }

        // continuous particle spawning system
        if (frameCount % spawnRate === 0) {
            spawnParticle();
        }

        // limit particle count to prevent overload
        if (particles.length > 140) {
            particles.splice(0, 1);
        }

        // update + render particles
        for (let p of particles) {

            // motion update
            p.x += p.vx * intensity;
            p.y += p.vy * intensity;

            // velocity damping (smooth motion decay)
            p.vx *= 0.99;
            p.vy *= 0.99;

            // boundary bounce behaviour
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            noStroke();

            // glow intensity based on depth value
            let alphaBase = p.depth < 0.7 ? 35 : 90;

            // multi-layer glow rendering
            for (let j = 5; j > 0; j--) {
                fill(p.cr, p.cg, p.cb, alphaBase / j);
                circle(p.x, p.y, p.r * j * 1.5);
            }

            // main particle shape
            fill(p.cr, p.cg, p.cb);

            // switch between circle and star based on size
            if (p.r > 12) {
                drawStar(p.x, p.y, p.r * 0.3, p.r, 5);
            } else {
                circle(p.x, p.y, p.r);
            }
        }

        // UI hint text (speed indicator)
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(20);
        text("< slow                          speed >", width / 2, height / 2);

    } else {
        // paused overlay state
        drawPauseText();
    }
}

// spawn a single particle with random properties
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

// background interpolation system (smooth colour shifting)
function updateBackground() {
    bgR = lerp(bgR, targetBgR, 0.02);
    bgG = lerp(bgG, targetBgG, 0.02);
    bgB = lerp(bgB, targetBgB, 0.02);

    fill(bgR, bgG, bgB, 40);
    noStroke();

    // transparent overlay creates motion trail effect
    rect(0, 0, width, height);
}

// pause screen text
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
