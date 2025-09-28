// DOM Elements
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
let cardBack = document.getElementById("card-back");
let dealerHand = document.getElementById("dealer-area");
let playerHand = document.getElementById("player-area");
let handArea = document.getElementById("hand-area");
let dealerArea = document.getElementById("dealer-area");
let tableArea = document.getElementById("table-area");
let playerArea = document.getElementById("player-area");
let textDealer = document.getElementById("text-dealer");
let textPlayer = document.getElementById("text-player");
let textChips = document.getElementById("text-chips");
let textBet = document.getElementById("text-bet");
let textStatus = document.getElementById("text-status");

// Game Variables
let deck = [];
let dealerCards = [];
let dealerScore = 0;
let dealerAces = 0;
let dealerHidden = "";
let playerCards = [];
let playerScore = 0;
let playerAces = 0;
let playerChips = 10000;
let playerBet = 0;
let standing = false;

// Initial Display
textChips.textContent = `Chips: ${playerChips}`;
textBet.textContent = `Current Bet: ${playerBet}`;
inputBet.value = "";

// Preload Card Images
let suits = ['h', 'd', 'c', 's'];
for (let i = 1; i < 14; i++) {
    suits.forEach(suit => {
        let img = new Image();
        img.src = `img/cards/${i}${suit}.png`;
    });
}

let hiddenImg = new Image();
hiddenImg.src = 'img/cards/hidden.png';

// Event Listeners
buttonStart.addEventListener("click", setBet);
buttonBet.addEventListener("click", function () {
    if (inputBet.value === "" || parseInt(inputBet.value) <= 0 || parseInt(inputBet.value) > playerChips) {
        textStatus.textContent = "Invalid bet amount!";
        textStatus.style.color = "red";
        return;
    }

    startGame();
});
buttonHit.addEventListener("click", hit);
buttonStand.addEventListener("click", stand);
buttonReset.addEventListener("click", resetGame);
buttonDouble.addEventListener("click", () => {
    playerChips -= playerBet;
    playerBet *= 2;
    textChips.textContent = `Chips: ${playerChips}`;
    textBet.textContent = `Current Bet: ${playerBet}`;
    hit();
    stand();
});
buttonSplit.addEventListener("click", () => {
    textStatus.textContent = "Split not implemented yet!";
    textStatus.style.color = "red";
});
buttonSurrender.addEventListener("click", surrender);
buttonInsurance.addEventListener("click", () => {
    textStatus.textContent = "Insurance not implemented yet!";
    textStatus.style.color = "red";
});
inputBet.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (inputBet.value === "" || parseInt(inputBet.value) <= 0 || parseInt(inputBet.value) > playerChips) {
            textStatus.textContent = "Invalid bet amount!";
            textStatus.style.color = "red";
            return;
        }

        startGame();
    }
});
inputBet.addEventListener("input", function (event) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Game Functions
function startGame() {
    // Show game areas
    handArea.style.display = "flex";
    dealerArea.style.display = "flex";
    tableArea.style.display = "block";
    playerArea.style.display = "flex";
    textDealer.textContent = "Dealer's Hand";
    textPlayer.textContent = "Player's Hand";
    cardBack.style.display = "none";
    inputBet.style.display = "none";
    buttonBet.style.display = "none";
    buttonHit.style.display = "inline-block";
    buttonStand.style.display = "inline-block";
    buttonSurrender.style.display = "inline-block";
    textStatus.textContent = "";
    textStatus.style.color = "white";

    // Set bet
    playerBet = parseInt(inputBet.value);
    playerChips -= playerBet;
    textBet.textContent = `Current Bet: ${playerBet}`;
    textChips.textContent = `Chips: ${playerChips}`;

    if (playerChips >= playerBet) {
        buttonDouble.style.display = "inline-block";
    }

    // Initialize deck
    for (let i = 1; i < 14; i++) {
        suits.forEach(suit => {
            deck.push(i + suit);
        });
    }

    // Deal initial cards
    dealCard("player");
    dealCard("dealer");
    dealCard("player");
    dealCard("dealer");

    // Check for split
    if (playerCards.length === 2 && Math.min(parseInt(playerCards[0].slice(0, -1)), 10) === Math.min(parseInt(playerCards[1].slice(0, -1)), 10)) {
        buttonSplit.style.display = "inline-block";
    }

    // Check for insurance
    // Can't figure out how to allow for insurance and end the game if dealer has blackjack
    //
    // if (Math.min(parseInt(dealerCards[0].slice(0, -1)), 10) === 1) {
    //     buttonInsurance.style.display = "inline-block";
    // }

    // Check for blackjack
    if (dealerScore === 21) {
        revealDealer();

        if (playerScore === 21) {
            textStatus.textContent = "Push!";
            playerChips += playerBet;
        } else {
            textStatus.textContent = "Dealer has blackjack! Dealer wins!";
            textDealer.textContent = "Dealer's Hand 👑";
        }

        textBet.textContent = "Current Bet: 0";
        hideButtons();
    } else if(playerScore === 21) {
        textStatus.textContent = "Player has blackjack! Player wins!";
        textPlayer.textContent = "Player's Hand 👑";
        playerChips += Math.floor(playerBet * 1.5) + playerBet;
        textChips.textContent = "Chips: " + playerChips;
        revealDealer();
        hideButtons();
    }

    console.log("Player Score: " + playerScore);
}

// Show bet input and button
function setBet() {
    buttonStart.style.display = "none";
    inputBet.style.display = "inline-block";
    buttonBet.style.display = "inline-block";
}

// Add card to the appropriate hand and update score
function dealCard(handType) {
    let randomIndex = Math.floor(Math.random() * deck.length);
    let card = deck.splice(randomIndex, 1)[0];
    let score = Math.min(parseInt(card.slice(0, -1)), 10);

    if (handType === "player") {
        playerCards.push(card);

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

        if (playerScore === 21 && playerCards.length > 2) {
            stand();
        }
    } else if (handType === "dealer") {
        dealerCards.push(card);

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
}

// Create a new card element and add it to the appropriate hand
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
            newCard.id = "dealer-hidden";
            dealerHidden = dealerCards[dealerCards.length - 1];
            newCard.style.backgroundImage = "url(img/cards/hidden.png)";
        }
        dealerHand.appendChild(newCard);
    }
}

