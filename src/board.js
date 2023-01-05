class Board {
    constructor(
        width,
        startingPos = { x: 0, y: 0 },
        endingPos = { x: 1, y: 0 },
        obstacleRatio = 0.3
    ) {
        this.start = { x: startingPos.x, y: startingPos.y };
        this.end = { x: endingPos.x, y: endingPos.y };
        this.grid_width = canvas.width;
        this.grid_height = canvas.height;
        this.ratio = this.grid_height / this.grid_width;
        this.board_width = width;
        this.board_height = Math.round(this.board_width * this.ratio);
        //for preview mode in changing starting positions
        this.mouseCurrentPosition = { x: 0, y: 0 };
        this.previewMousePosition = false;
        this.nodes = [];
        this.allowDiagonal = true;
        this.resetNode();
        this.gridLineWidth = .5;
        this.obstacleRatio = obstacleRatio;
        this.delay = 5;
        //for draw nodes on screen
        this.visitedNode = []; //stores the visited nodes
        this.nodesToBeDrawn = [];
        this.hasBeenPreviewed = false;
        this.executed = false;
        this.drawFinishedPath = false;
        this.fMax = 0;
        this.fMin = INF;
        this.fMaxOfResult = 0; //max f score of the result path 
        //for displaying purposes
        this.previewVisited = true; // change upon click in view state
    }

    a_star() {
        this.executed = true;
        //open list stores f (f = g + h) and i, j
        let openList = new Set();
        let closeList = create2DArray({ x: this.board_width, y: this.board_height, val: false });
        let foundDest = false;

        let i, j;
        i = this.start.x; j = this.start.y;
        this.nodes[this.start.x][this.start.y].fScore = 0;
        this.nodes[this.start.x][this.start.y].hScore = 0;
        this.nodes[this.start.x][this.start.y].gScore = 0;
        this.nodes[this.start.x][this.start.y].parent.x = i;
        this.nodes[this.start.x][this.start.y].parent.y = j;

        //first node has f = 0
        openList.add([0, [i, j]]);

        while (openList.length !== 0) {
            let current = [...openList][0];
            openList.delete(current);
            
            i = current[1][0];
            j = current[1][1];
            
            closeList[i][j] = true;

            let gNew, hNew, fNew;

            // x - 1, y //////////////////////////////////////////////////////////////////////////////////////////////////

            if (this.isValid({ x: i - 1, y: j })) {
                //console.log(`x - 1 y`)
                if (this.isDestination({ x: i - 1, y: j })) {
                    this.nodes[i - 1][j].parent.x = i;
                    this.nodes[i - 1][j].parent.y = j;
                    //console.log(this.nodes[i - 1][j])
                    console.log("Found  destination");
                    this.tracePath();
                    foundDest = true;
                    return;
                }
                else if (!closeList[i - 1][j] && !this.nodes[i - 1][j].isObstacle) {
                    gNew = this.nodes[i][j].gScore + 1.0;
                    hNew = this.calculateHScore({ x: i - 1, y: j });
                    fNew = gNew + hNew;

                    if (this.nodes[i - 1][j].fScore === INF
                        || this.nodes[i - 1][j].fScore > fNew) {
                        // console.log([fNew, [i - 1, j]]);
                        openList.add([fNew, [i - 1, j]]);
                        this.updateMaxMinFScore(fNew);
                        this.visitedNode.push({ x: i - 1, y: j });

                        this.nodes[i - 1][j].fScore = fNew;
                        this.nodes[i - 1][j].gScore = gNew;
                        this.nodes[i - 1][j].hScore = hNew;
                        this.nodes[i - 1][j].parent.x = i;
                        this.nodes[i - 1][j].parent.y = j;
                        //console.log(this.nodes[i - 1][j])
                    }
                }
            }

            // x + 1, y //////////////////////////////////////////////////////////////////////////////////////////////////

            if (this.isValid({ x: i + 1, y: j })) {
                //console.log(`x + 1 y`)
                if (this.isDestination({ x: i + 1, y: j })) {
                    this.nodes[i + 1][j].parent.x = i;
                    this.nodes[i + 1][j].parent.y = j;
                    //console.log(this.nodes[i + 1][j]);
                    console.log("Found  destination");
                    this.tracePath();
                    foundDest = true;
                    return;
                }
                else if (!closeList[i + 1][j] && !this.nodes[i + 1][j].isObstacle) {
                    gNew = this.nodes[i][j].gScore + 1.0;
                    hNew = this.calculateHScore({ x: i + 1, y: j });
                    fNew = gNew + hNew;

                    if (this.nodes[i + 1][j].fScore === INF
                        || this.nodes[i + 1][j].fScore > fNew) {
                        // console.log([fNew, [i + 1, j]])
                        openList.add([fNew, [i + 1, j]]);
                        this.updateMaxMinFScore(fNew);
                        this.visitedNode.push({ x: i + 1, y: j });

                        this.nodes[i + 1][j].fScore = fNew;
                        this.nodes[i + 1][j].gScore = gNew;
                        this.nodes[i + 1][j].hScore = hNew;
                        this.nodes[i + 1][j].parent.x = i;
                        this.nodes[i + 1][j].parent.y = j;
                        //console.log(this.nodes[i + 1][j]);
                    }
                }
            }

            // x, y - 1 //////////////////////////////////////////////////////////////////////////////////////////////////

            if (this.isValid({ x: i, y: j - 1 })) {
                //console.log(`x y - 1`)
                if (this.isDestination({ x: i, y: j - 1 })) {
                    this.nodes[i][j - 1].parent.x = i;
                    this.nodes[i][j - 1].parent.y = j;
                    //console.log(this.nodes[i][j - 1].parent)
                    console.log("Found  destination");
                    this.tracePath();
                    foundDest = true;
                    return;
                }
                else if (!closeList[i][j - 1] && !this.nodes[i][j - 1].isObstacle) {
                    gNew = this.nodes[i][j].gScore + 1.0;
                    hNew = this.calculateHScore({ x: i, y: j - 1 });
                    fNew = gNew + hNew;

                    if (this.nodes[i][j - 1].fScore === INF
                        || this.nodes[i][j - 1].fScore > fNew) {
                        // console.log([fNew, [i, j - 1]])
                        openList.add([fNew, [i, j - 1]]);
                        this.visitedNode.push({ x: i, y: j - 1 });
                        this.updateMaxMinFScore(fNew);
                        
                        this.nodes[i][j - 1].fScore = fNew;
                        this.nodes[i][j - 1].gScore = gNew;
                        this.nodes[i][j - 1].hScore = hNew;
                        this.nodes[i][j - 1].parent.x = i;
                        this.nodes[i][j - 1].parent.y = j;
                        //console.log(this.nodes[i][j - 1].parent)
                    }
                }
            }

            // x, y + 1 //////////////////////////////////////////////////////////////////////////////////////////////////

            if (this.isValid({ x: i, y: j + 1 })) {
                //console.log(`x y + 1`)
                if (this.isDestination({ x: i, y: j + 1 })) {
                    this.nodes[i][j + 1].parent.x = i;
                    this.nodes[i][j + 1].parent.y = j;
                    //console.log(this.nodes[i][j + 1].parent)
                    console.log("Found  destination");
                    this.tracePath();
                    foundDest = true;
                    return;
                }
                else if (!closeList[i][j + 1] && !this.nodes[i][j + 1].isObstacle) {
                    gNew = this.nodes[i][j].gScore + 1.0;
                    hNew = this.calculateHScore({ x: i, y: j + 1 });
                    fNew = gNew + hNew;

                    if (this.nodes[i][j + 1].fScore === INF
                        || this.nodes[i][j + 1].fScore > fNew) {
                        // console.log([fNew, [i, j + 1]])
                        openList.add([fNew, [i, j + 1]]);
                        this.visitedNode.push({ x: i, y: j + 1 });
                        this.updateMaxMinFScore(fNew);

                        this.nodes[i][j + 1].fScore = fNew;
                        this.nodes[i][j + 1].gScore = gNew;
                        this.nodes[i][j + 1].hScore = hNew;
                        this.nodes[i][j + 1].parent.x = i;
                        this.nodes[i][j + 1].parent.y = j;
                        //console.log(this.nodes[i][j + 1].parent)
                    }
                }
            }
            if (this.allowDiagonal) {
                // x + 1, y + 1 //////////////////////////////////////////////////////////////////////////////////////////////////

                if (this.isValid({ x: i + 1, y: j + 1 })) {
                    //console.log(`x + 1 y + 1`)
                    if (this.isDestination({ x: i + 1, y: j + 1 })) {
                        this.nodes[i + 1][j + 1].parent.x = i;
                        this.nodes[i + 1][j + 1].parent.y = j;
                        //console.log(this.nodes[i + 1][j + 1].parent);
                        console.log("Found  destination");
                        this.tracePath();
                        foundDest = true;
                        return;
                    }
                    else if (!closeList[i + 1][j + 1] && !this.nodes[i + 1][j + 1].isObstacle) {
                        gNew = this.nodes[i][j].gScore + 1.0;
                        hNew = this.calculateHScore({ x: i + 1, y: j + 1 });
                        fNew = gNew + hNew;

                        if (this.nodes[i + 1][j + 1].fScore === INF
                            || this.nodes[i + 1][j + 1].fScore > fNew) {
                            // console.log([fNew, [i + 1, j + 1]])
                            openList.add([fNew, [i + 1, j + 1]]);
                            this.visitedNode.push({ x: i + 1, y: j + 1 });
                            this.updateMaxMinFScore(fNew);

                            this.nodes[i + 1][j + 1].fScore = fNew;
                            this.nodes[i + 1][j + 1].gScore = gNew;
                            this.nodes[i + 1][j + 1].hScore = hNew;
                            this.nodes[i + 1][j + 1].parent.x = i;
                            this.nodes[i + 1][j + 1].parent.y = j;
                            //console.log(this.nodes[i + 1][j + 1].parent);
                        }
                    }
                }

                // x - 1, y + 1 //////////////////////////////////////////////////////////////////////////////////////////////////

                if (this.isValid({ x: i - 1, y: j + 1 })) {
                    //console.log(`x - 1 y + 1`)
                    if (this.isDestination({ x: i - 1, y: j + 1 })) {
                        this.nodes[i - 1][j + 1].parent.x = i;
                        this.nodes[i - 1][j + 1].parent.y = j;
                        //console.log(this.nodes[i - 1][j + 1].parent);
                        console.log("Found  destination");
                        this.tracePath();
                        foundDest = true;
                        return;
                    }
                    else if (!closeList[i - 1][j + 1] && !this.nodes[i - 1][j + 1].isObstacle) {
                        gNew = this.nodes[i][j].gScore + 1.0;
                        hNew = this.calculateHScore({ x: i - 1, y: j + 1 });
                        fNew = gNew + hNew;

                        if (this.nodes[i - 1][j + 1].fScore === INF
                            || this.nodes[i - 1][j + 1].fScore > fNew) {
                            // console.log([fNew, [i - 1, j + 1]]);
                            openList.add([fNew, [i - 1, j + 1]]);
                            this.visitedNode.push({ x: i - 1, y: j + 1 });
                            this.updateMaxMinFScore(fNew);

                            this.nodes[i - 1][j + 1].fScore = fNew;
                            this.nodes[i - 1][j + 1].gScore = gNew;
                            this.nodes[i - 1][j + 1].hScore = hNew;
                            this.nodes[i - 1][j + 1].parent.x = i;
                            this.nodes[i - 1][j + 1].parent.y = j;
                            //console.log(this.nodes[i - 1][j + 1].parent);
                        }
                    }
                }

                // x - 1, y - 1 //////////////////////////////////////////////////////////////////////////////////////////////////

                if (this.isValid({ x: i - 1, y: j - 1 })) {
                    //console.log(`x - 1 y - 1`)
                    if (this.isDestination({ x: i - 1, y: j - 1 })) {
                        this.nodes[i - 1][j - 1].parent.x = i;
                        this.nodes[i - 1][j - 1].parent.y = j;
                        //console.log(this.nodes[i - 1][j - 1].parent);
                        console.log("Found  destination");
                        this.tracePath();
                        foundDest = true;
                        return;
                    }
                    else if (!closeList[i - 1][j - 1] && !this.nodes[i - 1][j - 1].isObstacle) {
                        gNew = this.nodes[i][j].gScore + 1.0;
                        hNew = this.calculateHScore({ x: i - 1, y: j - 1 });
                        fNew = gNew + hNew;

                        if (this.nodes[i - 1][j - 1].fScore === INF
                            || this.nodes[i - 1][j - 1].fScore > fNew) {
                            // console.log([fNew, [i - 1, j - 1]])
                            openList.add([fNew, [i - 1, j - 1]]);
                            this.visitedNode.push({ x: i - 1, y: j - 1 });
                            this.updateMaxMinFScore(fNew);

                            this.nodes[i - 1][j - 1].fScore = fNew;
                            this.nodes[i - 1][j - 1].gScore = gNew;
                            this.nodes[i - 1][j - 1].hScore = hNew;
                            this.nodes[i - 1][j - 1].parent.x = i;
                            this.nodes[i - 1][j - 1].parent.y = j;
                            //console.log(this.nodes[i - 1][j - 1].parent);
                        }
                    }
                }

                // x + 1, y - 1 //////////////////////////////////////////////////////////////////////////////////////////////////

                if (this.isValid({ x: i + 1, y: j - 1 })) {
                    //console.log(`x + 1 y - 1`)
                    if (this.isDestination({ x: i + 1, y: j - 1 })) {
                        this.nodes[i + 1][j - 1].parent.x = i;
                        this.nodes[i + 1][j - 1].parent.y = j;
                        //console.log(this.nodes[i + 1][j - 1].parent);
                        console.log("Found  destination");
                        this.tracePath();
                        foundDest = true;
                        return;
                    }
                    else if (!closeList[i + 1][j - 1] && !this.nodes[i + 1][j - 1].isObstacle) {
                        gNew = this.nodes[i][j].gScore + 1.0;
                        hNew = this.calculateHScore({ x: i + 1, y: j - 1 });
                        fNew = gNew + hNew;

                        if (this.nodes[i + 1][j - 1].fScore === INF
                            || this.nodes[i + 1][j - 1].fScore > fNew) {
                            openList.add([fNew, [i + 1, j - 1]]);
                            this.visitedNode.push({ x: i + 1, y: j - 1 });
                            this.updateMaxMinFScore(fNew);

                            this.nodes[i + 1][j - 1].fScore = fNew;
                            this.nodes[i + 1][j - 1].gScore = gNew;
                            this.nodes[i + 1][j - 1].hScore = hNew;
                            this.nodes[i + 1][j - 1].parent.x = i;
                            this.nodes[i + 1][j - 1].parent.y = j;
                            //console.log(this.nodes[i + 1][j - 1].parent);
                        }
                    }
                }
            }
        }

        if (!foundDest) {
            console.log("Can't reach destination");
        }
        return;
    }

    calculateHScore({ x, y }) {
        return Math.sqrt(Math.pow(x - this.end.x, 2) + Math.pow(y - this.end.y, 2));
    }

    tracePath() {
        let path = [];
        let x = this.end.x;
        let y = this.end.y;

        while (!(this.nodes[x][y].parent.x === x && this.nodes[x][y].parent.y === y)) {
            path.push(this.nodes[x][y]);
            if(x !== this.end.x && y !== this.end.y && this.nodes[x][y].fScore <= this.fMax) {
                this.fMaxOfResult = Math.max(this.nodes[x][y].fScore, this.fMaxOfResult);
                //console.log(this.fMaxOfResult);
            }
            let temp_x = this.nodes[x][y].parent.x;
            let temp_y = this.nodes[x][y].parent.y;
            x = temp_x;
            y = temp_y;
            if (x === -1 && y === -1) break;
        }
        if (!(x === -1 && y === -1)) path.push(this.nodes[x][y]);

        if (this.drawFinishedPath) {
            let lineColor = '#003775'; //blue
            while (path.length !== 0) {
                let currentNode1 = path.pop();
                if(path.length === 0) break;
                let currentNode2 = path[path.length - 1];
                
                this.drawLine({
                    x1: currentNode1.x,
                    y1: currentNode1.y,
                    x2: currentNode2.x,
                    y2: currentNode2.y,
                    color: lineColor
                })
                //console.log(this.nodes[currentNode.x][currentNode.y].fScore);
            }
        }
        if (!this.hasBeenPreviewed) { this.addVisitedNodes(); }
        return;
    }

    drawVisitedNode() {
        if(!this.fMaxOfResult) {
            return;
        }
        let range = this.fMax - this.fMin;
        
        let baseRatio = (this.fMaxOfResult - this.fMin) / range //ratio between fMax and fMaxOfResult
        //0 -> a: green / a -> b: lighter green / b -> c: orange / c -> inf: red
        let remainingRatio = 1 - baseRatio;
        let a = range * (baseRatio + 1/20) + this.fMin;
        let b = range * (baseRatio + remainingRatio * 1/3 + 1/20) + this.fMin;
        let c = range * (baseRatio + remainingRatio * 2/3 + 1/20) + this.fMin;
        //console.log(this.fMin, a, b, c, this.fMax);
        //console.log(a, b);
        for (const node of this.nodesToBeDrawn) {
            let colorOfNode;
            let x = node.x, y = node.y;
            
            if(this.nodes[x][y].fScore <= a) {
                colorOfNode = '#9bf707'; //green
            }
            else if(this.nodes[x][y].fScore > a && this.nodes[x][y].fScore <= b) {
                colorOfNode = '#7bab85'; //lighter green #7bab85
            }
            else if(this.nodes[x][y].fScore > b && this.nodes[x][y].fScore <= c) {
                colorOfNode = '#e88915'; //orange
            }
            else {
                colorOfNode = '#f54905'; //red
            }
            this.drawNode({
                x: node.x,
                y: node.y,
                color: colorOfNode
            })
        }
    }

    addVisitedNodes() {
        let k = 0;
        let check = 0;
        for (const visitedNode of this.visitedNode) {
            k++;
            setTimeout(() => {
                this.drawNode({
                    x: visitedNode.x,
                    y: visitedNode.y,
                    color: '#807644'
                })
                this.nodesToBeDrawn.push(visitedNode);
                check++;
                if (check == this.visitedNode.length) {
                    this.drawFinishedPath = true; console.log("draw finished");
                }
            }, k * this.delay);
        }
        this.hasBeenPreviewed = true;
    }

    isValid({ x, y }) {
        return (x >= 0 && y >= 0 && x < this.board_width && y < this.board_height);
    }
    
    isDestination({ x, y }) {
        return (x === this.end.x && y === this.end.y);
    }

    updateNode() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j < this.nodes[i].length; j++) {
                this.nodes[i][j].displayNode();
            }
        }
        this.nodes[this.start.x][this.start.y].isStart = true;
        this.nodes[this.start.x][this.start.y].isObstacle = this.nodes[this.start.x][this.start.y].isEnd = false;
        this.nodes[this.end.x][this.end.y].isEnd = true;
        this.nodes[this.end.x][this.end.y].isObstacle = this.nodes[this.end.x][this.end.y].start = false;
    }

    drawPreviewNode() {
        if (!this.previewMousePosition) {
            return
        }
        this.drawOutline({
            x: this.mouseCurrentPosition.x,
            y: this.mouseCurrentPosition.y,
            color: '#645beb'
        });
    }

    updateMaxMinFScore(fNew) {
        this.fMax = Math.max(fNew, this.fMax);
        this.fMin = Math.min(fNew, this.fMin);
    }

    drawGrid() {
        ctx.lineWidth = this.gridLineWidth;
        ctx.strokeStyle = 'white';
        for (let i = 0; i < this.board_width; i++) {
            ctx.beginPath();
            ctx.moveTo(i * this.grid_width / this.board_width, 0);
            ctx.lineTo(i * this.grid_width / this.board_width, this.grid_height);
            ctx.stroke();
            ctx.closePath();
        }
        for (let i = 0; i < this.board_height; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * this.grid_height / this.board_height);
            ctx.lineTo(this.grid_width, i * this.grid_height / this.board_height);
            ctx.stroke();
            ctx.closePath();
        }
    }

    randomizeObstacles() {
        for (let i = 0; i < this.board_width; i++) {
            for (let j = 0; j < this.board_height; j++) {
                if (this.nodes[i][j].isStart || this.nodes[i][j].isEnd) continue;
                const randomBoolean = Math.random() < this.obstacleRatio;
                this.nodes[i][j].isObstacle = randomBoolean; //randomize the obstacle
            }
        }
        //console.table(this.nodes);
    }

    //translate mouse position to grid position
    getMouseBoardPosition(mouseCurrentPosition = { x, y }) {
        let translated = { x: 0, y: 0 }
        let boardX = this.grid_width;
        let boardY = this.grid_height;
        for (let i = 0; i < this.board_width; i++) {
            if (mouseCurrentPosition.x > i * (boardX / this.board_width) && mouseCurrentPosition.x < (i + 1) * (boardX / this.board_width)) {
                translated.x = i;
            }
        }
        for (let i = 0; i < this.board_height; i++) {
            if (mouseCurrentPosition.y > i * (boardY / this.board_height) && mouseCurrentPosition.y < (i + 1) * (boardY / this.board_height)) {
                translated.y = i;
            }
        }
        return translated
    }

    //draw node with the given coords
    drawNode({ x, y, color }) {
        const nodeWidth = this.grid_width / this.board_width - this.gridLineWidth;
        const nodeHeight = this.grid_height / this.board_height - this.gridLineWidth;
        const startX = x * this.grid_width / this.board_width + this.gridLineWidth;
        const startY = y * this.grid_height / this.board_height + this.gridLineWidth;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(startX, startY, nodeWidth, nodeHeight);
        ctx.closePath();
    }
    
    drawLine({x1, y1, x2, y2, color}) {
        const nodeWidth = this.grid_width / this.board_width;
        ctx.lineWidth = nodeWidth * 1/20;
        ctx.strokeStyle = color 
        let firstCoords = this.getCenter({x: x1, y: y1});
        let secondCoords = this.getCenter({x: x2, y: y2});
        ctx.beginPath();
        ctx.moveTo(firstCoords.x, firstCoords.y);
        ctx.lineTo(secondCoords.x, secondCoords.y);
        ctx.stroke();
        ctx.closePath();
    }
    
    //returns the center coords of a grid box
    getCenter({x, y}) {
        const nodeWidth = this.grid_width / this.board_width;
        const nodeHeight = this.grid_height / this.board_height;
        return {
            x : x * nodeWidth + nodeWidth / 2,
            y : y * nodeHeight + nodeHeight / 2
        }
    }
    
    //draw an outline with the given coords
    drawOutline({ x, y, color }) {
        ctx.lineWidth = this.gridLineWidth * 5;
        ctx.strokeStyle = color;
        const nodeWidth = this.grid_width / this.board_width;
        const nodeHeight = this.grid_height / this.board_height;
        const startX = x * this.grid_width / this.board_width;
        const startY = y * this.grid_height / this.board_height;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + nodeWidth, startY);
        ctx.lineTo(startX + nodeWidth, startY + nodeHeight);
        ctx.lineTo(startX, startY + nodeHeight);
        ctx.lineTo(startX, startY);
        ctx.stroke();
        ctx.closePath();
    }

    resetNode() {
        for (let i = 0; i < this.board_width; i++) {
            this.nodes[i] = [];
            for (let j = 0; j < this.board_height; j++) {
                this.nodes[i][j] = new Node({ x: i, y: j });
                if (i == this.start.x && j == this.start.y) this.nodes[i][j].isStart = true;
                else if (i == this.end.x && j == this.end.y) this.nodes[i][j].isEnd = true;
            }
        }
        this.visitedNode = [];
        this.nodesToBeDrawn = [];
        this.hasBeenPreviewed = false;
        this.executed = false;
        this.drawFinishedPath = false;
    }

    update() {
        this.updateNode();
        this.drawGrid();

        if (this.executed) {
            if(this.previewVisited) {
                this.drawVisitedNode();
            }            
            if (currentState === states[1]) {
                this.tracePath();
            };
        };
        this.drawPreviewNode();
        //draw starting node
        this.drawNode({
            x: this.start.x,
            y: this.start.y,
            color: 'green'
        });
        //draw ending node
        this.drawNode({
            x: this.end.x,
            y: this.end.y,
            color: '#bd4a33'
        });
    }
}