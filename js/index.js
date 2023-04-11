const introText = document.querySelectorAll('.intro-text');

let currentTextIndex = 1;
const interval = setInterval(() => {
    introText[currentTextIndex - 1].classList.add('hidden');
    currentTextIndex++;
    if (currentTextIndex > introText.length) {
        clearInterval(interval);
    }
    introText[currentTextIndex - 1].classList.remove('hidden');
}, 6000);