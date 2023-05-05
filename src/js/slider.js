import { showAppropriateText } from './textDisplay.js';

function rangeInputSet() {
    //On récupère le slider
    const rangeInput = document.getElementById('rangeInput');
    //On récupère le bouton play
    const playButton = document.querySelector("#playButton");
    //On définit que le slider est à l'arrêt
    let isPlaying = false;
    //On peut définir un intervalle de temps pour le slider
    let interval;
    //Quand on touche le slider, on définit la date, le texte et les images appropriés
    rangeInput.addEventListener('input', function() {
        const inputValue = this.value;
        displayText(inputValue);
        document.getElementById('dateLabel').innerHTML = getDateFromDayNumber(inputValue);
        displayText(parseInt(rangeInput.value));
    });

};

function togglePlay() {

    if (isPlaying) {
        clearInterval(interval);
        playButton.value = "Play";
    } else {
        interval = setInterval(function() {
            // Code à exécuter pendant la lecture
            rangeInput.value = parseInt(rangeInput.value) + 1;
            const event = new Event("input");
            rangeInput.dispatchEvent(event);
            if (rangeInput.value >= 365) {
                clearInterval(interval);
                playButton.value = "Play";
            }
        }, 500);
        playButton.value = "Pause";
    }
    isPlaying = !isPlaying;
}
playButton.addEventListener("click", togglePlay);

export { rangeInputSet, togglePlay, isPlaying, interval, playButton, rangeInput };