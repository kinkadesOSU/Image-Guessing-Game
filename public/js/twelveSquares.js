playbtn = document.getElementById('play')
resetbtn = document.getElementById('reset')

playbtn.addEventListener('click', setUpPage);
resetbtn.addEventListener('click', resetGame);

let images=[];
let descriptions = []
let cards = []

let loaded = 0
let clickCount = 0;
let pairsFound = 0;
let pairsToFind = 6;
let totalSeconds = 0;

const gameBoard = document.getElementById('gameBoard')
const counter = document.getElementById('clicks');
const counterLabel = document.getElementById('label');
const timerLabel = document.getElementById("timer");

const progress = document.getElementById("progress")
const loadedMessage = document.querySelector('H4');

let hasFlippedCard = false;
let preventFliping = false; //prevents a player from clicking faster than the game can evaluate the results
let firstCard;
let secondCard;

async function setUpPage (){
    let country1 = document.getElementById('country-1').value
    let country2 = document.getElementById('country-2').value
    let country3 = document.getElementById('country-3').value
    let country4 = document.getElementById('country-4').value
    let country5 = document.getElementById('country-5').value
    let country6 = document.getElementById('country-6').value

    let countries = [country1,country2,country3,country4,country5,country6];

    loadedMessage.innerHTML = '<span>Images Loading... (</span><span id=\'load-counter\'>0</span> of 12)'
    const loadCounter = document.getElementById("load-counter")

    for (let i = 0; i < countries.length; i++){
        var url = "https://portfive.net/flag/image?keyword=" + countries[i];
        const json = await axios.get(url);

        images.push(json.data.image);
        descriptions.push(json.data.alt);

		loaded += 2
		loadCounter.innerText = loaded
        
    }
	addTimer()
    buildBoard(images, descriptions)
	shuffle()
    
    
	loadedMessage.innerText = "Images Loaded. Start Playing!"
}

function addTimer(){
	timer = setInterval(function(){
		++totalSeconds;
		var hour = Math.floor(totalSeconds / 3600);
		var minute = Math.floor((totalSeconds - hour*3600)/60);
		var seconds = totalSeconds - (hour*3600 + minute*60);
		if(hour < 10)
		hour = "0"+hour;
		if(minute < 10)
		minute = "0"+minute;
		if(seconds < 10)
		seconds = "0"+seconds;
		timerLabel.innerHTML = hour + ":" + minute + ":" + seconds;
	}, 1000)	
}

function buildBoard(images, descriptions){
	for (let i = 0; i < images.length; i++){
		for (let j=0; j < 2; j++){
			cardDiv = gameBoard.appendChild(document.createElement("div"));
			cardDiv.classList.add("game-card")
			cardDiv.dataset.type = descriptions[i]

			image = cardDiv.appendChild(document.createElement("img"));
			image.classList.add("image");
			image.classList.add("hide");
			image.src = "data:image/png;base64," + images[i];
			image.alt = "{{imageAlt}}";

			cards.push(cardDiv)
			cardDiv.addEventListener('click', showCard)
		}
	}
}

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
	firstCard.removeEventListener('click', showCard)
	secondCard.removeEventListener('click', showCard)

	resetBoard();
	return;
  }

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
		}, 750);
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
	clearInterval(timer)
	progress.innerHTML = 'GAME WON!!!'
}

function resetGame(){

}

function resetGame() {
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
        clearInterval(timer)
        loadedMessage.innerHTML = 'Pick Your Countries Below!'
        timerLabel.innerHTML = '00:00:00'
        images=[];
        descriptions = []
        cards = []

        loaded = 0
        clickCount = 0;
        pairsFound = 0;
        pairsToFind = 6;
        totalSeconds = 0;
    }
}

function shuffle() {
	cards.forEach(card => {
		let randomPos = Math.floor(Math.random() * 12);
	card.style.order = randomPos;
	});
};





