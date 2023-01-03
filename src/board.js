class Board {

    constructor(
        width, 
        startingPos = {x : 0, y : 0}, 
        endingPos = {x: 0, y : 0}
    ) {
        this.start = {x: startingPos.x, y: startingPos.y};
        this.end = {x: endingPos.x, y: endingPos.y};
        this.grid_width = canvas.width;
        this.grid_height = canvas.height;
        this.ratio = this.grid_height / this.grid_width;
        this.board_width = width;
        this.board_height = Math.round(this.board_width * this.ratio);
    }
    
    drawGrid() {
        this.gridLineWidth = .5;
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
    
    update() {
        this.drawGrid();
        //draw starting node
        this.drawNode({
            x: this.start.x, 
            y: this.start.y, 
            color: 'green'
        });
    }
}