const circleCanvas = document.querySelector(".circleCanvas");
const arcCanvas = document.querySelector(".arcCanvas");
const ellipseCanvas = document.querySelector(".ellipseCanvas");

const BG_COLOR = 'rgb(255,255,255)';
const REF_COLOR = 'rgba(0, 255, 255, 0.2)';
const GRADIENT1 = [195, 55, 100];
const GRADIENT2 = [29, 38, 113];

// user inputs for circle
var sides, number, rotation;
const cCtx = circleCanvas.getContext("2d");
const cWidth = circleCanvas.width = window.innerWidth * 0.45;
const cHeight = circleCanvas.height = Math.min(cWidth, window.innerHeight - 30);

// user inputs for arc
var start, end, radius, type;
const aCtx = arcCanvas.getContext("2d");
const aWidth = arcCanvas.width = window.innerWidth * 0.45;
const aHeight = arcCanvas.height = Math.min(aWidth, window.innerHeight - 30);

// user inputs for ellipse
var HR, VR, erotation;
const eCtx = ellipseCanvas.getContext("2d");
const eWidth = ellipseCanvas.width = window.innerWidth * 0.45;
const eHeight = ellipseCanvas.height = Math.min(eWidth, window.innerHeight - 30);

circleHandler();
arcHandler();
ellipseHandler();

function circleHandler() {
    cCtx.translate(cWidth / 2, cHeight / 2); // move origin to center of the canvas
    cCtx.scale(1, -1); // flip y-axis so that positive points upwards

    listenToInput('sides', 1);
    listenToInput('num', 1);
    listenToInput('rot', 1);

    // draw curve based on input values
    clearAndDrawConcentricCircles(cCtx, cWidth, cHeight, sides, number, rotation);
}

function arcHandler() {
    aCtx.translate(aWidth / 2, aHeight / 2); // move origin to center of the canvas
    aCtx.scale(1, -1); // flip y-axis so that positive points upwards

    listenToInput('start', 2);
    listenToInput('end', 2);
    listenToInput('radius', 2);
    const typeRadio = document.querySelector('input[name="type"]');
    type = typeRadio.value;

    document.querySelectorAll('input[name="type"]').forEach(typeRadio =>
        typeRadio.addEventListener('click', () => {
            type = typeRadio.value;
            console.log(type);
            clearAndDrawArc(aCtx, aWidth, aHeight, start, end, radius, type);
        })
    )

    // draw curve based on input values
    clearAndDrawArc(aCtx, aWidth, aHeight, start, end, radius, type);
}

function ellipseHandler() {
    eCtx.translate(cWidth / 2, cHeight / 2); // move origin to center of the canvas
    eCtx.scale(1, -1); // flip y-axis so that positive points upwards

    listenToInput('hr', 3);
    listenToInput('vr', 3);
    listenToInput('erot', 3);

    // draw curve based on input values
    clearAndDrawEllipse(eCtx, eWidth, eHeight, HR, VR, erotation);
}

function listenToInput(measure, canvas) {
    const inputPicker = document.querySelector(`.${measure}Input`);
    const inputValue = document.querySelector(`.${measure}Value`);
    setValue(measure, inputPicker.value);
    // add event listeners if user modifies the values
    inputPicker.addEventListener('input', () => {
        inputValue.textContent = inputPicker.value;
        setValue(measure, inputPicker.value);
        if (canvas == 1) {
            clearAndDrawConcentricCircles(cCtx, cWidth, cHeight, sides, number, rotation);
        }
        else if (canvas == 2) {
            clearAndDrawArc(aCtx, aWidth, aHeight, start, end, radius, type);
        }
        else if (canvas == 3) {
            clearAndDrawEllipse(eCtx, eWidth, eHeight, HR, VR, erotation);
        }
    });
}

function setValue(measure, value) {
    switch (measure) {
        case 'sides':
            sides = value;
            break;
        case 'rot':
            rotation = value;
            break;
        case 'num':
            number = value;
            break;

        case 'start':
            start = parseInt(value);
            break;
        case 'end':
            end = parseInt(value);
            break;
        case 'radius':
            radius = value;
            break;

        case 'hr':
            HR = value;
            break;
        case 'vr':
            VR = value;
            break;
        case 'erot':
            erotation = value;
            break;
    }
}

// draw functions
function clearAndDrawConcentricCircles(ctx, width, height, sides, number, rotation) {
    clearCanvas(ctx, width, height, BG_COLOR);
    drawConcentricCircles(ctx, width, height, sides, number, rotation);
}

