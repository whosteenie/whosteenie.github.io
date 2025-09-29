let answerKey = ["justin", "red", "list", "green", "5"];
let list = ["red", "blue"];
let answers = [];
let numCorrect = 0;
let score = 0;
let scoreText = document.querySelector("#score");

let submitButton = document.querySelector("#submit");
submitButton.addEventListener("click", function(){
    answers.push(document.querySelector("#a1").value.toLowerCase());
    let checked = document.querySelector("input[name=colors]:checked");
    if(checked === null) {
        answers.push("");
    } else {
        answers.push(checked.value);
    }
    
    let redCheck = document.querySelector("#redCheck").checked;
    let greenCheck = document.querySelector("#greenCheck").checked;
    let blueCheck = document.querySelector("#blueCheck").checked;
    let checkAnswers = [];
    if(redCheck) {
        checkAnswers.push("red");
    }
    if(greenCheck) {
        checkAnswers.push("green");
    }
    if(blueCheck) {
        checkAnswers.push("blue");
    }

    answers.push("list");
    answers.push(document.querySelector("#a4").value);
    answers.push(document.querySelector("#a5").value + "");
    console.log(answers);

    for(let i = 0; i < answerKey.length; i++) {
        let result = document.querySelector("#r" + (i + 1));

        let failed = false;
        if(answerKey[i] === "list") {
            for(let i = 0; i < list.length; i++) {
                if(checkAnswers[i] != list[i]) {
                    result.textContent = "Incorrect..."
                    result.style.backgroundColor = "red";
                    failed = true;
                }
            }

            if(failed) {
                continue;
            }

            result.textContent = "Correct!"
            result.style.backgroundColor = "green";
            numCorrect++;
            continue;
        }

        if(answers[i] === answerKey[i]) {
            result.textContent = "Correct!"
            result.style.backgroundColor = "green";
            numCorrect++;
        } else {
            result.textContent = "Incorrect..."
            result.style.backgroundColor = "red";
        }
    }

    score = numCorrect / answerKey.length;

    scoreText.textContent = "Score: " + score * 100 + "%";
    numCorrect = 0;
    answers = [];
});