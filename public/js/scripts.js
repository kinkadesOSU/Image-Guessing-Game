//array of cards onto which a click listener can be added
const cards = document.querySelectorAll('.card');
const counter = document.getElementById('clicks');
const counterLabel = document.getElementById('label');

//inital variables for the game
let hasFlippedCard = false;
let preventFliping = false; //prevents a player from clicking faster than the game can evaluate the results
let firstCard;
let secondCard;
let clickCount = 0;
let pairsFound = 0;
let pairsToFind = cards.length / 2

function showCard() {
	if (preventFliping){
		return;
	} 
	if (this === firstCard){
		return;
	} 

  	let showCard = this.firstElementChild; //the div is clicked, so we need to change the properties of the image under the div
  	showCard.classList.toggle('hide')

	//if a card hasn't been flipped, make it the first card
	if (hasFlippedCard == false) {
		hasFlippedCard = true;
		firstCard = this;
		return;
	}else{
		secondCard = this;
	}

	checkPair();
	clickCount += 1;	 
	counter.innerText = clickCount;
}

function checkPair() {
  if(firstCard.dataset.type === secondCard.dataset.type){
	pairsFound += 1;
	resetBoard();
	return;
  }

  // hide the cards if they don't match
  hideCards();
}


function hideCards() {
  lockBoard = true;

  //gives the player time to see what they chose
  setTimeout(() => {
    firstCard = firstCard.firstElementChild
    secondCard = secondCard.firstElementChild

    firstCard.classList.toggle('hide');
    secondCard.classList.toggle('hide');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  hasFlippedCard = false;
  firstCard = null;
  secondCard = null;
  if(pairsFound == pairsToFind){
	  gameWon();
  }
}

function gameWon(){
	document.body.classList.add('win');
}

//shuffle cards so they don't just appear next to each other like the HTML has them laid out.
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', showCard));

// btn = document.getElementById('newGame')


