const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let slider_value_width = document.getElementById('width');
let sliderWidth = document.getElementById('slider-width').value;
let stateBtn = document.getElementById('state-display');
let changeStartPosBtn = document.getElementById('changeStartPos');

let states = ['edit', 'view', 'onChanging'];

let currentState = states[0]; //the default state is edit
let windowWidth = window.innerWidth * .98; 
let windowHeight = window.innerHeight * .98;

canvas.width = windowWidth * 5/6;
canvas.height = windowHeight;

let board = new Board(sliderWidth);

init();
update();

function update() {
    window.requestAnimationFrame(update);
    updateValue();
    updateDimensions(); 
    updateStartingPosStatus();
    displayFeatures();
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

function init() {
    board.drawGrid();
}

function updateState() {
    if(currentState === states[0]) {
        currentState = states[1];
        stateBtn.innerHTML = 'View';
    }
    else if(currentState === states[1]) {
        currentState = states[0];    
        stateBtn.innerHTML = 'Edit';        
    }
}

function freezeSlider() {
    let slider = document.getElementById('slider-width')
    slider.disabled = true;
    slider.style.background = '#cfc7d4';
    slider.style.setProperty('--thumb-color', '#85827d');
    slider.style.setProperty('--thumb-cursor', 'default');
}

function unFreezeSlider() {
    let slider = document.getElementById('slider-width')
    slider.disabled = false;
    slider.style.background = '#2a6592';
    slider.style.setProperty('--thumb-color', '#f6b408');
    slider.style.setProperty('--thumb-cursor', 'pointer');
}

function updateStartingPosStatus() {
    let posElement = document.querySelector('span[name="pos"]');
    posElement.innerHTML = ` {${board.start.x};${board.start.y}}`;
}

function displayFeatures() {
    if(currentState === states[0]) {
        document.getElementById('edit').style.display = 'flex';
    }
    else if(currentState === states[1]) {
        document.getElementById('edit').style.display = 'none';
    }
}

function changeStartPosition() {

}

//switch states on click
stateBtn.addEventListener('click',updateState);
//update on window resizing
window.addEventListener('resize', () => {
    board.grid_width = canvas.width;
    board.grid_height = canvas.height;
});

changeStartPosBtn.addEventListener('click', changeStartPosition)
