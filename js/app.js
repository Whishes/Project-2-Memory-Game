// Help Modal Stuff
const helpButton = document.querySelector('.help');
helpButton.addEventListener('click', openHelpModal);

function openHelpModal() {
  helpModal.classList.add('show');
}

function closeHelpModal() {
  helpModal.classList.remove('show');
}

// Setting General Board/Deck variables
let card = document.getElementsByClassName('card');
let cards = [...card];
console.log(cards);
let deck = document.getElementsByClassName('deck')[0];
const restartButton = document.querySelector('.restart');
let matchingCard = document.getElementsByClassName('matching');

// Setting Game State variables
let moves = 0;
let counter = document.querySelector('.moves');
let stars = document.querySelectorAll('.fa-star');
let starsList = document.querySelectorAll('.stars li');
let openedCards = [];
let second = 0, 
    minute = 0;
let timer = document.querySelector('.timer');
let interval;

// Setting Modal variables
let closeIcon = document.querySelector('.exitBtn');
// let gameModal = document.getElementById('endModal');  - Keeping just incase but commented out cause stops the endModal from actually showing...
const modalPlayAgainButton = document.querySelector('.replayBtn');

// Help Modal Stuff

// 'Click' evnt listeners for buttons
restartButton.addEventListener('click', startGame);
modalPlayAgainButton.addEventListener('click', reset);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
  }

function startGame() {
  // Closes the end game Modal  -   Has started bugging out the whole game for some reason
  // endModal.classList.remove('show');

  // Calls the shuffle function
  cards = shuffle(cards);

  // Loops through each card and adds them to the cards array then removes all classes for them to remain closed
  for (let i = 0; i < cards.length; i++) {
    cards.forEach(i => deck.appendChild(i));
    cards[i].classList.remove('show', 'open', 'matching', 'disabled');
  }

  // Flashes Cards and Closes them again - Seems to work here for some reason
  flashCards();

  openedCards = [];

  // Sets move variable to 0 then updates the counter information to match 
  moves = 0;
  counter.innerHTML = moves;

  // Resets star rating
  for (let i = 0; i < stars.length; i++) {
    // Makes sure all stars are visible (reset) when other functions hide each one
    stars[i].style.display = "visible";
  }

  // Resets timer
  second = 0;
  minute = 0;
  let timer = document.querySelector('.timer');
  timer.innerHTML = '0 mins 0 secs';
  // Stops repeated looping of the function?
  clearInterval(interval);
}

// Flash Cards Function
function flashCards() {
  for (i = 0; i < cards.length; i++) {
    cards.forEach(i => deck.appendChild(i))
    cards[i].classList.add('show', 'open', 'disabled')
  }
  setTimeout(function() {
    for (i = 0; i < cards.length; i++) {
      cards.forEach(i => deck.appendChild(i))
      cards[i].classList.remove('show', 'open', 'disabled')
    }
  }, 4000);
}  

// When function is called on click, assigns each state to the clicked card
let displayCard = function() {
  this.classList.toggle('open');
  this.classList.toggle('show');
  this.classList.toggle('disabled');
};

// Adds each card to the openedCards array, starts the counter, and checks if cards have been matched
function cardOpen() {
  openedCards.push(this);
  let len = openedCards.length;
  // Starts the counter if a move has been made
  if (len == 1 && moves == 0) {
    second = 0;
    minute = 0;
    startTimer();
  } else if (len === 2) {
    moveCounter();
    // If the first opened card matches the second card then starts matching() function. If not, then starts the notMatching() function - (Note: [1] is the second card, not the first)
    if (openedCards[0].type === openedCards[1].type) {
      matching();
    } else {
      notMatching();
    }
  }
}

// When 2 cards match, the "show" and "open" states are replaced when "matching" and "disabled" so it can be checked for when all matches have been made
function matching() {
  openedCards[0].classList.add('matching', 'disabled');
  openedCards[1].classList.add('matching', 'disabled');
  openedCards[0].classList.remove('show', 'open');
  openedCards[1].classList.remove('show', 'open');
  openedCards = [];
}

// When 2 cards don't match, adds the "not-matching" state, and sets a timeout as a 'punishment' for guessing wrong 
function notMatching() {
  openedCards[0].classList.add('not-matching');
  openedCards[1].classList.add('not-matching');
  disable();
  setTimeout(function() {
    openedCards[0].classList.remove('show', 'open', 'not-matching');
    openedCards[1].classList.remove('show', 'open', 'not-matching');
    // Re-enables cards after timeout has finished - Timeout length makes animation cleaner
    enable();
    openedCards = [];
  }, 1500);
}

// Disables all cards temporarily (while two cards are flipped)
function disable() {
  Array.prototype.filter.call(cards, function(card) {
     card.classList.add('disabled'); 
  })
}

// Enables flipping of cards, disables matching cards
function enable() {
  Array.prototype.filter.call(cards, function(card) {
    card.classList.remove('disabled');
    for (let i = 0; i < matchingCard.length; i++) {
      matchingCard[i].classList.add('disabled');
    }
  });
}

// Counter function
function moveCounter() {
  // Adds 1 to the moves variable and updates the counter  
  moves++;
  counter.innerHTML = moves;

  // Sets star rating based on number of moves - Could use set visilbility as "none" instead of "collapse" to look nicer?
  if (moves > 8 && moves < 15) {
    for (i = 0; i < 3; i++) {
      if (i > 1) {
        stars[i].style.display = 'none';
      }
    }
  }
  else if (moves > 16) {
    for (i = 0; i < 3; i++) {
      if (i > 0) {
        stars[i].style.display = 'none';
      }
    }
  }
}

// Timer Function - Could add another if function for an hour if game time was expected to go that long?
function startTimer() {
  interval = setInterval(function() {
    timer.innerHTML = minute + ' mins ' + second + ' secs';
    second++;
    if (second == 60) {
      minute++;
      second = 0;
    }
  }, 1000);
}

// Modal function that should open when game ends
function modalOpen() {
  if (matchingCard.length == 16) {
    clearInterval(interval);

    // Sets the finalTime variable to equal the time taken throughout the game
    let fTime = timer.innerHTML;

    // Part that shows the actual modal
    endModal.classList.add('show');

    // Sets the final amount of stars in the starRating variable
    let starRating = document.querySelector('.stars').innerHTML;

    // Shows number of moves made, time, and rating on modal
    document.getElementsByClassName('fMoves')[0].innerHTML = moves;
    document.getElementsByClassName('starRating')[0].innerHTML = starRating;
    document.getElementsByClassName('tTime')[0].innerHTML = fTime;

    // Adds event listener for modal's close button
    closeModal();
  }
}

// Closes modal upon clicking its close icon - Close modal also set in the startGame function
function closeModal() {
  closeIcon.addEventListener('click', function(e) {
    endModal.classList.remove('show'); // 
    startGame();
  });
}

// Called when user hits "play again" button - Close modal also set in the startGame function - Could be all merged into the closeModal function but found was less confusing to make it different and go from there
function reset() {
  endModal.classList.remove('show');
  startGame();
}

// Adds event listeners to all cards in the deck
for (let i = 0; i < cards.length; i++) {
  card = cards[i];
  card.addEventListener('click', displayCard);
  card.addEventListener('click', cardOpen);
  card.addEventListener('click', modalOpen);
}

// Starts the startGame function on page load (when html body information is read)
window.onload = function() {
  setTimeout(function() {
    startGame()
  }, 400);
}