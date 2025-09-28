let buttonStart = document.getElementById("button-start");
let inputBet = document.getElementById("input-bet");
let buttonBet = document.getElementById("button-bet");
let buttonHit = document.getElementById("button-hit");
let buttonStand = document.getElementById("button-stand");
let buttonReset = document.getElementById("button-reset");
let buttonDouble = document.getElementById("button-double");
let buttonSplit = document.getElementById("button-split");
let buttonSurrender = document.getElementById("button-surrender");
let buttonInsurance = document.getElementById("button-insurance");

buttonStart.addEventListener("click", setBet);

buttonBet.addEventListener("click", function () {
    if (inputBet.value === "" || parseInt(inputBet.value) <= 0 || parseInt(inputBet.value) > playerChips) {
        alert("Please enter a valid bet amount.");
        return;
    }

    playerChips -= parseInt(inputBet.value);
    chipsText.textContent = "Chips: " + playerChips;

    startGame();
});

buttonHit.addEventListener("click", hit);
buttonStand.addEventListener("click", stand);
buttonReset.addEventListener("click", resetGame);

buttonDouble.addEventListener("click", () => {
    hit();
    stand();
});

buttonSplit.addEventListener("click", () => { alert("Split not implemented yet!"); });
buttonSurrender.addEventListener("click", surrender);
buttonInsurance.addEventListener("click", () => { alert("Insurance not implemented yet!"); });

inputBet.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        startGame();
    }
});

