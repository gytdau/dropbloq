function Board() {
    this.boardData = [];

    this.initialize = function (rows, columns) {
        for (var row = 0; row < rows; row++) {
            var rowData = [];
            for (var column = 0; column < columns; column++) {
                rowData[column] = null;
            }
            this.boardData[row] = rowData;
        }

        boardUI.initialize(rows, columns);

    };

    this.shapeFits = function(shape, x, y) {
        for (var row = 0; row < shapeUI.shapeSize;row++) {
            for (var column = 0; column < shapeUI.shapeSize; column++) {
                if (shape.shapeData[row][column] == false) {
                    continue;
                }
                var block = new Block();
                block.x = (x + column);
                block.y = (y + row);

                if(this.getBlock(block.x, block.y) != null) {
                    return false;
                }

            }
        }
        return true;
    };

    this.addShape = function (shape, x, y) {
        if(!this.shapeFits(shape, x, y)) {
            return false;
        }
        for (var row = 0; row < shapeUI.shapeSize;row++) {
            for (var column = 0; column < shapeUI.shapeSize; column++) {
                if (shape.shapeData[row][column] == false) {
                    continue;
                }
                var block = new Block();
                block.x = (x + column);
                block.y = (y + row);

                block.colour = shape.colour;
                this.setBlock(block, block.x, block.y);
                boardUI.addBlock(block.x, block.y);
                this.checkForCollapse(block);

            }
        }
        manager.addScore(20);
    };

    this.checkForCollapse = function (block) {
        var YAxisBuildUp = 0;
        var XAxisBuildUp = 0;

        for (var column = 0; column < this.boardData[block.y].length; column++) {
            if (this.getBlock(column, block.y) != null) {
                YAxisBuildUp++;
            }
        }

        for (var row = 0; row < this.boardData.length ; row++) {
            if (this.getBlock(block.x, row) != null) {
                XAxisBuildUp++;
            }
        }

        if (XAxisBuildUp == manager.columns) {
            this.collapse(false, block.x);
        }
        if (YAxisBuildUp == manager.rows) {
            this.collapse(true, block.y);
        }
    };


    this.collapse = function (shouldBeVertical, pos) {
        if (shouldBeVertical) {
            for (var row = 0; row < this.boardData[pos].length; row++) {
                // Pos is y
                this.setBlock(null, row, pos);
            }

            boardUI.collapse(shouldBeVertical, pos);
        } else {
            for (var column = 0; column < this.boardData.length; column++) {
                // Pos is x
                this.setBlock(null, pos, column);
            }
            boardUI.collapse(shouldBeVertical, pos);
        }
        manager.addScore(100);
    };

    this.checkIfNoMovesLeft = function () {
        
    };

    this.getBlock = function (x, y) {
        return this.boardData[y][x];
    };
    this.setBlock = function (block, x, y) {
        this.boardData[y][x] = block;
    }
}

board = new Board();