let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;
let won = false;

document.querySelector("#playerGuess").addEventListener("input", function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    if(this.value.length > 2) {
        this.value = this.value.slice(0, 2);
    }
});
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.addEventListener("keydown", function(event){
    if(event.key === "Enter" && !won) {
        checkGuess();
    }
});
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log("randomNumber: " + randomNumber);
    attempts = 0;

    //hiding the Reset button
    document.querySelector("#resetBtn").style.display = "none";
    document.querySelector("#guessBtn").style.display = "inline";
  
    //adding focus to textbox
    document.querySelector("#playerGuess").focus();

    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus();
    playerGuess.value = "";

    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";

    document.querySelector("#guesses").textContent = "";

    let health = document.querySelector("#health");
    health.textContent = "❤️ ".repeat(7);
    won = false;
}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);
    
    if(guess < 1 || guess > 99) {
        feedback.textContent = "Enter a number between 1 and 99.";
        feedback.style.color = "red";
        return;
    }

    let health = document.querySelector("#health");
    attempts++;
    health.textContent = "❤️ ".repeat(7 - attempts) + "🖤 ".repeat(attempts);
    console.log("Attempts: " + attempts);
    feedback.style.color = "orange";
    document.querySelector("#guesses").textContent += guess;

    if(guess == randomNumber) {
        feedback.textContent = "You guessed it! You won!";
        feedback.style.color = "darkgreen";
        attempts--;
        wins++;
        won = true;
        document.querySelector("#guesses").textContent += "✅ ";
        gameOver();
    } else {
        if(attempts == 7) {
            feedback.textContent = "Sorry, you lost!";
            feedback.style.color = "red";
            losses++;
            document.querySelector("#guesses").textContent += "☠️ ";
            gameOver();
        } else if(guess > randomNumber) {
            feedback.textContent = "Guess was high";
            document.querySelector("#guesses").textContent += "⬇️ ";
        } else {
            feedback.textContent = "Guess was low";
            document.querySelector("#guesses").textContent += "⬆️ ";
        }
    }
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none";
    resetBtn.style.display = "inline";

    document.querySelector("#wins").textContent = "Wins: " + wins;
    document.querySelector("#losses").textContent = "Losses: " + losses;
}