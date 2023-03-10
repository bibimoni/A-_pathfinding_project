//features to change start, end positions and add obstacles

function displayFeatures() {
    if(currentState === states[0]) {
        document.getElementById('edit').style.display = 'flex';
        document.getElementById('view').style.display = 'none';
    }
    else if(currentState === states[1]) {
        document.getElementById('edit').style.display = 'none';
        document.getElementById('view').style.display = 'flex';
    }
}

//start positions

function updatePosStatus() {
    let posStartElement = document.querySelector('span[name="sPos"]');
    posStartElement.innerHTML = ` {${board.start.x};${board.start.y}}`;
    let posEndElement = document.querySelector('span[name="ePos"]');
    posEndElement.innerHTML = ` {${board.end.x};${board.end.y}}`;
}

function updateStartPosition() {
    if(currentState !== states[2] && currentState !== states[0]) {return;}
    if(currentState === states[2]) {
        changeStartPosBtn.innerHTML = `click to change start positions`;
        stateBtn.innerHTML = 'Edit';        
        currentState = states[0];  
        board.previewMousePosition = false;
        canvas.removeEventListener('mousemove', changePosition);
        document.getElementById('previewPos').style.display = 'none';
        return;
    }
    currentState = states[2];
    changeStartPosBtn.innerHTML = `click to return to edit`;
    stateBtn.innerHTML = 'changing start positions';  
    board.previewMousePosition = true;
    document.getElementById('previewPos').style.display = 'flex';
    canvas.addEventListener('mousemove', previewPos);
    canvas.addEventListener('click', changePosition);
}

//end positions 

function updateEndPosition() {
    if(currentState !== states[3] && currentState !== states[0]) {return;}
    if(currentState === states[3]) {
        changeEndPosBtn.innerHTML = `click to change end positions`;
        stateBtn.innerHTML = 'Edit';        
        currentState = states[0];  
        board.previewMousePosition = false;
        canvas.removeEventListener('mousemove', changePosition);
        document.getElementById('previewPos').style.display = 'none';
        return;
    }
    currentState = states[3];
    changeEndPosBtn.innerHTML = `click to return to edit`;
    stateBtn.innerHTML = 'changing end positions';  
    board.previewMousePosition = true;
    document.getElementById('previewPos').style.display = 'flex';
    canvas.addEventListener('mousemove', previewPos);
    canvas.addEventListener('click', changePosition);
}

//add obstacles to the board
function updateObstacles() {
    if(currentState !== states[4] && currentState !== states[0]) {return;}
    if(currentState === states[4]) {
        addObstaclesBtn.innerHTML = `click to add obstacles`;
        stateBtn.innerHTML = 'Edit';        
        currentState = states[0];  
        board.previewMousePosition = false;
        canvas.removeEventListener('mousemove', addingObstacles);
        document.getElementById('previewPos').style.display = 'none';
        return;
    }
    currentState = states[4];
    addObstaclesBtn.innerHTML = `click to return to edit`;
    stateBtn.innerHTML = 'adding Obstacles';  
    board.previewMousePosition = true;
    document.getElementById('previewPos').style.display = 'flex';
    canvas.addEventListener('mousemove', previewPos)
    canvas.addEventListener('click', addingObstacles);
}

function addingObstacles(e) {
    let currentMousePosition = getMousePosition(canvas, e);
    let currentBoardPosition = board.getMouseBoardPosition(currentMousePosition);
    if(!currentBoardPosition) return;
    if(currentBoardPosition === board.start || currentBoardPosition === board.end) return;
    board.nodes[currentBoardPosition.x][currentBoardPosition.y].isObstacle = !board.nodes[currentBoardPosition.x][currentBoardPosition.y].isObstacle;
    //console.log(board.nodes[currentBoardPosition.x][currentBoardPosition.y].isObstacle);
}

////////////////////////////////////////////////////////////////

function changePosition(e) {
    let currentMousePosition = getMousePosition(canvas, e);
    let currentBoardPosition = board.getMouseBoardPosition(currentMousePosition);
    
    //remove the old starting pos
    //let oldPos = (currentState === states[2]) ? board.start : board.end;
    //redraw the old position
    if(currentState === states[2]) {
        board.drawNode({x: board.start.x, y: board.start.y, color: 'black'});
        board.nodes[board.start.x][board.start.y].isStart = false;
    }
    if(currentState === states[3]) {
        board.drawNode({x: board.end.x, y: board.end.y, color: 'black'});
        board.nodes[board.end.x][board.end.y].isEnd = false;
    }
    //board.drawNode({x: oldPos.x, y: oldPos.y, color: 'black'});
    //change the current pos
    if(currentState === states[2]) {
        board.start = currentBoardPosition;
    }
    else if(currentState === states[3]) {
        board.end = currentBoardPosition;
    }
}

