//get mouse position relative to canvas 
function getMousePosition(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left - 1; //1 is the border size
    let y = e.clientY - rect.top - 1; //1 is the border size
    return { x: x, y: y};
}

//preview the position as an outline where the cursor is pointing on
function previewPos(e) {
    let currentMousePosition = getMousePosition(canvas, e);
    let currentBoardPosition = board.getMouseBoardPosition(currentMousePosition);
    board.mouseCurrentPosition = currentBoardPosition;
    document.getElementById('previewPos').innerHTML = `{${currentBoardPosition.x};${currentBoardPosition.y}}`
}

//a function helps to freeze up the slider

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