const lissCanvas = document.querySelector(".lissCanvas");
const hCanvas = document.querySelector(".hCanvas");
const vCanvas = document.querySelector(".vCanvas");

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
    drawTrig(HW_CTX, HW_WIDTH, HW_HEIGHT, HR, HF, CURVE_COLOR, Math.sin, PD);

    clearCanvas(VW_CTX, VW_WIDTH, VW_HEIGHT);
    drawRefLines(VW_CTX, VW_WIDTH, VW_HEIGHT);
    drawTrig(VW_CTX, VW_WIDTH, VW_HEIGHT, VR, VF, CURVE_COLOR, Math.sin, 0);
}

function clearCanvas(ctx, width, height) {
    drawRect(ctx, new Point(-width/2, -height/2), width, height, BG_COLOR);
}

function drawLissajiousCurves(ctx, hr, vr, hf, vf, pd) {
    lissajiousCurve(ctx, 0, 0, hr, vr, hf, vf, pd);

    ctx.strokeStyle = CURVE_COLOR;
    ctx.stroke();
}

function drawRefLines(ctx, cWidth, cHeight) {
    drawLine(ctx, new Point(-cWidth/2, 0), new Point(cWidth/2, 0), REF_COLOR);
    drawLine(ctx, new Point(-cHeight/2, 0), new Point(cHeight/2, 0), REF_COLOR);
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