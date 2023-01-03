class Board {

    constructor(
        width, 
        startingPos = {x : 0, y : 0}, 
        endingPos = {x: 1, y : 0},
        obstacleRatio = 0.3
    ) {
        this.start = {x: startingPos.x, y: startingPos.y};
        this.end = {x: endingPos.x, y: endingPos.y};
        this.grid_width = canvas.width;
        this.grid_height = canvas.height;
        this.ratio = this.grid_height / this.grid_width;
        this.board_width = width;
        this.board_height = Math.round(this.board_width * this.ratio);
        //for preview mode in changing starting positions
        this.mouseCurrentPosition = {x: 0, y: 0};
        this.previewMousePosition = false;
        this.nodes = [];
        for(let i = 0; i < this.board_width; i++) {
            this.nodes[i] = [];
            for(let j = 0; j < this.board_height; j++) {
                this.nodes[i][j] = new Node({x: i, y: j});
                if(i == this.start.x && j == this.start.y) this.nodes[i][j].isStart = true;
                else if(i == this.end.x && j == this.end.y) this.nodes[i][j].isEnd = true;
            }
        }
        //console.table(this.nodes);
        this.gridLineWidth = .5;
        this.obstacleRatio = obstacleRatio;
    }
    
    updateNode() {
        for(let i = 0; i < this.nodes.length; i++) {
            for(let j = 0; j < this.nodes[i].length; j++) {
                this.nodes[i][j].displayNode();
                //this.nodes[i][j].isObstacle = true;
            }
        }  
        this.nodes[this.start.x][this.start.y].isStart = true;
        this.nodes[this.start.x][this.start.y].isObstacle = this.nodes[this.start.x][this.start.y].isEnd = false;
        this.nodes[this.end.x][this.end.y].isEnd = true;
        this.nodes[this.end.x][this.end.y].isObstacle = this.nodes[this.end.x][this.end.y].start = false;       
    }
    
    drawPreviewNode() {
        if(!this.previewMousePosition) {
            return
        }
        this.drawOutline({
            x: this.mouseCurrentPosition.x, 
            y: this.mouseCurrentPosition.y, 
            color: '#645beb'
        });
    }
    
    drawGrid() {
        ctx.lineWidth = this.gridLineWidth;
        ctx.strokeStyle = 'white';
        for(let i = 0; i < this.board_width; i++) {
            ctx.beginPath();
            ctx.moveTo(i * this.grid_width / this.board_width, 0);
            ctx.lineTo(i * this.grid_width / this.board_width, this.grid_height);
            ctx.stroke();
            ctx.closePath();
        }
        for(let i = 0; i < this.board_height; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * this.grid_height / this.board_height);
            ctx.lineTo(this.grid_width, i * this.grid_height / this.board_height);
            ctx.stroke();
            ctx.closePath();
        }
    }
    
    randomizeObstacles() {
        for(let i = 0; i < this.board_width; i++) {
            for(let j = 0; j < this.board_height; j++) {
                if(this.nodes[i][j].isStart || this.nodes[i][j].isEnd) continue;
                const randomBoolean = Math.random() < this.obstacleRatio;
                this.nodes[i][j].isObstacle = randomBoolean; //randomize the obstacle
            }
        }
        //console.table(this.nodes);
    }    
    //translate mouse position to grid position
    getMouseBoardPosition(mouseCurrentPosition = {x, y}) {
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
    drawNode({x, y, color}) {
        const nodeWidth = this.grid_width / this.board_width - this.gridLineWidth;
        const nodeHeight = this.grid_height / this.board_height - this.gridLineWidth;
        const startX = x * this.grid_width / this.board_width + this.gridLineWidth;
        const startY = y * this.grid_height / this.board_height + this.gridLineWidth;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(startX, startY, nodeWidth, nodeHeight);
        ctx.closePath();
    }
    
    //draw an outline with the given coords
    drawOutline({x, y, color}) {
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
    
    update() {
        this.updateNode();
        this.drawGrid();
        //draw starting node
        this.drawNode({
            x: this.start.x, 
            y: this.start.y, 
            color: 'green'
        });
        this.drawNode({
            x: this.end.x, 
            y: this.end.y, 
            color: '#bd4a33'
        });
        this.drawPreviewNode();
    }
}