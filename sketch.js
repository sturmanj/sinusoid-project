let midline = 0.0;
let amp = 0.0;
let hshift = 0.0;
let deltaX = 0.0;

let midpoint = { "y": Number.MAX_VALUE };
let extremePoint = null;

let yValues = [];
let points = [];

function setup() {
    createCanvas(document.body.clientWidth, document.body.clientHeight);
    angleMode(RADIANS);
    textStyle(BOLD);
    textSize(14);
    noStroke();

    setupHandsfree();
}

function draw() {
    background(color(0, 0, 0));
    drawAxis();

    calcHands();
    calcGraph();

    renderGraph();
    renderHands();
}

function drawAxis() {
    stroke(color(255, 255, 255));
    fill(color(255, 255, 255));
    strokeWeight(10);

    line(0, height / 2, width, height / 2);
    line(width / 2, 0, width / 2, height);

    noStroke();

    text(`${floor(height / 2)}`, 7 + width / 2, 15);
    text(`${ceil(-height / 2)}`, 7 + width / 2, height - 5);
    text(`${floor(width / 2)}`, width - 30, height / 2 - 7);
    text(`${ceil(-width / 2)}`, 0, height / 2 - 7);
    text(`0`, width / 2 + 7, height / 2 - 7);
}

function calcGraph() {
    if (points.length != 2) return;

    let x = 0;
    yValues = [];
    midline = midpoint.y * height;
    posNeg = extremePoint.y < 0.5 ? -1 : 1;
    hshift = (width - extremePoint.x * width);
    amp = abs(midpoint.y - extremePoint.y) * height;
    deltaX = TWO_PI / abs((midpoint.x - extremePoint.x) * 4 * width);
    
    for (let i = 0; i < (width + 10); i++) {
        yValues.push(midline + posNeg * cos(x - hshift * deltaX) * amp);
        x += deltaX;
    }
}

function renderGraph() {
    if (points.length != 2) return;

    fill(color(0, 255, 0));

    for (let x = 0; x < yValues.length; x++) {
        ellipse(x, yValues[x], 10, 10);
    }
}

function calcHands() {
    points = [];
    midpoint = { "y": Number.MAX_VALUE };
    extremePoint = null;

    if (handsfree.data == null) return;
    
    const hands = handsfree.data.hands;

    if (hands == null) return;

    hands.landmarks.forEach((hand) => {
        if (hand.length > 0) {
            let landmark = hand[21];

            points.push(landmark);

            if (abs(0.5 - landmark.y) < abs(0.5 - midpoint.y)) {
                midpoint = landmark;
            };
        };
    });

    extremePoint = points[1 - points.indexOf(midpoint)];
}

function renderHands() {
    if (midpoint.y == Number.MAX_VALUE) return;

    let x = width - midpoint.x * width;
    let y = midpoint.y * height;

    fill(color(0, 0, 255));
    ellipse(x, y, 10, 10);
    text(`(${round(x - width / 2)}, ${round(height / 2 - y)})`, x + 10, y);

    if (extremePoint == null) return;
    
    x = width - extremePoint.x * width;
    y = extremePoint.y * height;

    fill(color(255, 0, 0));
    ellipse(x, y, 10, 10);
    text(`(${round(x - width / 2)}, ${round(height / 2 - y)})`, x + 10, y);
}

function setupHandsfree() {
    handsfree = new Handsfree({
        hands: {
            enabled: true,
            maxNumHands: 2,
        }
    });

    handsfree.start();

    handsfree.enablePlugins('browser');
    handsfree.plugin.faceClick.disable();
    handsfree.plugin.facePointer.disable();
    handsfree.plugin.faceScroll.disable();
    handsfree.plugin.palmPointers.disable();
    handsfree.plugin.pinchers.disable();
    handsfree.plugin.pinchScroll.disable();
}