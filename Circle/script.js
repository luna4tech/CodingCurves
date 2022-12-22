const circleCanvas = document.querySelector(".circleCanvas");
const arcCanvas = document.querySelector(".arcCanvas");
const ellipseCanvas = document.querySelector(".ellipseCanvas");

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

function clearCanvas(ctx, width, height) {
    drawRect(ctx, new Point(-width / 2, -height / 2), width, height, BG_COLOR, true);
}

function drawRefLines(ctx, width, height) {
    drawLine(ctx, new Point(-width / 2, 0), new Point(width / 2, 0), REF_COLOR);
    drawLine(ctx, new Point(0, -height/2), new Point(0, height/2), REF_COLOR);
}

function clearAndDrawConcentricCircles(ctx, width, height, sides, number, rotation) {
    clearCanvas(ctx, width, height);
    
    let maxRadius = Math.min(cWidth, cHeight) / 2 - 10;

    // drawing polygons from center to max size
    for (let radius = 0; radius <= maxRadius; radius += maxRadius / number) {
        let color = getGradientColor(GRADIENT1, GRADIENT2, radius / maxRadius);
        let rotationInRad = degToRad(rotation) * radius / maxRadius;
        drawPolygon(ctx, new Point(0,0), radius, sides, rotationInRad, color);
    }
}

function clearAndDrawArc(ctx, width, height, start, end, radius, type) {
    clearCanvas(ctx, width, height);
    drawRefLines(ctx, width, height);

    let radiusInPx = (radius / 100) * (Math.min(cWidth, cHeight) / 2 - 10);
    drawArc(ctx, new Point(0,0), start, end, radiusInPx, type, CURVE_COLOR);
}

function clearAndDrawEllipse(ctx, width, height, hr, vr, rotation) {
    clearCanvas(ctx, width, height);
    drawRefLines(ctx, width, height);

    let hrInPx = (width / 2) * hr / 100;
    let vrInPx = (height / 2) * vr / 100;
    drawEllipse(ctx, new Point(0, 0), hrInPx, vrInPx, degToRad(rotation), CURVE_COLOR);
}

// utility functions
function getGradientColor(gradient1, gradient2, step) {
    let red = gradient1[0] + Math.floor((gradient2[0] - gradient1[0]) * step);
    let green = gradient1[1] + Math.floor((gradient2[1] - gradient1[1]) * step);
    let blue = gradient1[2] + Math.floor((gradient2[2] - gradient1[2]) * step);
    return `rgb(${red}, ${green}, ${blue})`;
}