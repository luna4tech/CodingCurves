const beizerCanvas = document.querySelector(".lissCanvas");
const harmoCanvas = document.querySelector(".harmonograph");

const BG_COLOR = 'rgb(255,255,255)';
const CURVE_COLOR = 'rgb(255,0,0)';
const REF_COLOR = 'rgba(0, 255, 255, 0.2)';
const LISS_RES = 0.003;

// user inputs for lissajious curves
var HR, VR, HF, VF, PD, HDAMP, VDAMP, ITER, ANIMATE;
const CTX = beizerCanvas.getContext("2d");
const HEIGHT = beizerCanvas.height = window.innerHeight / 2;
const WIDTH = beizerCanvas.width = HEIGHT;

const HARMO_CTX = harmoCanvas.getContext("2d");
const HARMO_WIDTH = harmoCanvas.width = window.innerHeight * 0.9;
const HARMO_HEIGHT = harmoCanvas.height = HARMO_WIDTH;

CTX.translate(WIDTH / 2, HEIGHT / 2); // move origin to center of the canvas
CTX.scale(1, -1); // flip y-axis so that positive points upwards

HARMO_CTX.translate(HARMO_WIDTH / 2, HARMO_HEIGHT / 2);
HARMO_CTX.scale(1, -1);

lissajiousHandler();
harmonographHandler();

function lissajiousHandler() {
    listenToInputSlider('hr');
    listenToInputSlider('vr');
    listenToInput('hf');
    listenToInput('vf');
    listenToInputSlider('pd');

    // draw curve based on input values
    clearAndDrawLissajiousCurves();
}

function harmonographHandler() {
    console.log("Harmonograph handler");
    spinnerDisplay(true);

    setTimeout(() => {
        listenToInputSlider('hr');
        listenToInputSlider('vr');
        listenToInput('hf');
        listenToInput('vf');
        listenToInputSlider('pd');
        listenToInput('hdamp');
        listenToInput('vdamp');
        listenToInput('iter');
        let animateCheckbox = document.querySelector('#animateId');
        ANIMATE = animateCheckbox.checked;
        clearAndDrawHarmonograph();
        spinnerDisplay(false);
    },
        1000);
}

function spinnerDisplay(visible) {
    document.querySelector('.spinner-border').style.visibility = (visible == true ? "visible" : "hidden");
    document.querySelector('#resultBtnHarmonograph').disabled = visible;
}

function listenToInput(measure) {
    const inputElement = document.querySelector(`.${measure}Input`);
    setValue(measure, inputElement.value);
}

function listenToInputSlider(measure) {
    const inputPicker = document.querySelector(`.${measure}Input`);
    const inputValue = document.querySelector(`.${measure}Value`);
    setValue(measure, inputPicker.value);
    // add event listeners if user modifies the values
    inputPicker.addEventListener('input', () => {
        inputValue.textContent = inputPicker.value;
        setValue(measure, inputPicker.value);
        clearAndDrawLissajiousCurves();
    });
}

function setValue(measure, value) {
    switch (measure) {
        case 'hr':
            HR = value;
            break;
        case 'hf':
            HF = value;
            break;
        case 'vr':
            VR = value;
            break;
        case 'vf':
            VF = value;
            break;
        case 'pd':
            PD = parseInt(value);
            break;
        case 'hdamp':
            HDAMP = value;
            break;
        case 'vdamp':
            VDAMP = value;
            break;
        case 'iter':
            ITER = value;
            break;

    }
}

// draw functions
function clearAndDrawLissajiousCurves() {
    clearCanvas(CTX, WIDTH, HEIGHT);
    drawRefLines(CTX, WIDTH, HEIGHT);
    drawLissajiousCurves(CTX, HR * (WIDTH / 2) / 100, VR * (HEIGHT / 2) / 100, HF, VF, PD);
}

function clearAndDrawHarmonograph() {
    clearCanvas(HARMO_CTX, HARMO_WIDTH, HARMO_HEIGHT);
    //drawRefLines(HARMO_CTX, HARMO_WIDTH, HARMO_HEIGHT);
    HARMO_CTX.lineWidth = 0.2;
    drawLissajiousCurves(HARMO_CTX, HR * (HARMO_WIDTH / 2) / 100, VR * (HARMO_HEIGHT / 2) / 100,
        HF, VF, PD, HDAMP, VDAMP, ITER);
    if (ANIMATE) {
        PD = PD + 10;
        if (PD > Math.PI * 2)
            PD -= Math.PI * 2;
        requestAnimationFrame(clearAndDrawHarmonograph);
    }
}

function clearCanvas(ctx, width, height) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(-width / 2, -height / 2, width, height);
}

function drawLissajiousCurves(ctx, hr, vr, hf, vf, pd, hdamp = 0, vdamp = 0, iter = 1) {
    lissajiousCurve(ctx, 0, 0, hr, vr, hf, vf, pd, hdamp, vdamp, iter);

    ctx.strokeStyle = CURVE_COLOR;
    ctx.stroke();
}

function drawRefLines(ctx, cWidth, cHeight) {
    ctx.beginPath();
    ctx.moveTo(-cWidth / 2, 0);
    ctx.lineTo(cWidth / 2, 0);
    ctx.strokeStyle = REF_COLOR;
    ctx.stroke();

    ctx.moveTo(0, -cHeight / 2);
    ctx.lineTo(0, cHeight / 2);
    ctx.strokeStyle = REF_COLOR;
    ctx.stroke();
}

// curves functions
function lissajiousCurve(ctx, originX, originY, hr, vr, hf, vf, pd, hdamp = 0, vdamp = 0, iter = 1) {
    ctx.beginPath();

    for (let i = 0; i < iter; i++) {
        for (let t = 2 * Math.PI * i; t <= 2 * Math.PI * (i + 1); t += LISS_RES) {
            x = originX + Math.sin(hf * t + degToRad(pd)) * hr * Math.exp(-hdamp * t);
            y = originY + Math.sin(vf * t) * vr * Math.exp(-vdamp * t);
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
}

// utility functions
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}