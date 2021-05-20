document.addEventListener('DOMContentLoaded', setUpPage);

let imageText=[];
let gameBoard = document.getElementById("gameBoard")
let cards = []
const counter = document.getElementById('clicks');
const counterLabel = document.getElementById('label');
let hasFlippedCard = false;
let preventFliping = false; //prevents a player from clicking faster than the game can evaluate the results
let firstCard;
let secondCard;
let clickCount = 0;
let pairsFound = 0;

function setUpPage (){
    let countries = ['United States', 'Canada', 'Mexico', 'Iraq', 'Australia', 'New Zealand', 'Spain', 'Egypt'];

    for (let i = 0; i < countries.length; i++){
        var url = "https://portfive.net/flag/image?keyword=" + countries[i];
        myFetch(url, i);
        // console.log(imageText)
        // buildBoard(i)

    }
    // buildBoard();
}

async function myFetch(url) {
    let response = await fetch(url);

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        let json = await response.json();
        // console.log(json.image)
        let image = json.image
        let alt = json.alt
        // console.log(json)
        // console.log(image)
        buildBoard(image, alt)
        
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

function buildBoard(image, alt){
    // for (let i = 0; i < 3; i++){
        cardDiv1 = gameBoard.appendChild(document.createElement("div"));
        cardDiv1.classList.add("card")
        cardDiv1.dataset.type = alt

        image1 = cardDiv1.appendChild(document.createElement("img"));
        image1.classList.add("image");
        image1.classList.add("hide");
        image1.src = "data:image/png;base64," + image;
        image1.alt = "{{imageAlt}}";
        // image1.dataset.type = alt

        cardDiv2 = gameBoard.appendChild(document.createElement("div"));
        cardDiv2.classList.add("card")
        cardDiv2.dataset.type = alt

        image2 = cardDiv2.appendChild(document.createElement("img"));
        image2.classList.add("image");
        image2.classList.add("hide");
        image2.src = "data:image/png;base64," + image;
        image2.alt = "{{imageAlt}}";
        // image2.dataset.type = alt

        cards.push(cardDiv1)
        cards.push(cardDiv2)
        cardDiv1.addEventListener('click', showCard)
        cardDiv2.addEventListener('click', showCard)


    // }
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
//   if(pairsFound == pairsToFind){
// 	  gameWon();
//   }
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

// cards.forEach(card => card.addEventListener('click', showCard));




