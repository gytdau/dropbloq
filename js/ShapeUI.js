function ShapeUI() {
    this.shapeIdCounter = 0;
    this.shapesPool = [
        [
            [["join-right join-bottom"], ["join-all"], ["join-left join-bottom"], false],
            [["join-all"], ["join-all"],["join-all"], false],
            [["join-top join-right"], ["join-all"], ["join-top join-left"], false],
            [false, false, false, false]
        ],
        [
            [["join-right join-bottom"], ["join-left join-bottom"], false, false],
            [["join-right join-top"], ["join-left join-top"],false, false],
            [false, false, false, false],
            [false, false, false, false]
        ],
        [
            [["jo"], false, false, false],
            [false, false,false, false],
            [false, false, false, false],
            [false, false, false, false]
        ],
        [
            [["join-right"], ["join-all"], ["join-all"],["join-left"]],
            [false, false,false, false],
            [false, false, false, false],
            [false, false, false, false]
        ],
        [
            [["join-bottom"], false, false, false],
            [["join-all"], false,false, false],
            [["join-all"], false, false, false],
            [["join-top"], false, false, false]
        ]
        ,
        [
            [["join-right join-bottom"], ["join-left"], false, false],
            [["join-top"], false,false, false],
            [false, false, false, false],
            [false, false, false, false]
        ]
        ,
        [
            [["join-right"], ["join-left  join-bottom"], false, false],
            [false, ["join-top"],false, false],
            [false, false, false, false],
            [false, false, false, false]
        ]
        ,
        [
            [false, ["join-bottom"], false, false],
            [["join-right"], ["join-left join-top"],false, false],
            [false, false, false, false],
            [false, false, false, false]
        ]
        ,
        [
            [["join-bottom"], false, false, false],
            [["join-top join-right"], ["join-left"], false, false],
            [false, false, false, false],
            [false, false, false, false]
        ]
    ];
    this.coloursPool = [
        "#F44336", "#E91E63", "#9C27B0", "#2196F3", "#009688", "#8BC34A", "#FFEB3B", "#FF9800"
    ];
    this.shapeSelected = null;
    this.shapeQueue = [];
    this.shapeSize = 4; // in blocks
    this.cellSize = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.initialize = function() {
        this.cellSize = $(".board-container").width() / 10;
        this.addShapeToQueue();
        this.addShapeToQueue();
        this.addShapeToQueue();
    };

    this.enableDragging = function(shape) {
        shape.draggable({
            handle: ".active-true",
            start: function(event) {
                $(".board-tile").hover(function() {
                    shapeUI.offsetX = $(this).data("pos-x");
                    shapeUI.offsetY = $(this).data("pos-y");

                    $(".board-tile").unbind();
                });
                shape.addClass("shape-dragging");
                var index = shape.data("shapequeueindex");
                shapeUI.startDrag(index);
            },
            stop: function(event, ui) {
                var posX, posY;
                $(".board-tile").hover(function() {
                    posX = $(this).data("pos-x");
                    posY = $(this).data("pos-y");
                    $(".board-tile").unbind();
                    console.log(shapeUI.offsetX + " " + shapeUI.offsetY);
                    if(board.addShape(shapeUI.shapeSelected, posX - shapeUI.offsetX, posY - shapeUI.offsetY) == false) {

                    } else {
                        shapeUI.removeShape(parseInt(shape.data("shapequeueindex")));
                        shapeUI.addShapeToQueue();
                    }
                    shapeUI.stopDrag(shape.data("shapequeueindex"));
                });
                shape.removeClass("shape-dragging");

            }
        });
    };

    this.addShapeToQueue = function() {
        this.shapeIdCounter++;
        var shapeIndex = Math.floor(Math.random() * this.shapesPool.length);
        var colourIndex = Math.floor(Math.random() * this.coloursPool.length);
        var shape = new Shape();
        shape.colour = this.coloursPool[colourIndex];
        this.copyArray(this.shapesPool[shapeIndex], shape.shapeData);
        this.shapeQueue.push(shape);
        this.appendShapeUI(shape);
    };

    this.copyArray = function(original, destination) {
        for(i = 0;i<this.shapeSize;i++) {
            for(j=0;j<this.shapeSize;j++) {
                destination[i][j] = original[i][j];
            }
        }
    };

    this.removeShape = function(index) {
        this.shapeQueue.splice(index, 1);
        this.removeShapeUI(index);
    };

    this.appendShapeUI = function(shape){
        var shapeHTML = "<div class='shape' data-shapequeueindex='"+this.shapeQueue.indexOf(shape)+"' style='width: "+(this.cellSize * this.shapeSize)+"px; height: "+(this.cellSize * this.shapeSize)+"' >";
        for(i = 0;i<this.shapeSize;i++) {
            for(j = 0;j<this.shapeSize;j++) {
                shapeHTML += "<div data-pos-x='"+j+"' data-pos-y='"+i+"' class='board-tile board-tile-hidden active-"+(shape.shapeData[i][j] != false);
                shapeHTML += "' style='width: "+this.cellSize+"px; height: "+this.cellSize+"px '><div class='board-tile-block";
                if (shape.shapeData[i][j] != false) {
                    for(k=0;k<shape.shapeData[i][j].length;k++) {
                        shapeHTML += " " + shape.shapeData[i][j][k];
                    }
                }
                shapeHTML += "' style='background-color: "+(shape.shapeData[i][j] != false?shape.colour:undefined)+"'></div></div>";
            }
        }
        shapeHTML += "</div>";

        $(".shapes").append(shapeHTML);
        this.enableDragging($("*[data-shapequeueindex="+this.shapeQueue.indexOf(shape)+"]"));
    };

    this.removeShapeUI = function(index) {
        $("*[data-shapequeueindex="+index+"]").remove();
        this.updateIndexes(parseInt(index));
    };

    this.startDrag = function(index) {
        this.shapeSelected = this.shapeQueue[index];
    };

    this.stopDrag = function(index) {
        this.shapeSelected = null;
    };

    this.updateIndexes = function(focal) {
        $(".shape").each(function() {
            var index = parseInt($(this).data("shapequeueindex"));
            if(index > focal) {
                $(this).data("shapequeueindex", index - 1);
                $(this).attr("data-shapequeueindex", index - 1);
            }
        });
    }

}

shapeUI = new ShapeUI();