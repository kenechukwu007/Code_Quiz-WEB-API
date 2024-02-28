// add variables that keep track of the quiz "state"
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;

// add variables to reference DOM elements
// example is below
let questionsEl = document.getElementById('questions');


// reference the sound effects
let sfxRight = new Audio('assets/sfx/correct.wav');
let sfxWrong = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  // hide start screen
  document.getElementById('start-screen').style.display = 'none';

  // un-hide questions section
  questionsEl.style.display = 'block';
  // start timer
  timerId = setInterval(clockTick, 1000);
  // show starting time
  document.getElementById('time').textContent = time;
  // call a function to show the next question
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  let currentQuestion = questions[currentQuestionIndex];
  // update title with current question
  questionsEl.textContent = currentQuestion.title;
  //choicesEl.textContent = currentQuestion.choices;
  var choicesEl = document.getElementById('choices');

  console.log(choicesEl);
  if (choicesEl) {
    // Clear out any old question choices
    choicesEl.innerHTML = '';

    // Loop over the choices for each question using a basic for loop
    for (var i = 0; i < currentQuestion.choices.length; i++) {
      // Create a new button for each choice
      var choiceBtn = document.createElement('button');
      // Set the text content of the button to the choice
      choiceBtn.textContent = currentQuestion.choices[i];
      // Set the value attribute of the button to the choice
      choiceBtn.setAttribute('value', currentQuestion.choices[i]);

      // Append the choice button to the choicesEl container
      choicesEl.appendChild(choiceBtn);
    }
  } else {
    console.error("Element with id 'choices' not found.");
  }
}

function questionClick(event) {
  if (event.target.matches('button')) {
    let userAnswer = event.target.value;

    // Check if user guessed wrong
    if (userAnswer !== questions[currentQuestionIndex].answer) {
      // Penalize time by subtracting 15 seconds from the timer
      time -= 15;

      // If they run out of time, set time to zero
      if (time < 0) {
        time = 0;
      }

      // Display new time on page
      document.getElementById('time').textContent = time;

      // Play "wrong" sound effect
      sfxWrong.play();

      // Display "wrong" feedback on page
      document.getElementById('feedback').textContent = 'Wrong!';
    } else {
      // Play "right" sound effect
      sfxRight.play();

      // Display "right" feedback on page
      document.getElementById('feedback').textContent = 'Correct!';
    }

    // Flash right/wrong feedback on page
    document.getElementById('feedback').classList.add('feedback');

    // After one second, remove the "feedback" class from the feedback element
    setTimeout(() => {
      document.getElementById('feedback').classList.remove('feedback');

      // Move to next question
      currentQuestionIndex++;

      // Check if we've run out of questions
      if (currentQuestionIndex === questions.length || time <= 0) {
        quizEnd();
      } else {
        getQuestion();
      }
    }, 1000);
  }
}

// define the steps of the QuizEnd function...when the quiz ends...
function quizEnd() {
  clearInterval(timerId);

  // Show end screen
  document.getElementById('end-screen').style.display = 'block';

  // Show final score
  document.getElementById('final-score').textContent = time;

  // Hide the "questions" section
  questionsEl.style.display = 'none';
}

// add the code in this function to update the time, it should be called every second
function clockTick() {
  time--;

  // Update the element to display the new time value
  document.getElementById('time').textContent = time;

  // Check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }

}

// complete the steps to save the high score
function saveHighScore() {

  let initials = document.getElementById('initials').value.trim();

  if (initials !== '') {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    let newScore = {
      initials: initials,
      score: time,
    };

    highScores.push(newScore);

    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Redirect the user to the high scores page
    window.location.href = 'highscores.html';
  }

}
function checkForEnter(event) {
  // if the user presses the enter key, then call the saveHighscore function
  if (event.key === 'Enter') {
    saveHighScore();
  }
}

// user clicks button to submit initials
submit.onclick = saveHighScore;

// user clicks button to start quiz
start.onclick = startQuiz;

// user clicks on an element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;

document.addEventListener('DOMContentLoaded', function() {
  // Your JavaScript code here
  startQuiz();
  // Other code related to your application
});