function clearAndDrawArc(ctx, width, height, start, end, radius, type) {
    clearCanvas(ctx, width, height, BG_COLOR);
    drawArc(ctx, width, height, start, end, radius, type);
}

function clearAndDrawEllipse(ctx, width, height, hr, vr, rotation) {
    clearCanvas(ctx, width, height, BG_COLOR);
    drawEllipse(ctx, width, height, hr, vr, rotation);
}

function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(-width / 2, -height / 2, width, height);
}

function drawConcentricCircles(ctx, cWidth, cHeight, sides, number, rotation) {
    let maxRadius = Math.min(cWidth, cHeight) / 2 - 10;

    // drawing polygons from center to max size
    for (let radius = 0; radius <= maxRadius; radius += maxRadius / number) {
        circle(ctx, 0, 0, sides, radius, degToRad(rotation) * radius / maxRadius);

        ctx.strokeStyle = getGradientColor(GRADIENT1, GRADIENT2, radius / maxRadius);
        ctx.stroke();
    }
}

function drawEllipse(ctx, width, height, hr, vr, rotation) {
    drawRefLine(ctx, width, REF_COLOR);
    drawVerticalLine(ctx, height, REF_COLOR);

    ellipse(ctx, 0, 0, 100, (width / 2) * hr / 100, (height / 2) * vr / 100, degToRad(rotation));

    ctx.strokeStyle = 'rgb(255,0,0)';
    ctx.stroke();
}

function drawArc(ctx, cWidth, cHeight, start, end, radius, type) {
    drawRefLine(ctx, cWidth, REF_COLOR);
    drawVerticalLine(ctx, cHeight, REF_COLOR);

    let radiusComputed = (radius / 100) * (Math.min(cWidth, cHeight) / 2 - 10);
    arc(ctx, 0, 0, start, end, radiusComputed, type);

    ctx.strokeStyle = `rgb(255, 0, 0)`;
    ctx.stroke();
}

function drawRefLine(ctx, cWidth, color) {
    ctx.beginPath();
    ctx.moveTo(-cWidth / 2, 0);
    ctx.lineTo(cWidth / 2, 0);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

function drawVerticalLine(ctx, cHeight, color) {
    ctx.beginPath();
    ctx.moveTo(0, -cHeight/2);
    ctx.lineTo(0, cHeight/2);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}
// curves functions
function ellipse(ctx, originX, originY, sides, hr, vr, rotation) {
    ctx.beginPath();

    // drawing one polygon/circle
    for (let t = 0; t <= 2 * Math.PI; t += 2 * Math.PI / sides) {
        // we get these formulas by applying rotation transformation matrix to hr*cos(t), vr*sin(t)
        // rotation matrix is derived by finding where i and j lands after rotation
        // i ==> (cos rot, sin rot), j ==> (-sin rot, cos rot)
        x = originX + Math.cos(t) * Math.cos(rotation) * hr - Math.sin(t) * Math.sin(rotation) * vr;
        y = originY + Math.sin(t) * Math.cos(rotation) * vr + Math.cos(t) * Math.sin(rotation) * hr;
        ctx.lineTo(x, y);
    }
    ctx.closePath();
}

function circle(ctx, originX, originY, sides, radius, rotation) {
    ellipse(ctx, originX, originY, sides, radius, radius, rotation);
}

function arc(ctx, originX, originY, start, end, radius, type) {
    if (end < start) {
        let temp = start;
        start = end;
        end = temp;
    }
    ctx.beginPath();

    let startX = originX + Math.cos(degToRad(start)) * radius;
    let startY = originY + Math.sin(degToRad(start)) * radius;

    if (type == "segment") {
        ctx.moveTo(startX, startY);
    }
    if (type == "sector") {
        ctx.moveTo(originX, originY);
        ctx.lineTo(startX, startY);
    }

    // drawing arc
    for (let t = degToRad(start); t <= degToRad(end); t += 0.01) {
        let x = originX + Math.cos(t) * radius;
        let y = originY + Math.sin(t) * radius;
        ctx.lineTo(x, y);
    }
    if (type == "sector") {
        ctx.lineTo(originX, originY);
    }
    if (type == "segment") {
        ctx.closePath();
    }
}

// utility functions
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function getGradientColor(gradient1, gradient2, step) {
    let red = gradient1[0] + Math.floor((gradient2[0] - gradient1[0]) * step);
    let green = gradient1[1] + Math.floor((gradient2[1] - gradient1[1]) * step);
    let blue = gradient1[2] + Math.floor((gradient2[2] - gradient1[2]) * step);
    return `rgb(${red}, ${green}, ${blue})`;
}