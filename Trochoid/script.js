const tCanvas = document.querySelector(".trochoidCanvas");
const ctCanvas = document.querySelector(".centeredTrochoidCanvas");
const htCanvas = document.querySelector(".hypoTrochoidCanvas");

const CTX = tCanvas.getContext("2d");
const HEIGHT = tCanvas.height = window.innerHeight / 3;
const WIDTH = tCanvas.width = window.innerWidth * 0.9;
CTX.translate(0, HEIGHT / 2); // translate origin

const CT_CTX = ctCanvas.getContext("2d");
const CT_HEIGHT = ctCanvas.height = window.innerHeight * 0.95;
const CT_WIDTH = ctCanvas.width = CT_HEIGHT;
CT_CTX.translate(CT_WIDTH / 2, CT_HEIGHT / 2); // translate origin

const HT_HTX = htCanvas.getContext("2d");
const HT_HEIGHT = htCanvas.height = window.innerHeight * 0.95;
const HT_WIDTH = htCanvas.width = HT_HEIGHT;
HT_HTX.translate(HT_WIDTH / 2, HT_HEIGHT / 2); // translate origin

function clearCanvas() {
    drawRect(CTX, new Point(0, -HEIGHT / 2), WIDTH, HEIGHT, BG_COLOR, true);
}

const SPEED = 0.05;

// linear trochoid
let RADIUS;// radius of the circle
let POINT_RADIUS; // distance of the point from center of the circle
let center, rotationInRad, forward, points;
let raf = NaN;

// centered trochoid
let CT_r, CT_R, CT_DISTANCE, CT_SPEED;
let ct_rotationInRad, ct_points;
let ct_raf = NaN;
let ct_animate = true;

// hypo trochoid
let HT_r, HT_R, HT_DISTANCE, HT_SPEED;
let ht_rotationInRad, ht_points;
let ht_raf = NaN;
let ht_animate = true;

trochoidHandler();
centeredTrochoidHandler();
hypoTrochoidHandler();

// linear trochoid
function trochoidHandler() {
    RADIUS = (document.querySelector(`.radiusInput`).value / 100) * HEIGHT / 2;
    POINT_RADIUS = (document.querySelector(`.distInput`).value / 100) * HEIGHT / 2;

    if (raf) cancelAnimationFrame(raf);

    center = new Point(0, 0); // position of center of circle
    rotationInRad = -Math.PI; // rotation of the point for each iteration
    forward = true;
    points = []; // to track all the points traced by trochoid so far
    drawTrochoid();
}

function drawTrochoid() {
    //console.log(RADIUS, POINT_RADIUS, SPEED, center.x, center.y);

    let point = new Point(center.x + POINT_RADIUS * Math.cos(rotationInRad),
        POINT_RADIUS * Math.sin(rotationInRad));

    clearCanvas(CTX, WIDTH, HEIGHT);

    // draw ref line
    drawLine(CTX, new Point(0, RADIUS), new Point(WIDTH, RADIUS), REF_COLOR)

    // draw circle
    drawCircle(CTX, center, RADIUS, CURVE_COLOR, false);

    // draw the point
    drawCircle(CTX, point, POINT_SIZE, POINT_COLOR, true);

    // draw the line from center of circle to point
    drawLine(CTX, center, point, CURVE_COLOR);

    // draw trochoid path
    drawPath(CTX, points, CURVE_COLOR2);

    // change the iteration variables for animation
    if (forward) {
        // calculation: 
        // For 2*PI*R distance, rotation of point is 2*PI. 
        // For R distance, rotation of point is 1 radian
        center.x += RADIUS * SPEED;
        rotationInRad += SPEED;
        points.push(point);
    } else {
        center.x -= RADIUS * SPEED;
        rotationInRad -= SPEED;
        points.pop()
    }
    if (center.x > WIDTH + RADIUS) {
        forward = false;
    } else if (center.x < 0) {
        forward = true;
    }
    raf = requestAnimationFrame(drawTrochoid);
}

// epitrochoid
function centeredTrochoidHandler() {
    document.querySelector('.cwidthInput').value = CT_HEIGHT;
    if (ct_raf) cancelAnimationFrame(ct_raf);

    CT_R = parseInt(document.querySelector(`.ct_RInput`).value);
    CT_r = parseInt(document.querySelector(`.ct_rInput`).value);
    CT_DISTANCE = parseInt(document.querySelector(`.ct_distInput`).value);
    CT_SPEED = parseFloat(document.querySelector(`.ct_speedInput`).value);

    ct_rotationInRad = degToRad(-5);
    ct_points = [];
    ct_animate = true;

    console.log(CT_R, CT_r, CT_r / gcd(CT_R, CT_r), ct_rotationInRad);
    drawCenteredTrochoid();
}

