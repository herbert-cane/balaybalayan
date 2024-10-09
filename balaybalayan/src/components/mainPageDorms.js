// public/script.js
const cardContainer = document.querySelector('.card-container');
const cards = document.querySelectorAll('.card');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');

let currentIndex = 0;

nextButton.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    updateCardPosition();
  }
});

prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCardPosition();
  }
});

function updateCardPosition() {
  const width = cards[0].offsetWidth;
  cardContainer.style.transform = `translateX(-${currentIndex * width}px)`;
}