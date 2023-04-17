function displayText(value) {
    const introTexts = document.querySelectorAll('.intro-text');
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

export { displayText };