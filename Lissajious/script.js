const lissCanvas = document.querySelector(".lissCanvas");
const hCanvas = document.querySelector(".hCanvas");
const vCanvas = document.querySelector(".vCanvas");

const BG_COLOR = 'rgb(255,255,255)';
const CURVE_COLOR = 'rgb(255,0,0)';
const REF_COLOR = 'rgba(0, 255, 255, 0.2)';
const LISS_RES = 0.003;
const WAVE_RES = 0.5;

// user inputs for lissajious curves
var HR, VR, HF, VF, PD;
const CTX = lissCanvas.getContext("2d");
const HEIGHT = lissCanvas.height = window.innerHeight / 2;
const WIDTH = lissCanvas.width = HEIGHT;

const HW_CTX = hCanvas.getContext("2d");
const HW_WIDTH = hCanvas.width = window.innerWidth * 0.45;
const HW_HEIGHT = hCanvas.height = window.innerHeight * 0.3;

const VW_CTX = vCanvas.getContext("2d");
const VW_WIDTH = vCanvas.width = window.innerWidth * 0.45;
const VW_HEIGHT = vCanvas.height = window.innerHeight * 0.3;

lissajiousHandler();

function lissajiousHandler() {
    CTX.translate(WIDTH / 2, HEIGHT / 2); // move origin to center of the canvas
    CTX.scale(1, -1); // flip y-axis so that positive points upwards

    HW_CTX.translate(HW_WIDTH / 2, HW_HEIGHT / 2);
    HW_CTX.scale(1, -1);

    VW_CTX.translate(VW_WIDTH / 2, VW_HEIGHT / 2);
    VW_CTX.scale(1, -1);

    listenToInput('hr');
    listenToInput('vr');
    listenToInput('hf');
    listenToInput('vf');
    listenToInput('pd');

    let showWavesCheckbox = document.querySelector('input[type="checkbox"]');
    showWavesCheckbox.addEventListener('click', () => {
        let waves = document.querySelector(".grid");

        if (showWavesCheckbox.checked)
            waves.style.display = "flex"
        else
            waves.style.display = "none"
    })
    // draw curve based on input values
    clearAndDrawLissajiousCurves();
}

function listenToInput(measure) {
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
            PD = value;
            break;
    }
}

// draw functions
function clearAndDrawLissajiousCurves() {
    clearCanvas(CTX, WIDTH, HEIGHT);
    drawRefLines(CTX, WIDTH, HEIGHT);
    drawLissajiousCurves(CTX, HR * (WIDTH / 2) / 100, VR * (HEIGHT / 2) / 100, HF, VF, PD);

    // draw corresponding waves 
    clearCanvas(HW_CTX, HW_WIDTH, HW_HEIGHT);
    drawRefLines(HW_CTX, HW_WIDTH, HW_HEIGHT);
    drawWave(HW_CTX, HW_WIDTH, HW_HEIGHT, HR, HF, PD);

    clearCanvas(VW_CTX, VW_WIDTH, VW_HEIGHT);
    drawRefLines(VW_CTX, VW_WIDTH, VW_HEIGHT);
    drawWave(VW_CTX, VW_WIDTH, VW_HEIGHT, VR, VF, 0);
}

function clearCanvas(ctx, width, height) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(-width / 2, -height / 2, width, height);
}

function drawLissajiousCurves(ctx, hr, vr, hf, vf, pd) {
    lissajiousCurve(ctx, 0, 0, hr, vr, hf, vf, pd);

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

function drawWave(ctx, cWidth, cHeight, amplitude, frequency, pd) {
    ctx.beginPath();
    ctx.strokeStyle = CURVE_COLOR;
    let ampHeight = (amplitude / 100) * cHeight / 2; // amplitude is in %. ampHeight is relative to height of canvas.
    for (let x = -cWidth / 2; x < cWidth / 2; x += WAVE_RES) {
        let t = (x / cWidth) * 2 * Math.PI;
        y = Math.sin(frequency * t + degToRad(pd)) * ampHeight;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

// curves functions
function lissajiousCurve(ctx, originX, originY, hr, vr, hf, vf, pd) {
    ctx.beginPath();

    for (let t = 0; t <= 2 * Math.PI; t += LISS_RES) {
        x = originX + Math.sin(hf * t + degToRad(pd)) * hr;
        y = originY + Math.sin(vf * t) * vr;
        ctx.lineTo(x, y);
    }
    ctx.closePath();
}

// utility functions
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}