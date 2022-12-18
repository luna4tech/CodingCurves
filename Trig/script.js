const hCanvas = document.querySelector(".sinCanvas");
const vCanvas = document.querySelector(".cosCanvas");
hCanvas.width = window.innerWidth * 0.45;
hCanvas.height = window.innerHeight * 0.5;
vCanvas.width = window.innerWidth * 0.45;
vCanvas.height = window.innerHeight * 0.5;

const REF_COLOR = 'rgb(0, 255, 255)';
const CURVE_COLOR = 'rgb(255, 0, 100)';
const BG_COLOR = 'rgb(255,255,255)';

let waveTypes = {
    sin: {
        className: "sinWave",
        canvas: hCanvas,
        curveFunc: Math.sin
    },
    cos: {
        className: "cosWave",
        canvas: vCanvas,
        curveFunc: Math.cos
    }
};

function waveHandler(waveType) {
    // draw static elements
    let ctx = waveType.canvas.getContext("2d");
    let width = waveType.canvas.width;
    let height = waveType.canvas.height;
    ctx.translate(width / 2, height / 2); // move origin to center of the canvas
    ctx.scale(1,-1); // flip y-axis so that positive points upwards

    // get values for amplitude and frequency from the input slider
    const ampPicker = document.querySelector(`.ampInput`);
    const ampValue = document.querySelector(`.ampValue`);

    const freqPicker = document.querySelector(`.freqInput`);
    const freqValue = document.querySelector(`.freqValue`);

    let amplitude = ampPicker.value;
    let frequency = freqPicker.value;

    // draw curve based on input values
    clearAndDrawWaves(ctx, width, height, amplitude, frequency, waveType.curveFunc);

    // add event listeners if user modifies the values
    ampPicker.addEventListener('input', () => {
        amplitude = ampValue.textContent = ampPicker.value;
        clearAndDrawWaves(ctx, width, height, amplitude, frequency, waveType.curveFunc);
    });
    amplitude = ampPicker.value;

    freqPicker.addEventListener('input', () => {
        frequency = freqValue.textContent = freqPicker.value;
        clearAndDrawWaves(ctx, width, height, amplitude, frequency, waveType.curveFunc);
    });
}

waveHandler(waveTypes.sin);
waveHandler(waveTypes.cos);

// draw functions
function clearAndDrawWaves(ctx, width, height, amplitude, frequency, curveFunc) {
    clearCanvas(ctx, width, height, BG_COLOR);
    drawRefLine(ctx, width, REF_COLOR);
    drawVerticalLine(ctx, height, REF_COLOR);
    drawCurve(ctx, width, height, amplitude, frequency, CURVE_COLOR, curveFunc);
}

function clearCanvas(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(-width / 2, -height / 2, width, height);
}
function drawRefLine(ctx, cWidth, color) {
    ctx.beginPath();
    ctx.moveTo(-cWidth / 2, 0);
    ctx.lineTo(cWidth / 2, 0);
    ctx.strokeStyle = color;
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.closePath();
}

function drawVerticalLine(ctx, cHeight, color) {
    ctx.beginPath();
    ctx.moveTo(0, -cHeight/2);
    ctx.lineTo(0, cHeight/2);
    ctx.strokeStyle = color;
    ctx.setLineDash([10,5]);
    ctx.stroke();
    ctx.closePath();
}

function drawCurve(ctx, cWidth, cHeight, amplitude, frequency, color, curveFunc, res = 1) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.setLineDash([]);
    let ampHeight =  (amplitude / 100) * cHeight / 2; // amplitude is in %. ampHeight is relative to height of canvas.
    for (let x = -cWidth / 2; x < cWidth / 2; x += res) {
        y = curveFunc(x / cWidth * 2 * Math.PI * frequency) * ampHeight;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

// utility functions
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}