inputBet.addEventListener("input", function (event) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

let statusMessage = document.getElementById("status-message");
let labelDealer = document.getElementById("label-dealer");

let cardBack = document.getElementById("card-back");

let deck = [];

let dealerHand = document.getElementById("dealer-area");
let dealerCards = [];
let dealerScore = 0;
let dealerAces = 0;

let playerHand = document.getElementById("player-area");
let playerCards = [];
let playerScore = 0;
let playerAces = 0;

let playerChips = 10000;
let playerBet = 0;
let chipsText = document.querySelector("#chips");
chipsText.textContent = "Chips: " + playerChips;
let betText = document.querySelector("#bet");
betText.textContent = "Current Bet: " + playerBet;
inputBet.value = "";

let standing = false;

let suits = ['h', 'd', 'c', 's'];
for (let i = 1; i < 14; i++) {
    suits.forEach(suit => {
        let img = new Image();
        img.src = `img/cards/${i}${suit}.png`;
    });
}

let hiddenImg = new Image();
hiddenImg.src = 'img/cards/hidden.png';

function startGame() {
    console.log("Game started");
    labelDealer.style.display = "block";
    cardBack.style.display = "none";
    playerBet = parseInt(inputBet.value);
    inputBet.style.display = "none";
    buttonBet.style.display = "none";
    betText.textContent = "Current Bet: " + playerBet;

    buttonHit.style.display = "inline-block";
    buttonStand.style.display = "inline-block";
    buttonDouble.style.display = "inline-block";
    buttonSurrender.style.display = "inline-block";

    chipsText.textContent = "Chips: " + playerChips;

    for (let i = 1; i < 14; i++) {
        suits.forEach(suit => {
            deck.push(i + suit);
        });
    }

    dealCard("player");
    dealCard("dealer");
    dealCard("player");
    dealCard("dealer");

    if (playerCards.length === 2 && Math.min(parseInt(playerCards[0].slice(0, -1)), 10) === Math.min(parseInt(playerCards[1].slice(0, -1)), 10)) {
        buttonSplit.style.display = "inline-block";
    }

    if (dealerScore === 21) {
        revealDealer();

        if (playerScore === 21) {
            statusMessage.textContent = "Push!";
        } else {
            statusMessage.textContent = "Dealer has blackjack! Dealer wins!";
            betText.textContent = "Current Bet: 0";
        }

        hideButtons();
    }

    console.log("Player Score: " + playerScore);
}

function setBet() {
    buttonStart.style.display = "none";
    inputBet.style.display = "inline-block";
    buttonBet.style.display = "inline-block";
}

function dealCard(handType) {
    let randomIndex = Math.floor(Math.random() * deck.length);

    if (handType === "player") {
        playerCards.push(deck[randomIndex]);
        let score = Math.min(parseInt(playerCards[playerCards.length - 1].slice(0, -1)), 10)

        if (score === 1) {
            if (playerScore + 11 <= 21) {
                playerScore += 11;
                playerAces += 1;
            } else {
                playerScore += 1;
            }
        } else {
            if (playerAces > 0 && playerScore + score > 21) {
                playerScore -= 10;
                playerAces -= 1;
            }

            playerScore += score;
        }

        updateHand("player");

        if (playerScore === 21) {
            stand();
        }
    } else if (handType === "dealer") {
        dealerCards.push(deck[randomIndex]);
        let score = Math.min(parseInt(dealerCards[dealerCards.length - 1].slice(0, -1)), 10)

        if (score === 1) {
            if (dealerScore + 11 <= 21) {
                dealerScore += 11;
                dealerAces += 1;
            } else {
                dealerScore += 1;
            }
        } else {
            if (dealerAces > 0 && dealerScore + score > 21) {
                dealerScore -= 10;
                dealerAces -= 1;
            }

            dealerScore += score;
        }

        updateHand("dealer");
    }

    deck.splice(randomIndex, 1);
}

function updateHand(handType) {
    let newCard = document.createElement("div");
    newCard.className = "card";
    newCard.style.backgroundSize = "cover";

    if (handType === "player") {
        newCard.style.backgroundImage = `url(img/cards/${playerCards[playerCards.length - 1]}.png)`;
        playerHand.appendChild(newCard);
    } else if (handType === "dealer") {
        if (dealerCards.length < 2 || standing) {
            newCard.style.backgroundImage = `url(img/cards/${dealerCards[dealerCards.length - 1]}.png)`;
        } else {
            newCard.style.backgroundImage = "url(img/cards/hidden.png)";
        }
        dealerHand.appendChild(newCard);
    }
}

function hit() {
    buttonSurrender.style.display = "none";
    buttonInsurance.style.display = "none";
    buttonDouble.style.display = "none";
    buttonSplit.style.display = "none";
    dealCard("player");
    console.log("Player Score: " + playerScore);

    if (playerScore > 21) {
        revealDealer();

        statusMessage.textContent = "Player busts! Dealer wins!";
        buttonHit.style.display = "none";
        buttonStand.style.display = "none";
        buttonReset.style.display = "inline-block";
    }
}

function stand() {
    standing = true;

    hideButtons();
    revealDealer();

    if (playerScore === 21 && playerCards.length === 2) {
        statusMessage.textContent = "Player has blackjack! Player wins!";
        playerChips += Math.floor(playerBet * 1.5);
        playerChips += playerBet;
        chipsText.textContent = "Chips: " + playerChips;
    } else {
        if (playerScore > 21) {
            statusMessage.textContent = "Player busts! Dealer wins!";
            return;
        }

        while (dealerScore < 17) {
            dealCard("dealer");
        }

        if (dealerScore > 21) {
            statusMessage.textContent = "Dealer busts! Player wins!";
            playerChips += playerBet * 2;
            chipsText.textContent = "Chips: " + playerChips;
        } else if (dealerScore > playerScore) {
            statusMessage.textContent = "Dealer wins!";
        } else if (dealerScore < playerScore) {
            statusMessage.textContent = "Player wins!";
            playerChips += playerBet * 2;
            chipsText.textContent = "Chips: " + playerChips;
        } else if (dealerScore === playerScore) {
            statusMessage.textContent = "Push!";
        }
    }

    betText.textContent = "Current Bet: 0";
}

function surrender() {
    statusMessage.textContent = "Player surrenders! Dealer wins!";
    playerChips += Math.floor(playerBet / 2);
    chipsText.textContent = "Chips: " + playerChips;
    betText.textContent = "Current Bet: 0";
    hideButtons();
    revealDealer();
}

function revealDealer() {
    dealerHand.innerHTML = "";

    for (let i = 0; i < dealerCards.length; i++) {
        let newCard = document.createElement("div");
        newCard.className = "card";
        newCard.style.backgroundSize = "cover";
        newCard.style.backgroundImage = `url(img/cards/${dealerCards[i]}.png)`;
        dealerHand.appendChild(newCard);
    }
}

function resetGame() {
    buttonStart.style.display = "inline-block";
    buttonReset.style.display = "none";

    deck = [];

    dealerCards = [];
    dealerScore = 0;
    dealerAces = 0;
    dealerHand.innerHTML = "";

    playerCards = [];
    playerScore = 0;
    playerAces = 0;
    playerHand.innerHTML = "";

    standing = false;

    statusMessage.textContent = "";

    playerBet = 0;
    betText.textContent = "Current Bet: " + playerBet;

    cardBack.style.display = "inline-block";
    labelDealer.style.display = "none";
}

function hideButtons() {
    buttonHit.style.display = "none";
    buttonStand.style.display = "none";
    buttonDouble.style.display = "none";
    buttonSplit.style.display = "none";
    buttonSurrender.style.display = "none";
    buttonInsurance.style.display = "none";
    buttonReset.style.display = "inline-block";
}