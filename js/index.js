const introText = document.querySelectorAll('.intro-text');

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
const progress = () => {
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
    });*/
});