const beizerCanvas = document.querySelector(".beizerCanvas");

const BG_COLOR = 'white';
const CURVE_COLOR = 'red';
const POINTS_COLOR = 'blue';
const REF_COLOR = `rgba(0,180,180,0.3)`;
const REF_COLOR2 = `rgba(200,200,0,0.3)`;
const POINT_RADIUS = 3;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equalsPoint(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)) <= POINT_RADIUS;
    }
}

const CTX = beizerCanvas.getContext("2d");
const HEIGHT = beizerCanvas.height = window.innerHeight * 0.8;
const WIDTH = beizerCanvas.width = HEIGHT;

let showRefLines = true;
let inputPoints = [];
let movablePointIndex = -1;

beizerCurveHandler();

function reset() {
    inputPoints = [];
    clearCanvas(CTX, WIDTH, HEIGHT);
}

function refLinesToggle() {
    showRefLines = !showRefLines;
    drawBeizerCurve(CTX, inputPoints);
}

function beizerCurveHandler() {
    let showWavesCheckbox = document.querySelector('input[type="checkbox"]');
    showWavesCheckbox.addEventListener('click', () => {
        showRefLines = showWavesCheckbox.checked;
        drawBeizerCurve(CTX, inputPoints);
    })

    let mouseMoveListener = (event) => {
        if (movablePointIndex >= 0) {
            let pos = getCursorPosition(beizerCanvas, event)

            inputPoints.splice(movablePointIndex, 1, pos);
            drawBeizerCurve(CTX, inputPoints);
        }
    };
    beizerCanvas.addEventListener('mousemove', mouseMoveListener);

    document.onkeydown = (event) => {
        if (event.key == "Escape") {
            beizerCanvas.removeEventListener('mousemove', mouseMoveListener);
            movablePointIndex = -1;
        };
    }

    beizerCanvas.addEventListener('mousedown', (event) => {
        beizerCanvas.addEventListener('mousemove', mouseMoveListener);
        let pos = getCursorPosition(beizerCanvas, event)
        movablePointIndex = indexOfNewPoint(inputPoints, pos);
        // first two are end points, so just insert at the end
        if (inputPoints.length < 2) {
            inputPoints.push(pos);
        }
        else if (inputPoints.length < 4) {
            // insert a new point only if one of the existing points is not clicked(user is not trying to move the existing points)
            if (movablePointIndex < 0) {
                // insert at last but one position as it is control point and not end point
                inputPoints.splice(inputPoints.length - 1, 0, pos);
            }
        }
        drawBeizerCurve(CTX, inputPoints);
    });
}

function indexOfNewPoint(points, searchP) {
    for (let i = 0; i < points.length; i++) {
        if (searchP.equalsPoint(points[i])) return i;
    }
    return -1;
}

function drawBeizerCurve(ctx, points) {
    clearCanvas(ctx, WIDTH, HEIGHT);
    drawAllInputPoints(ctx, points);

    switch (points.length) {
        case 1:
            break;
        case 2: // line
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.strokeStyle = CURVE_COLOR;
            ctx.stroke();
            break;
        case 3: // quadratic curve
            let pointsList = quadraticBeizerCurve(ctx, points[0], points[1], points[2], 0.1);
            ctx.strokeStyle = CURVE_COLOR;
            ctx.stroke();

            // draw reference lines
            if (showRefLines) {
                referenceLines(ctx, pointsList.pA_list, pointsList.pB_list);
                ctx.strokeStyle = REF_COLOR;
                ctx.stroke();
            }
            break;

        case 4: // cubic curve
            let cubicPointsList = cubicBeizerCurve(ctx, points[0], points[1], points[2], points[3], 0.05);
            ctx.strokeStyle = CURVE_COLOR;
            ctx.stroke();

            if (showRefLines) {
                ctx.strokeStyle = REF_COLOR2;
                referenceLines(ctx, cubicPointsList.pA_list, cubicPointsList.pB_list);
                ctx.stroke();

                referenceLines(ctx, cubicPointsList.pB_list, cubicPointsList.pC_list);
                ctx.stroke();

                ctx.strokeStyle = REF_COLOR;
                referenceLines(ctx, cubicPointsList.pAB_list, cubicPointsList.pBC_list);
                ctx.stroke();
            }
            break;
    }
}

function clearCanvas(ctx, width, height) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);
}

function drawAllInputPoints(ctx, points) {
    points.forEach(point => {
        circle(ctx, point.x, point.y, POINT_RADIUS);
        ctx.fillStyle = POINTS_COLOR;
        ctx.fill();
    });
}

// curves functions
function circle(ctx, originX, originY, radius) {
    ctx.beginPath();

    // drawing one polygon/circle
    for (let t = 0; t <= 2 * Math.PI; t += 0.5) {
        x = originX + radius * Math.cos(t);
        y = originY + radius * Math.sin(t);
        ctx.lineTo(x, y);
    }
    ctx.closePath();
}

function quadraticBeizerCurve(ctx, p0, p1, p2, res = 0.1) {
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    let pA_list = [];
    let pB_list = [];
    for (let t = 0; t <= 1; t += res) {
        let points = quadraticBeizerPoint(ctx, p0, p1, p2, t);

        ctx.lineTo(points.pFinal.x, points.pFinal.y);
        pA_list.push(points.pA);
        pB_list.push(points.pB);
    }
    ctx.lineTo(p2.x, p2.y);
    // final line
    pA_list.push(p1);
    pB_list.push(p2);
    return { pA_list, pB_list };
}

function cubicBeizerCurve(ctx, p0, p1, p2, p3, res = 0.1) {
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    let pA_list = [];
    let pB_list = [];
    let pC_list = [];
    let pAB_list = [];
    let pBC_list = [];
    for (let t = 0; t <= 1; t += res) {
        let points = cubicBeizerPoint(ctx, p0, p1, p2, p3, t);

        ctx.lineTo(points.pFinal.x, points.pFinal.y);
        pA_list.push(points.pA);
        pB_list.push(points.pB);
        pC_list.push(points.pC);
        pAB_list.push(points.pAB);
        pBC_list.push(points.pBC);
    }
    ctx.lineTo(p3.x, p3.y);
    // final line
    pA_list.push(p1);
    pB_list.push(p2);
    pC_list.push(p3);
    return { pA_list, pB_list, pC_list, pAB_list, pBC_list };
}

function quadraticBeizerPoint(ctx, p0, p1, p2, t) {
    let pA = lerp(p0, p1, t);
    let pB = lerp(p1, p2, t);
    let pFinal = lerp(pA, pB, t);
    return { pFinal, pA, pB };
}

function cubicBeizerPoint(ctx, p0, p1, p2, p3, t) {
    let pA = lerp(p0, p1, t);
    let pB = lerp(p1, p2, t);
    let pC = lerp(p2, p3, t);
    let pAB = lerp(pA, pB, t);
    let pBC = lerp(pB, pC, t);
    let pFinal = lerp(pAB, pBC, t);
    return { pFinal, pA, pB, pC, pAB, pBC };
}

function lerp(p0, p1, t) {
    let pResult = new Point();
    pResult.x = p0.x + t * (p1.x - p0.x);
    pResult.y = p0.y + t * (p1.y - p0.y);
    return pResult;
}

function referenceLines(CTX, startPointsList, endPointsList) {
    CTX.beginPath();
    for (let i = 0; i < startPointsList.length; i++) {
        CTX.moveTo(startPointsList[i].x, startPointsList[i].y);
        CTX.lineTo(endPointsList[i].x, endPointsList[i].y);
    }
}

// utility functions
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return new Point(x, y);
}