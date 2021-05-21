document.addEventListener('DOMContentLoaded', setUpPage);

const cards = document.querySelectorAll('.card');

let imageText=[];
let gameBoard = document.getElementById("gameBoard")
const counter = document.getElementById('clicks');

const loadedMessage = document.querySelector('H4');
let hasFlippedCard = false;
let preventFliping = false; //prevents a player from clicking faster than the game can evaluate the results
let firstCard;
let secondCard;
let clickCount = 0;
let pairsFound = 0;
let firstIndex = 0
let secondIndex = 1;
let loadCount = 1;
let pairsToFind = cards.length / 2;

var totalSeconds = 0;


async function setUpPage (){
    let countries = ['United States', 'Canada', 'Mexico', 'Australia'];
	iMultiplier = 0;
    for (let i = 0; i < countries.length; i++){
		
        var url = "https://portfive.net/flag/image?keyword=" + countries[i];
        // myFetch(url);

		let response = await fetch(url);
		if (response.ok) {
			let json = await response.json();
	
			let image = json.image
			let alt = json.alt
	
			buildBoard(image, alt, firstIndex, secondIndex)
			firstIndex += 2;
			secondIndex += 2;
			
		} else {
			alert("HTTP-Error: " + response.status);
		}
    }
	setInterval(function(){
		++totalSeconds;
		var hour = Math.floor(totalSeconds /3600);
		var minute = Math.floor((totalSeconds - hour*3600)/60);
		var seconds = totalSeconds - (hour*3600 + minute*60);
		if(hour < 10)
		  hour = "0"+hour;
		if(minute < 10)
		  minute = "0"+minute;
		if(seconds < 10)
		  seconds = "0"+seconds;
		document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
	}, 1000)

	loadedMessage.innerText = "Images Loaded. Start Playing!"
	loadedMessage.classList.add('image-loaded')
}

function buildBoard(image, alt, firstIndex, secondIndex){
	card1 = cards[firstIndex]
	card1.dataset.type = alt

	image1 = card1.appendChild(document.createElement("img"));
	image1.classList.add("image");
	image1.classList.add("hide");
	image1.src = "data:image/png;base64," + image;
	image1.alt = "{{imageAlt}}";

	card2 = cards[secondIndex]
	card2.dataset.type = alt

	image2 = card2.appendChild(document.createElement("img"));
	image2.classList.add("image");
	image2.classList.add("hide");
	image2.src = "data:image/png;base64," + image;
	image2.alt = "{{imageAlt}}";

}

//inital variables for the game
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
	alert("CONGRATULATIONS! You've found all of the pairs")
}

//shuffle cards so they don't just appear next to each other like the HTML has them laid out.
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', showCard));




