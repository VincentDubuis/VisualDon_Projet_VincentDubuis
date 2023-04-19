import * as d3 from 'd3';
import { getDataCSV } from './js/data.js';


document.addEventListener('DOMContentLoaded', function() {
    const rangeInput = document.getElementById('rangeInput');
    const introTexts = document.querySelectorAll('.intro-text');
    //const gallery = document.querySelector('.gallery');

    rangeInput.addEventListener('input', function() {
        const inputValue = this.value;
        console.log('Valeur du range input:', inputValue);
        // Effectuez des actions en fonction de la valeur récupérée
    });
    async function processData() {
        const data = await getDataCSV();
        console.log(data); // Now we have access to the data
        // Do any necessary processing on the data
    }

    processData();


    /* Loop through your data and push the dates and values into the arrays
    for (let i = 0; i < data.length; i++) {
        dates.push(data[i].date);
        values.push(data[i].value);
    }
    console.log(dates);
*/
    function showAppropriateSection(value) {
        // Définissez les plages pour les sections ici
        const ranges = [
            { min: 1, max: 20 },
            { min: 21, max: 42 },
            { min: 43, max: 54 },
            { min: 55, max: 66 },
            { min: 67, max: 99 },
            { min: 100, max: 149 },
            { min: 150, max: 199 },
            { min: 200, max: 249 },
            { min: 250, max: 309 },
            { min: 310, max: 365 },
            // Ajoutez d'autres plages ici
        ];
        introTexts.forEach((text, index) => {
            if (value >= ranges[index].min && value <= ranges[index].max) {
                text.classList.add('active');
            } else {
                text.classList.remove('active');
            }
        });
    }

    /*function showAppropriateGallery(value) {
        const galleryRanges = [
            { min: 1, max: 20 },
            { min: 21, max: 42 },
            { min: 43, max: 54 },
            { min: 55, max: 66 },
            { min: 67, max: 99 },
            { min: 100, max: 149 },
            { min: 150, max: 199 },
            { min: 200, max: 249 },
            { min: 250, max: 309 },
            { min: 310, max: 365 },
            // Ajoutez d'autres plages ici
        ];
        gallery.forEach((text, index) => {
            if (value >= galleryRanges[index].min && value <= galleryRanges[index].max) {
                text.classList.add('active');
            } else {
                text.classList.remove('active');
            }
        });
    }*/


    rangeInput.addEventListener('input', function() {
        const inputValue = parseInt(this.value);
        showAppropriateSection(inputValue);
        //showAppropriateGallery(inputValue);
        //Change le texte du label ayant l'id dateLabel en fonction de la valeur du rangeInput pour afficher une date
        document.getElementById('dateLabel').innerHTML = getDateFromDayNumber(inputValue);
    });

    // Affichez la section appropriée au chargement de la page
    showAppropriateSection(parseInt(rangeInput.value));
    //showAppropriateGallery(parseInt(rangeInput.value));

    let isPlaying = false;
    let interval;
    const playButton = document.querySelector("#playButton");

    function togglePlay() {

        if (isPlaying) {
            console.log("Paused");
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
            console.log("Playing");
            playButton.value = "Pause";
        }
        isPlaying = !isPlaying;
    }
    playButton.addEventListener("click", togglePlay);
});

function getDateFromDayNumber(dayNumber) {
    const startDate = new Date(2022, 1, 24); // 24 février 2022
    startDate.setDate(startDate.getDate() + dayNumber - 1);
    const day = startDate.getDate().toString().padStart(2, '0');
    const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const year = startDate.getFullYear();
    const newDate = `${day}/${month}/${year}`
    return newDate;
}