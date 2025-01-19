const deck = document.querySelector('.mc-deck');
const congrats = document.querySelector('.mc-congrats');
const resetBtn = document.querySelector('.mc-reset-btn');
const matchedCounter = document.querySelector('.mc-matched');
const failedCounter = document.querySelector('.mc-failed');
const timer = document.querySelector('.mc-time');

let cards = [];
let openedCards = [];
let matchedCount = 0;
let failedCount = 0;
let time = 0;
let interval;

const faces = ['bug', 'upload', 'configuration', 'connection', 'database', 'www', 'mobile', 'keyboard'];
const facePath = {
  bug: './images/memory_card/bug.svg',
  upload: './images/memory_card/upload.svg',
  configuration: './images/memory_card/configuration.svg',
  connection: './images/memory_card/connection.svg',
  database: './images/memory_card/database.svg',
  www: './images/memory_card/www.svg',
  mobile: './images/memory_card/mobile.svg',
  keyboard: './images/memory_card/keyboard.svg'
};

// デッキを作成
function createDeck() {
  function createCard() {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('mc-card');

    const frontDiv = document.createElement('div');
    frontDiv.classList.add('mc-front');
    const frontImg = document.createElement('img');
    frontDiv.appendChild(frontImg);

    const backDiv = document.createElement('div');
    backDiv.classList.add('mc-back');
    const backImg = document.createElement('img');
    backImg.setAttribute('src', './images/memory_card/hand.svg');
    backDiv.appendChild(backImg);

    cardDiv.appendChild(frontDiv);
    cardDiv.appendChild(backDiv);

    return cardDiv;
  }

  function generateShuffledArray(arr) {
    const shuffledArray = arr.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }
    return shuffledArray;
  }

  const orderedFaces = [...faces, ...faces];
  const shuffledFaces = generateShuffledArray(orderedFaces);

  shuffledFaces.forEach(face => {
    const cardDiv = createCard();
    const frontImage = cardDiv.querySelector('.mc-front img');
    frontImage.setAttribute('src', facePath[face]);
    deck.appendChild(cardDiv);
    cardDiv.addEventListener('click', flip);
  });
}

// カードをめくる
function flip() {
  if (openedCards.length === 0) {
    this.classList.add('rotate');
    openedCards.push(this);
  } else if (openedCards.length === 1) {
    if (this === openedCards[0]) return;
    this.classList.add('rotate');
    openedCards.push(this);
    checkMatch(openedCards[0], openedCards[1]);
  }
}

// カードが一致しているか確認
function checkMatch(card1, card2) {
  const face1 = card1.querySelector('.mc-front img').getAttribute('src');
  const face2 = card2.querySelector('.mc-front img').getAttribute('src');

  if (face1 === face2) {
    matchedCount++;
    matchedCounter.textContent = matchedCount;
    card1.removeEventListener('click', flip);
    card2.removeEventListener('click', flip);
    openedCards = [];
    if (matchedCount === faces.length) {
      clearInterval(interval);
      congrats.style.display = 'block';
    }
  } else {
    failedCount++;
    failedCounter.textContent = failedCount;
    setTimeout(() => {
      card1.classList.remove('rotate');
      card2.classList.remove('rotate');
      openedCards = [];
    }, 1000);
  }
}

// リセット
resetBtn.addEventListener('click', start);

// ゲーム開始
function start() {
  matchedCount = 0;
  failedCount = 0;
  time = 0;
  openedCards = [];
  matchedCounter.textContent = matchedCount;
  failedCounter.textContent = failedCount;
  timer.textContent = '00:00';
  deck.innerHTML = '';
  congrats.style.display = 'none';
  createDeck();

  clearInterval(interval);
  interval = setInterval(() => {
    time++;
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

// ゲーム開始
start();