function drawCenteredTrochoid() {
    drawRect(CT_CTX, new Point(-CT_WIDTH / 2, -CT_HEIGHT / 2), CT_WIDTH, CT_HEIGHT, BG_COLOR);

    // draw fixed circle
    drawCircle(CT_CTX, new Point(0, 0), CT_R, CURVE_COLOR);

    // draw the path of moving point
    drawPath(CT_CTX, ct_points, CURVE_COLOR2);

    if (ct_rotationInRad >= 2 * Math.PI * CT_r / gcd(CT_R, CT_r)) {
        console.log("Finished execution")
        cancelAnimationFrame(ct_raf);
        ct_animate = false;
    }

    if (ct_animate) {
        // draw moving circle
        let originX = (CT_R + CT_r) * Math.cos(ct_rotationInRad);
        let originY = (CT_R + CT_r) * Math.sin(ct_rotationInRad);
        drawCircle(CT_CTX, new Point(originX, originY), CT_r, CURVE_COLOR);

        // draw point
        // calculation:
        // Distance moved on fixed circle for rotation of t = (R+r)*t (for 2*PI angle, distance is 2*PI*(R+r))
        // For distance R*t, the rotation of point on moving circle R*t/r (for 2*PI*r distance, rotation of point on moving circle is 2*PI)
        let pointX = (CT_R + CT_r) * Math.cos(ct_rotationInRad) + CT_DISTANCE * Math.cos((CT_R + CT_r) * ct_rotationInRad / CT_r);
        let pointY = (CT_R + CT_r) * Math.sin(ct_rotationInRad) + CT_DISTANCE * Math.sin((CT_R + CT_r) * ct_rotationInRad / CT_r);
        drawCircle(CT_CTX, new Point(pointX, pointY), POINT_SIZE, POINT_COLOR, true);

        // draw line from center of moving circle to point
        drawLine(CT_CTX, new Point(originX, originY), new Point(pointX, pointY), CURVE_COLOR);

        ct_points.push(new Point(pointX, pointY));
        ct_rotationInRad += CT_SPEED;

        ct_raf = requestAnimationFrame(drawCenteredTrochoid);
    }
}

// hypotrochoid
function hypoTrochoidHandler() {
    document.querySelector('.hwidthInput').value = HT_HEIGHT;
    if (ht_raf) cancelAnimationFrame(ht_raf);

    HT_R = parseInt(document.querySelector(`.ht_RInput`).value);
    HT_r = parseInt(document.querySelector(`.ht_rInput`).value);
    HT_DISTANCE = parseInt(document.querySelector(`.ht_distInput`).value);
    HT_SPEED = parseFloat(document.querySelector(`.ht_speedInput`).value);

    ht_rotationInRad = degToRad(-5);
    ht_points = [];
    ht_animate = true;

    console.log(HT_R, HT_r, HT_r / gcd(HT_R, HT_r), ht_rotationInRad);
    drawHypoTrochoid();
}

function drawHypoTrochoid() {
    drawRect(HT_HTX, new Point(-HT_WIDTH / 2, -HT_HEIGHT / 2), HT_WIDTH, HT_HEIGHT, BG_COLOR);

    // draw fixed circle
    drawCircle(HT_HTX, new Point(0, 0), HT_R, CURVE_COLOR);

    // draw the path of moving point
    drawPath(HT_HTX, ht_points, CURVE_COLOR2);

    if (ht_rotationInRad >= 2 * Math.PI * HT_r / gcd(HT_R, HT_r)) {
        console.log("Finished execution")
        cancelAnimationFrame(ht_raf);
        ht_animate = false;
    }

    if (ht_animate) {
        // draw moving circle
        let originX = (HT_R - HT_r) * Math.cos(ht_rotationInRad);
        let originY = (HT_R - HT_r) * Math.sin(ht_rotationInRad);
        drawCircle(HT_HTX, new Point(originX, originY), HT_r, CURVE_COLOR);

        // draw point
        // calculation:
        // same as epitrochoid use R-r instead of R+r
        // anti clockwise movement of point, so using -sin for position of point on circle
        let pointX = (HT_R - HT_r) * Math.cos(ht_rotationInRad) + HT_DISTANCE * Math.cos((HT_R - HT_r) * ht_rotationInRad / HT_r);
        let pointY = (HT_R - HT_r) * Math.sin(ht_rotationInRad) - HT_DISTANCE * Math.sin((HT_R - HT_r) * ht_rotationInRad / HT_r);
        drawCircle(HT_HTX, new Point(pointX, pointY), POINT_SIZE, POINT_COLOR, true);

        // draw line from center of moving circle to point
        drawLine(HT_HTX, new Point(originX, originY), new Point(pointX, pointY), CURVE_COLOR);

        ht_points.push(new Point(pointX, pointY));
        ht_rotationInRad += HT_SPEED;

        ht_raf = requestAnimationFrame(drawHypoTrochoid);
    }
}

// utility function
function gcd(a, b) {
    return b == 0 ? a : gcd(b, a % b);
}