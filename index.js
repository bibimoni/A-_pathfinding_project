const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let slider_value_width = document.getElementById('width');
let sliderWidth = document.getElementById('slider-width').value;
let stateBtn = document.getElementById('state-display');
let changeStartPosBtn = document.getElementById('changeStartPos');
let changeEndPosBtn = document.getElementById('changeEndPos');
let addObstaclesBtn = document.getElementById('addObstacles');
let randomObstaclesBtn = document.getElementById('randomObstacles');
let runAlgorithmBtn = document.getElementById('runAlgorithm');
let allowDiagonalBtn = document.getElementById('allowDiagonal');
let previewVisitedBtn = document.getElementById('previewVisited');
let delayBtn = document.getElementById('delay');
let currentDelayBtn = document.getElementById('currentDelay');
let changeDelayBtn = document.getElementById('changeDelay');
let percentBtn = document.getElementById('percent');
let currentPercentBtn = document.getElementById('currentPercent');
let changePercentBtn = document.getElementById('changePercent');
let resultBtn = document.getElementById('result');
let stopBtn = document.getElementById('stop');

let states = [
    'edit', 'view', 'onChangingStartPos', 'onChangingEndPos', 'onAddingObstacles'
];

let currentState = states[0]; //the default state is edit
let windowWidth = window.innerWidth * .98; 
let windowHeight = window.innerHeight * .98;

canvas.width = windowWidth * 5/6;
canvas.height = windowHeight;

let board = new Board(sliderWidth);

init();
update();

//switch states on click
stateBtn.addEventListener('click', updateState);
//update on window resizing
window.addEventListener('resize', updateOnResizing);
//features call
changeStartPosBtn.addEventListener('click', updateStartPosition);
changeEndPosBtn.addEventListener('click', updateEndPosition);
addObstaclesBtn.addEventListener('click', updateObstacles);
randomObstaclesBtn.addEventListener('click', () => {board.randomizeObstacles();});
runAlgorithmBtn.addEventListener('click', runAlgorithm);
previewVisitedBtn.addEventListener('click', () => {board.previewVisited = !board.previewVisited;});
changeDelayBtn.addEventListener('click', () => {changeCurrentDelay(currentDelayBtn.value)})
changePercentBtn.addEventListener('click', () => {changeCurrentPercent(currentPercentBtn.value)})
stopBtn.addEventListener('click', () => {board.resetNode()});

function update() {
    window.requestAnimationFrame(update);
    updateValue();
    updateDimensions(); 
    updatePosStatus();
    displayFeatures();
    updateCurrentDelay();
    updateCurrentPercent();
    resultDisplay();
    updateAllowDiagonal();
    board.update();
}

function updateValue() {
    if(currentState !== states[0]) {
        freezeSlider(); 
        return;
    }
    unFreezeSlider();
    let newWidth = document.getElementById('slider-width').value;
    if(newWidth != sliderWidth) {
        sliderWidth = newWidth;
        //create new board upon changing dimensions
        board = new Board(sliderWidth);
    }
    //update the value show above the slider
    slider_value_width.innerHTML = `Width: ${sliderWidth}`;
}

function updateDimensions() {
    windowWidth = window.innerWidth * .98;
    windowHeight = window.innerHeight * .98;
    canvas.width = windowWidth * 5/6;
    canvas.height = windowHeight;
}

function updateOnResizing() {
    board.grid_width = canvas.width;
    board.grid_height = canvas.height;
}

function init() {
    board.drawGrid();
}

function resultDisplay() {
    if(board.executed) {
        document.querySelector('fieldset').style.display = 'flex';
        if(board.drawFinishedPath) {
            if(!board.foundPath) {
                resultBtn.innerHTML = "There is no such path";                
            }
            if(board.foundPath) {
                resultBtn.innerHTML = "Search successfully";
            }
            stopBtn.style.display = 'none';
        }
        if(!board.drawFinishedPath) {
            resultBtn.innerHTML = "Visualizing Search...";
            stopBtn.style.display = 'flex';
        }
    }
    else {
        document.querySelector('fieldset').style.display = 'none';
        stopBtn.style.display = 'none';
    }
}

function updateAllowDiagonal() {
    board.allowDiagonal = allowDiagonalBtn.checked;
}

function runAlgorithm() {
    if(currentState !== states[0]) return;
    board.a_star();
    currentState = states[1];
    stateBtn.innerHTML = 'View';
}

function updateCurrentDelay() {
    delayBtn.innerHTML = board.delay;
}

function updateCurrentPercent() {
    percentBtn.innerHTML = board.obstacleRatio * 100;
}


function changeCurrentDelay(val) {
    let isNum = /^\d+$/.test(val) //check if the given value is number
    if(isNum && val.length <= 8) {
        board.delay = val;
    }
}

function changeCurrentPercent(val) {
    let isNum = /^\d+$/.test(val) //check if the given value is number
    if(isNum && val.length <= 100 && val.length >= 0) {
        board.obstacleRatio = val / 100;
    }
}

function updateState() {
    console.log(currentState);
    if(currentState !== states[0] && currentState !== states[1]) return;
    if(currentState === states[0]) {
        currentState = states[1];
        stateBtn.innerHTML = 'View';
    }
    else if(currentState === states[1]) {
        currentState = states[0];    
        stateBtn.innerHTML = 'Edit';
        board.resetNode();
    }
}


