function MiscUI() {
    this.updateScore = function() {
        $("#current-score").text(manager.score);
    };
    this.updateHighScore = function() {
        $("#high-score").text(manager.score);
    };
}

miscUI = new MiscUI();