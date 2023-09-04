const root = document.getElementById('root');
const startStopButton = document.getElementById('start/stop');
const numOfNodes = 1000;
let intervals = [];
let timeouts = [];


const generateNodes = () => {
    const fragment = new DocumentFragment();
    for (let i = 0; i < numOfNodes; ++i) {
        const childNode = document.createElement("small");
        childNode.textContent = "•"
        childNode.id = `node-${i}`
        childNode.style.cssText = `
            padding: 5px;
            line-height: 5px;
            display: block;
            height: fit-content;
            width: fit-content;
            position: absolute;
        `;
        fragment.append(childNode);
    }
    const vortexNodes = document.createElement('div');
    vortexNodes.id = 'vortex-nodes';
    vortexNodes.append(fragment)
    root.append(vortexNodes);
}


const awaitElement = async (id) => {
    while (!document.getElementById(id)) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return document.getElementById(id);
};


const vortexLogic = (xAxis, yAxis, radius, angle, index) => {
    const targetNode = document.getElementById(`node-${index}`);
    const rotate = (a) => {
        let newRadius = radius;
        if (radius > 0) {
            newRadius = radius - (index * 2);
        }
        const px = xAxis + newRadius * Math.cos(a);
        const py = yAxis + newRadius * Math.sin(a);
        targetNode.style.left = px + "px";
        targetNode.style.top = py + "px";
    }
    const timeout = setTimeout(() => {
        const interval = setInterval(function () {
            angle = (angle + Math.PI / 360) % (Math.PI * 2);
            rotate(angle);
        }, 5);
        intervals.push(interval);
    }, (numOfNodes / 2) * index);
    timeouts.push(timeout);
}


const execVortex = () => {
    const xAxis = window.innerWidth / 2;
    const yAxis = window.innerHeight / 2;
    const radius = 500;
    let angle = 0;
    for (i = 0; i < numOfNodes; ++i) {
        vortexLogic(xAxis, yAxis, radius, angle, i);
    }
}


const start = () => {
    generateNodes();
    awaitElement('vortex-nodes').then(() => execVortex())
}


const stop = () => {
    for (let i = 0; i < timeouts?.length; i++) { clearTimeout(timeouts[i]); }
    timeouts = [];
    for (let i = 0; i < intervals?.length; i++) { clearInterval(intervals[i]); }
    intervals = [];
    document.getElementById('vortex-nodes').remove();
}


const handleStartStop = () => {
    if (!!(timeouts?.length > 0) || !!(intervals?.length > 0)) { stop(); }
    else if (!!(timeouts?.length < 1) && !!(intervals?.length < 1)) { start(); }
}


(() => startStopButton.addEventListener('click', () => handleStartStop()))();