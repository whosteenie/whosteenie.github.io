let answerKey = ["justin", "red", "list", "green", "5"];
let list = ["red", "blue"];
let answers = [];
let numCorrect = 0;
let score = 0;
let scoreText = document.querySelector("#score");

let questionOne = document.querySelector("#label-a1");
let questionTwo = document.querySelector("#label-a2");
let questionThree = document.querySelector("#label-a3");
let questionFour = document.querySelector("#label-a4");
let questionFive = document.querySelector("#label-a5");

let questions = [questionOne, questionTwo, questionThree, questionFour, questionFive];

let submitButton = document.querySelector("#submit");

submitButton.addEventListener("click", function () {
    questions.forEach((q) => {
        q.textContent = q.textContent.replace(/[✔️❌]/g, '');
    });

    answers = [];
    numCorrect = 0;

    answers.push(document.querySelector("#a1").value.toLowerCase().trim());

    let checked = document.querySelector("input[name=colors]:checked");
    if (checked === null) {
        answers.push("");
    } else {
        answers.push(checked.value);
    }

    let redCheck = document.querySelector("#redCheck").checked;
    let greenCheck = document.querySelector("#greenCheck").checked;
    let blueCheck = document.querySelector("#blueCheck").checked;
    let checkAnswers = [];
    if (redCheck) {
        checkAnswers.push("red");
    }
    if (greenCheck) {
        checkAnswers.push("green");
    }
    if (blueCheck) {
        checkAnswers.push("blue");
    }

    answers.push(checkAnswers);
    answers.push(document.querySelector("#a4").value.toLowerCase().trim());
    answers.push(document.querySelector("#a5").value.trim());

    for (let i = 0; i < answerKey.length; i++) {
        if (answerKey[i] === "list") {
            let isCorrect = checkAnswers.length === list.length &&
                checkAnswers.every((val, idx) => val === list[idx]);

            if (isCorrect) {
                questions[i].textContent = `${questions[i].textContent} ✔️`;
                numCorrect++;
            } else {
                questions[i].textContent = `${questions[i].textContent} ❌`;
            }
            continue;
        }

        if (answers[i] === answerKey[i]) {
            questions[i].textContent = `${questions[i].textContent} ✔️`;
            numCorrect++;
        } else {
            questions[i].textContent = `${questions[i].textContent} ❌`;
        }
    }

    score = (numCorrect / answerKey.length) * 100;
    scoreText.textContent = `Score: ${score}%`;

    if(score >= 80) {
        scoreText.style.color = "green";
        scoreText.textContent += " - GOOD JOB!";
    }
});