// Draw a card for the player
function hit() {
    buttonSurrender.style.display = "none";
    buttonInsurance.style.display = "none";
    buttonDouble.style.display = "none";
    buttonSplit.style.display = "none";
    textStatus.textContent = "";
    textStatus.style.color = "white";
    dealCard("player");
    console.log("Player Score: " + playerScore);

    if (playerScore > 21) {
        revealDealer();
        textStatus.textContent = "Player busts! Dealer wins!";
        textDealer.textContent = "Dealer's Hand 👑";
        textBet.textContent = "Current Bet: 0";
        hideButtons();
    }
}

// Player stands, dealer's turn
function stand() {
    textStatus.style.color = "white";
    standing = true;
    hideButtons();
    revealDealer();

    if (playerScore === 21 && playerCards.length === 2) {
        textStatus.textContent = "Player has blackjack! Player wins!";
        textPlayer.textContent = "Player's Hand 👑";
        playerChips += Math.floor(playerBet * 1.5) + playerBet;
    } else if (playerScore > 21) {
        textStatus.textContent = "Player busts! Dealer wins!";
        textDealer.textContent = "Dealer's Hand 👑";
    } else {
        while (dealerScore < 17) {
            dealCard("dealer");
        }

        if (dealerScore > 21) {
            textStatus.textContent = "Dealer busts! Player wins!";
            textPlayer.textContent = "Player's Hand 👑";
            playerChips += playerBet * 2;
        } else if (dealerScore > playerScore) {
            textStatus.textContent = "Dealer wins!";
            textDealer.textContent = "Dealer's Hand 👑";
        } else if (dealerScore < playerScore) {
            textStatus.textContent = "Player wins!";
            textPlayer.textContent = "Player's Hand 👑";
            playerChips += playerBet * 2;
        } else if (dealerScore === playerScore) {
            textStatus.textContent = "Push!";
            playerChips += playerBet;
        }
    }

    textChips.textContent = `Chips: ${playerChips}`;
    textBet.textContent = "Current Bet: 0";
}

// Player surrenders half the bet
function surrender() {
    textStatus.textContent = "Player surrenders! Dealer wins!";
    textStatus.style.color = "white";
    textDealer.textContent = "Dealer's Hand 👑";
    playerChips += Math.floor(playerBet / 2);
    textChips.textContent = `Chips: ${playerChips}`;
    textBet.textContent = "Current Bet: 0";
    hideButtons();
    revealDealer();
}

// Reveal dealer's hidden card
function revealDealer() {
    dealerHand.children[1].style.backgroundImage = `url(img/cards/${dealerHidden}.png)`;
}

// Reset game to initial state
function resetGame() {
    handArea.style.display = "none";
    dealerArea.style.display = "none";
    tableArea.style.display = "none";
    playerArea.style.display = "none";
    buttonStart.style.display = "inline-block";
    buttonReset.style.display = "none";
    cardBack.style.display = "inline-block";
    textDealer.textContent = "";
    textPlayer.textContent = "";

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
    playerBet = 0;
    textStatus.textContent = "";
    textStatus.style.color = "white";
    textBet.textContent = `Current Bet: ${playerBet}`;

    if (playerChips <= 0) {
        playerChips = 10000;
        textChips.textContent = `Chips: ${playerChips}`;
        textStatus.textContent = "You ran out of chips! Here's 10000 more to play with.";
        textStatus.style.color = "yellow";
    }
}

// Hide game action buttons and show reset button
function hideButtons() {
    buttonHit.style.display = "none";
    buttonStand.style.display = "none";
    buttonDouble.style.display = "none";
    buttonSplit.style.display = "none";
    buttonSurrender.style.display = "none";
    buttonInsurance.style.display = "none";
    buttonReset.style.display = "inline-block";
}