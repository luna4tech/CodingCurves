const hCanvas = document.querySelector(".sinCanvas");
const vCanvas = document.querySelector(".cosCanvas");
hCanvas.width = window.innerWidth * 0.45;
hCanvas.height = window.innerHeight * 0.5;
vCanvas.width = window.innerWidth * 0.45;
vCanvas.height = window.innerHeight * 0.5;

let waveTypes = {
    sin: {
        canvas: hCanvas,
        curveFunc: Math.sin
    },
    cos: {
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
    clearCanvas(ctx, width, height);
    drawRefLines(ctx, width, height);

    drawTrig(ctx, width, height, amplitude, frequency, CURVE_COLOR, curveFunc);
}

function clearCanvas(ctx, width, height) {
    drawRect(ctx, new Point(-width / 2, -height / 2), width, height, BG_COLOR, true);
}

function drawRefLines(ctx, width, height) {
    drawLine(ctx, new Point(-width / 2, 0), new Point(width / 2, 0), REF_COLOR);
    drawLine(ctx, new Point(0, -height/2), new Point(0, height/2), REF_COLOR);
}