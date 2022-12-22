const lissCanvas = document.querySelector(".lissCanvas");

// Parameters
let HR, VR, HF, VF, PD, SPEED;
const BALL_RADIUS = 10;

listenToInput('hr');
listenToInput('vr');
listenToInput('hf');
listenToInput('vf');
listenToInput('pd');
listenToInput('speed');

function listenToInput(measure) {
    const inputPicker = document.querySelector(`.${measure}Input`);
    const inputValue = document.querySelector(`.${measure}Value`);
    setValue(measure, inputPicker.value);
    // add event listeners if user modifies the values
    inputPicker.addEventListener('input', () => {
        inputValue.textContent = inputPicker.value;
        setValue(measure, inputPicker.value);
        t=0;
        lissAnimation();
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
        case 'speed':
            SPEED = parseFloat(value);
            break;
    }
}

const CTX = lissCanvas.getContext("2d");
const HEIGHT = lissCanvas.height = window.innerHeight * 0.8;
const WIDTH = lissCanvas.width = HEIGHT;
CTX.translate(WIDTH / 2, HEIGHT / 2); // move origin to center of the canvas
CTX.scale(1, -1); // flip y-axis so that positive points upwards

let t=0;
lissAnimation();


function lissAnimation() {
    clearCanvas(CTX, WIDTH, HEIGHT);
    let r = WIDTH / 2 - BALL_RADIUS;

    let originX = (HR / 100) * r * Math.sin(HF * t + degToRad(PD));
    let originY = (VR / 100) * r * Math.sin(VF * t);
    drawCircle(CTX, new Point(originX, originY), BALL_RADIUS, POINT_COLOR, true);

    t += SPEED/HF;
    requestAnimationFrame(lissAnimation)
}

function clearCanvas(ctx, width, height) {
    drawRect(ctx, new Point(-width/2, -height/2), width, height, BG_COLOR);
}

function lissajiousCurve(ctx, originX, originY, hr, vr, hf, vf, pd) {
    ctx.beginPath();

    for (let t = 0; t <= 2 * Math.PI; t += LISS_RES) {
        x = originX + Math.sin(hf * t + degToRad(pd)) * hr;
        y = originY + Math.sin(vf * t) * vr;
        ctx.lineTo(x, y);
    }
    ctx.closePath();
}