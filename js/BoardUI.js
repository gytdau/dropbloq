function BoardUI() {
    this.initialize = function (rows, columns) {
        var pixelHeight = $(".board-container").width();

        var tiles = "";
        for (y = 0; y < rows; y++) {
            for (x = 0; x < columns; x++) {
                tiles += "<div class='board-tile board-tile-in-board x-" + x + " y-" + y + "' data-pos-x='" + x + "' data-pos-y='" + y + "'></div>";
            }
        }

        $(".board-container").append(tiles);
        $(".board-tile").css("height", (pixelHeight / 10)).css("width", (pixelHeight / 10))
    };
    this.renderJoin = function (x, y) {
        var block = board.getBlock(x, y);
        var candidates = [
            [x, y],
            [x - 1, y],
            [x, y - 1],
            [x + 1, y],
            [x, y + 1]
        ];

        var self = this;

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

            // Does this tile contain a block?
            var candidateBlock = board.getBlock(x, y);
            if(candidateBlock == null) {
                return
            }

            // Does that block match with the colour?
            if(candidateBlock.colour != block.colour) {
                return
            }

            // All checks passed, re-rendering is needed.
            self.renderJoinBlock(x, y)

        });

    };

    this.renderJoinBlock = function(x, y) {
        var UIblock = $(".x-" + x + ".y-" + y).find(".board-tile-block");
        var block = board.getBlock(x, y);
        var candidates = [
            [x - 1, y, "left"],
            [x, y + 1, "bottom"],
            [x + 1, y, "right"],
            [x, y - 1, "top"]
        ];

        var self = this;

        $.each(candidates, function(i, candidate) {
            var x = candidate[0];
            var y = candidate[1];
            var direction = candidate[2];

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

            // Does this tile contain a block?
            var candidateBlock = board.getBlock(x, y);
            if(candidateBlock == null) {
                return
            }

            // Does that block match with the colour?
            if(candidateBlock.colour != block.colour) {
                return
            }

            // All checks passed, this block must appear to be joined with the candidateBlock.
            UIblock.addClass("join-" + direction)
        });

    };

    this.addBlock = function (x, y) {
        var UIblock = $(".x-" + x + ".y-" + y);
        var block = board.getBlock(x, y);

        UIblock.html("<div class='board-tile-block block-fade-in' style='background-color: " + block.colour + ";'></div>");

        this.renderJoin(x, y);

    };
    this.collapse = function (shouldBeVertical, pos) {
        var letter = "x";
        if(shouldBeVertical) {
            letter = "y";
        }

        $("." + letter + "-" + pos).each(function(x) {
            var object = $(this);
            setTimeout(function() {
                object.find(".board-tile-block").removeClass("block-fade-in").addClass("block-fade-out");
                console.log("Setting for: " + x);
            }, 50 * x);
        });
    };
    this.lose = function () {
        grays = [
            "#d9d7d6",
            "#9e9a98",
            "#b5b1af",
            "#c7c0bc"
        ];
        $(".board-tile-block").each(function() {
            gray = grays[Math.floor(Math.random()*grays.length)]; // Get a random gray

            $(this).animate({backgroundColor: gray});
        });
    }
}

var boardUI = new BoardUI();