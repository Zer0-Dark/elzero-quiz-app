//select elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let spanBullets = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let minutes = document.querySelector(".bullets .countdown .minutes");
let seconds = document.querySelector(".quiz-app .bullets .countdown .seconds");
console.log(seconds);

//set Options
let currentIndex = 0;
let rightAnswers = 0;
timer();

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.open("GET", "questions1.json", true);
    myRequest.send();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 & this.status === 200) {
            let questions = JSON.parse(this.responseText);
            let qCount = questions.length;
            console.log(questions, qCount);

            // Create Bullets + Set Questions Count
            createBullets(qCount);

            // Add Question Data
            addQuestionData(questions[currentIndex], qCount);

            //click on submit
            submitButton.onclick = () => {
                //get right answer
                let theRightAnswer = questions[currentIndex]["right_answer"];
                //increase index
                currentIndex++;
                //check the Answer
                checkAnswer(qCount, theRightAnswer);

                // remove previous question
                quizArea.innerHTML = "";

                //next question data
                addQuestionData(questions[currentIndex], qCount);

                // handel bullets class
                handelBullets();

                // show results
                showResults(qCount);

                // rest the timer
                minutes.innerHTML = 00;
                seconds.innerHTML = 30;

            }
        }
    }

}
getQuestions();


function createBullets(num) {
    countSpan.innerHTML = num;

    //create Spans
    for (let i = 0; i < 9; i++) {
        let span = document.createElement("span");
        if (i === 0) {
            span.className = "on";
        }
        spanBullets.appendChild(span);
    }
}


function addQuestionData(obj, count) {
    if (currentIndex === count) {
        submitButton.remove();
        return "0";
    }
    //create the question 
    //The h2
    let h2 = document.createElement("h2");
    h2.innerText = obj.title;
    quizArea.appendChild(h2);
    //The mainDiv 
    let mainDiv = document.createElement("div");
    mainDiv.className = "answers-area";
    quizArea.appendChild(mainDiv);

    for (let i = 1; i <= 4; i++) {
        // the answer div
        let answerDiv = document.createElement("div")
        answerDiv.className = "answer";

        //create the input
        let answerInput = document.createElement("input");
        answerInput.type = "radio";
        answerInput.id = `answer_${i}`;
        answerInput.name = "question";
        answerInput.dataset.answer = obj[`answer_${i}`];

        // create the label
        let answerLabel = document.createElement("label");
        answerLabel.htmlFor = `answer_${i}`;
        answerLabel.innerText = obj[`answer_${i}`];

        //select First option
        if (i === 1) {
            answerInput.checked = true;
        }
        //append the data
        answerDiv.append(answerInput, answerLabel);
        mainDiv.appendChild(answerDiv);

    }
}


function checkAnswer(count, rAnswer) {
    let answers = document.getElementsByName("question");
    let theChosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChosenAnswer) {
        rightAnswers++;
    }
}


function handelBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (index === currentIndex) {
            span.className = "on";
        }
    })
}


function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span>,${rightAnswers} from ${count} `;

        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All is Right :) `;

        } else {
            theResults = `<span class="bad">bad</span> , ${rightAnswers} from ${count} `;

        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px"
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px"
        resultsContainer.style.textAlign = "center"
    }
}

function timer() {
    setInterval(() => {
        if (+seconds.innerHTML === 0) {
            minutes.innerHTML -= 1;
            seconds.innerHTML = 60;

        }
        seconds.innerHTML -= 1;
        if (+minutes.innerHTML === 0 && +seconds.innerHTML === 0) {
            submitButton.click();
        }
    }, 1000)
}