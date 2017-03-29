function startGame() {
    var buttonsContainer = document.getElementById('button-container');

    buttonsContainer.addEventListener("click", function(e) {
        var clickedButton = e.target;
        var clickedButtonClass = e.target.getAttribute("class");
        var buttons = Array.prototype.slice.apply(document.getElementsByTagName('button'));
        var isButton = clickedButtonClass == 'easy-button' || clickedButtonClass == 'normal-button' ||
            clickedButtonClass == 'hard-button';

        buttons.forEach(b => b.style.backgroundColor = "#841F27");

        if (isButton) {
            clickedButton.style.backgroundColor = "#CC0000";
        }

        switch (clickedButtonClass) {
            case 'easy-button':
                dy = -2;
                dx = (Math.random() < 0.5) ? -2 : 2;
                break;
            case 'normal-button':
                dy = -3.5;
                dx = (Math.random() < 0.5) ? -3.5 : 3.5;
                break;
            case 'hard-button':
                dy = -5;
                dx = (Math.random() < 0.5) ? -5 : 5;
                break;
            case 'start-button':
                if (dx !== undefined && dy !== undefined) {
                    buttonsContainer.style.display = "none";
                    actualSpeed = Math.sqrt((dx * dx) + (dy * dy));

                    // Execution of the code
                    setInterval(draw, 10);
                    break;
                }
        }
    });
}

resizeCanvas();
startGame();