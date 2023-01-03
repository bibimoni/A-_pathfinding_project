class Node {
    constructor({x = 0, y = 0, isObstacle = false}) {
        this.x = x;
        this.y = y;
        this.isObstacle = isObstacle;
        this.isStart = false;
        this.isEnd = false;
    }
    
    displayNode() {
        if(this.isStart || this.isEnd) {return;}
        if(this.isObstacle) {
            board.drawNode({
                x: this.x,
                y: this.y,
                color: '#a1a6a2'
            })
        }
        else {
            board.drawNode({
                x: this.x,
                y: this.y,
                color: 'black'
            })
        }
    }
}