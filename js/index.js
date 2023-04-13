/*const introText = document.querySelectorAll('.intro-text');

let currentTextIndex = 1;
const interval = setInterval(() => {
    introText[currentTextIndex - 1].classList.add('hidden');
    currentTextIndex++;
    if (currentTextIndex > introText.length) {
        clearInterval(interval);
    }
    introText[currentTextIndex - 1].classList.remove('hidden');
}, 1000);

const slider = document.getElementById("mySlider");
const sliderSections = document.querySelectorAll(".slider-section");
const sliderProgress = document.querySelector(".slider-progress");
/*const progress = () => {
    slider.value = slider.value + 1;
};
slider.addEventListener("input", function() {
            const value = slider.value;
            const progressWidth = ((value - 1) / 364) * 100 + "%";
            sliderProgress.style.width = progressWidth;

            const sectionIndex = value - 1;
            /*sliderSections.forEach((section, index) => {
        if (index === sectionIndex) {
            section.classList.add("active");
        } else {
            section.classList.remove("active");
        }
    });
});*/


document.addEventListener('DOMContentLoaded', function() {
    const rangeInput = document.getElementById('rangeInput');

    rangeInput.addEventListener('input', function() {
        const inputValue = this.value;
        console.log('Valeur du range input:', inputValue);
        // Effectuez des actions en fonction de la valeur récupérée
    });
});

document.addEventListener('DOMContentLoaded', function() {


});

document.addEventListener('DOMContentLoaded', function() {
    const rangeInput = document.getElementById('rangeInput');
    const introTexts = document.querySelectorAll('.intro-text');

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

    rangeInput.addEventListener('input', function() {
        const inputValue = parseInt(this.value);
        showAppropriateSection(inputValue);
        //Change le texte du label ayant l'id dateLabel en fonction de la valeur du rangeInput pour afficher une date
        document.getElementById('dateLabel').innerHTML = getDateFromDayNumber(inputValue);
    });

    // Affichez la section appropriée au chargement de la page
    showAppropriateSection(parseInt(rangeInput.value));

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