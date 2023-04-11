//Quand on click sur un svg rectangle la couleur passe de rouge à bleu

const svg = document.querySelector('svg');
const rect = document.querySelector('rect');

rect.addEventListener('click', function() {
    rect.style.fill = rect.style.fill === 'red' ? 'blue' : 'red';
 });
//Quand je passe la souris sur donut le rayon augmente de 50px

const donut = document.getElementById('donut');

donut.addEventListener('mouseover', () => {
    // Agrandit la taille des deux cercles pour agrandir le donut
    donut.querySelectorAll('circle').forEach(circle => {
      circle.setAttribute('style', 'transform: scale(1.5)');
    });
  });

  // Ajoute un écouteur d'événements sur la souris pour détecter quand elle est retirée
  donut.addEventListener('mouseout', () => {
    // Rétablit la taille d'origine des deux cercles pour revenir à la taille normale du donut
    donut.querySelectorAll('circle').forEach(circle => {
      circle.setAttribute('style', 'transform: scale(1)');
    });
  });
