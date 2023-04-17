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



export { rangeInputSet };