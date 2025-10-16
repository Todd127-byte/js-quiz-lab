// === QUIZ DATA ===
const quizData = [
  { question: "What does 'let' declare in JavaScript?", options: ["A constant value", "A changeable variable", "A function", "An array"], correct: 1 },
  { question: "Which is the strict equality operator?", options: ["==", "=", "===", "!="], correct: 2 },
  { question: "What is the purpose of a for loop?", options: ["To declare variables", "To repeat code a set number of times", "To handle events", "To style elements"], correct: 1 },
  { question: "How do you select an element by ID in the DOM?", options: ["querySelector", "getElementById", "createElement", "appendChild"], correct: 1 },
  { question: "Which keyword defines a constant variable?", options: ["let", "var", "const", "static"], correct: 2 },
  { question: "Which method adds a new element at the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correct: 0 },
  { question: "What does the 'return' keyword do in a function?", options: ["Stops the loop", "Outputs a value from the function", "Declares a variable", "Breaks the program"], correct: 1 },
  { question: "Which event occurs when a user clicks an HTML element?", options: ["onmouseclick", "onchange", "onclick", "onhover"], correct: 2 },
  { question: "How do you write a single-line comment in JavaScript?", options: ["<!-- comment -->", "// comment", "/* comment */", "# comment"], correct: 1 },
  { question: "Which built-in method converts a string to uppercase?", options: ["changeCase()", "upperCase()", "toUpperCase()", "convertUpper()"], correct: 2 }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = -1;
let timerInterval;
let timeLeft = 30;
let highScore = localStorage.getItem("jsQuizHighScore") || 0;

// === PROGRESS ===
function updateProgress() {
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  document.getElementById("progress-fill").style.width = progress + "%";
  document.getElementById("current-q").textContent = currentQuestion + 1;
  document.getElementById("total-q").textContent = quizData.length;
}

// === TIMER ===
function startTimer() {
  timeLeft = 30;
  document.getElementById("timer-container").style.display = "block";
  document.getElementById("timer-text").textContent = timeLeft;
  document.getElementById("timer-fill").style.width = "100%";

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer-text").textContent = timeLeft;
    document.getElementById("timer-fill").style.width = (timeLeft / 30) * 100 + "%";
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    document.getElementById("timer-container").style.display = "none";
  }
}

// === LOAD QUESTION ===
function loadQuestion() {
  const q = quizData[currentQuestion];
  document.getElementById("question").textContent = q.question;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option");
    btn.onclick = () => selectOption(index);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("next-btn").style.display = "none";
  updateProgress();
  startTimer();
}

// === HANDLE SELECTION ===
function selectOption(index) {
  if (selectedAnswer !== -1) return;
  selectedAnswer = index;
  clearTimer();

  const options = document.querySelectorAll(".option");
  options.forEach((opt, i) => {
    opt.disabled = true;
    if (i === quizData[currentQuestion].correct) opt.classList.add("correct");
    else if (i === index && index !== quizData[currentQuestion].correct) opt.classList.add("incorrect");
  });

  document.getElementById("next-btn").style.display = "block";
}

// === NEXT QUESTION ===
function nextQuestion() {
  if (selectedAnswer === quizData[currentQuestion].correct) score++;
  currentQuestion++;
  selectedAnswer = -1;

  if (currentQuestion < quizData.length) loadQuestion();
  else showScore();
}

// === SHOW SCORE ===
function showScore() {
  clearTimer();
  document.getElementById("question-container").style.display = "none";
  document.getElementById("score-container").style.display = "block";

  const percentage = Math.round((score / quizData.length) * 100);
  document.getElementById("score-circle-text").textContent = score;
  document.getElementById("total-score").textContent = quizData.length;

  let feedback = "";
  if (percentage >= 90) feedback = "Outstanding! You're a JS wizard!";
  else if (percentage >= 70) feedback = "Great job! Keep practicing!";
  else feedback = "Good effort! Review your notes and try again.";

  document.getElementById("feedback").textContent = feedback;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("jsQuizHighScore", highScore);
  }

  document.getElementById("high-score").style.display = "block";
  document.getElementById("high-score-val").textContent = highScore;
}

// === RESTART ===
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = -1;
  document.getElementById("score-container").style.display = "none";
  document.getElementById("question-container").style.display = "block";
  loadQuestion();
}

// === START SCREEN FUNCTIONS ===
function startQuiz() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  loadQuestion();
}

function showHighScoreOnly() {
  const savedHighScore = localStorage.getItem("jsQuizHighScore");
  const display = document.getElementById("display-highscore");
  if (savedHighScore) {
    display.textContent = `🏆 Highest Score: ${savedHighScore}/10`;
  } else {
    display.textContent = "No high score yet. Play to set one!";
  }
}
