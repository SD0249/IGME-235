const categorySelect = document.getElementById("category");
const difficultySelect = document.getElementById("difficulty");
const typeSelect = document.getElementById("questionType");
const startButton = document.getElementById("startQuiz");

const questionText = document.getElementById("questionText");
const answersContainer = document.querySelector(".answers");
const feedbackText = document.getElementById("feedbackText");
const scoreValue = document.getElementById("scoreValue");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

async function loadCategories() {
  const resource = await fetch("https://opentdb.com/api_category.php");
  const data = await resource.json();
  data.trivia_categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

startButton.addEventListener("click", async () => {
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;
  const type = typeSelect.value;

  // Fetch questions
  const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`;
  const resource = await fetch(url);
  const data = await resource.json();
  questions = data.results;

  if (questions.length === 0) {
    questionText.textContent = "No questions found for the selected options!";
    return;
  }

  currentQuestionIndex = 0;
  score = 0;
  scoreValue.textContent = score;
  showQuestion();
});

function showQuestion() {
  const q = questions[currentQuestionIndex];
  questionText.innerHTML = decodeHTML(q.question);

  const answers = [...q.incorrect_answers, q.correct_answer];
  shuffleArray(answers);

  // Clear previous answers displayed
  answersContainer.innerHTML = "";

  // Add new answer buttons
  answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.classList.add("answerBtn");
    btn.innerHTML = decodeHTML(answer);
    btn.addEventListener("click", () => checkAnswer(answer, q.correct_answer));
    answersContainer.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  const decodedSelected = decodeHTML(selected);
  const decodedCorrect = decodeHTML(correct);

  // Disable all answer buttons once one is clicked
  const buttons = document.querySelectorAll(".answerBtn");
  buttons.forEach(btn => btn.disabled = true);

  if (decodedSelected === decodedCorrect) {
    feedbackText.textContent = "Correct!";
    score++;
    scoreValue.textContent = score;
  } 
  else {
    feedbackText.textContent = `Wrong! Correct answer: ${decodedCorrect}`;
    scoreValue.textContent = score;
  } 

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      feedbackText.textContent = ""; // clear previous feedback
      showQuestion();
    } else {
      endQuiz();
    }
  }, 1200);

}

function endQuiz() {
  questionText.textContent = "Quiz complete!";
  answersContainer.innerHTML = "";
  feedbackText.textContent = `Final Score: ${score}`;
}

function decodeHTML(html) {
  const txt = document.createElement("textArea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Initializing and Calling the loadCatergories for set up
loadCategories();