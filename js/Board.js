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

                if(block.x < 0 || block.x >= manager.columns || block.y < 0 || block.y >= manager.rows) {

                    return false;
                }

                if(this.getBlock(block.x, block.y) != null) {
                    return false;
                }

            }
        }
        return true;
    };

    this.addShape = function (shape, x, y) {
        var blockQueue = [];
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
                if(shape.shapeData[row][column].indexOf("bomb") !== -1) {
                    // Is this a bomb in shapeData?
                    block.type = "bomb";

                }

                this.setBlock(block, block.x, block.y);
                if(!this.checkForCollapse(block)) {
                    blockQueue.push([block.x, block.y]);
                }
            }
        }
        if (this.checkIfNoMovesLeft()){
            alert("Game over");
        }
        $.each(blockQueue, function(i, block) {
            setTimeout(function() {
                boardUI.addBlock(block[0], block[1]);
            }, 100 * i);
        });

        manager.addScore(20);
        return true;
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

    this.causeExplosion = function(x, y) {
        console.log("board.js explosion caused at " + x + ", " + y);
        var candidates = [
            [x, y],
            [x - 1, y],
            [x, y - 1],
            [x - 1, y - 1],
            [x + 1, y],
            [x, y + 1],
            [x + 1, y + 1]
        ];

        var thisX = x;
        var thisY = y;
        $.each(candidates, function(i, candidate) {
            var x = candidate[0];
            var y = candidate[1];

            // Is this tile within the map's bounds?
            if(x < 0) {
                return
            }
            if(x >= manager.columns) {
                return
            }
            if(y < 0) {
                return
            }
            if(y >= manager.rows) {
                return
            }

            if(thisX !== x && thisY != y) {
                var possibleBoomBoom = board.getBlock(x, y);
                if(possibleBoomBoom !== null) {
                    if(possibleBoomBoom.type == "bomb") {
                        board.causeExplosion(x, y);
                    }
                }
            }
            board.setBlock(null, x, y);

        });
        boardUI.causeExplosion(x, y);
    };
    this.collapse = function (shouldBeVertical, pos) {
        if (!shouldBeVertical) {
            for (var row = 0; row < manager.rows; row++) {
                // Pos is x
                if(this.getBlock(pos, row) == null) continue;
                if(this.getBlock(pos, row).type == "bomb") {
                    this.causeExplosion(pos, row);
                }
                this.setBlock(null, pos, row);
            }

            boardUI.collapse(shouldBeVertical, pos);
        } else {
            for (var column = 0; column < manager.columns; column++) {
                // Pos is y
                if(this.getBlock(column, pos) == null) continue;
                if(this.getBlock(column, pos).type == "bomb") {
                    this.causeExplosion(column, pos);
                }
                this.setBlock(null, column, pos);
            }
            boardUI.collapse(shouldBeVertical, pos);
        }
        manager.addScore(100);
    };

    this.checkIfNoMovesLeft = function () {
        for (var shape = 0; shape < shapeUI.shapeQueue.length; shape++) {
            for (var row = 0; row < this.boardData.length; row++) {
                for (var column = 0; column < this.boardData[row].length; column++) {
                    if (this.shapeFits(shapeUI.shapeQueue[shape],column,row)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    this.getBlock = function (x, y) {
        return this.boardData[y][x];
    };
    this.setBlock = function (block, x, y) {
        this.boardData[y][x] = block;
    }
}

board = new Board();