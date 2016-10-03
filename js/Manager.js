function Manager() {
    this.rows = 10;
    this.columns = 10;
    this.score = 0;
    this.highScore = 0;
    this.initialize = function() {
        board.initialize(this.rows, this.columns);
        shapeUI.initialize();
        miscUI.initialize();

        this.score = 0;
        $("#current-score").text(0);
        if(Cookies.get('high-score') != undefined) {
            this.highScore = Cookies.get('high-score');
        }
        $("#high-score").text(this.highScore);
    };

    this.addScore = function(score) {
        this.score += score;
        if(this.score > this.highScore) {
            this.highScore = this.score;
            $("#high-score").text(this.score);
            $("#high-score").addClass("new-high-score");
            $("body").addClass("body-win");
            Cookies.set('high-score', this.highScore)
        }
        $("#current-score").removeClass("score-pop");
        setTimeout(function() {
            $("#current-score").addClass("score-pop");
        }, 10);
        $("#current-score").text(this.score);
    };

    this.lose = function() {
        boardUI.lose();
        miscUI.showLossPopup();
    }
}

manager = new Manager();

$(function() {
    manager.initialize();
});