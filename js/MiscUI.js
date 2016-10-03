function MiscUI() {
    this.initialize = function() {
        $("#loss-popup").hide();
    };
    this.updateScore = function() {
        $("#current-score").text(manager.score);
    };
    this.updateHighScore = function() {
        $("#high-score").text(manager.score);
    };
    this.showLossPopup = function() {
        $("#loss-popup").slideDown();
    };
}

miscUI = new MiscUI();