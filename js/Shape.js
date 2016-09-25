function Shape() {
    this.shapeData = [
        [false,false,false,false],
        [false,false,false,false],
        [false,false,false,false],
        [false,false,false,false]
    ];
    this.colour = null;

    this.getLogicalShape = function () {
        var logicshape = new CoordinateShape();
        for (var row = 0; row < this.shapeData.length; row++) {
            for (var column = 0; column < this.shapeData[row].length; column++){
                if (this.shapeData[row][column] != false) {
                    var block = new Block();
                    block.y = row;
                    block.x = column;
                    logicshape.shapeBlocks[row][column] = block;
                }
            }
        }
    }

}

function CoordinateShape() {
    this.shapeBlocks = [
        [null,null,null,null],
        [null,null,null,null],
        [null,null,null,null],
        [null,null,null,null]
    ];
}