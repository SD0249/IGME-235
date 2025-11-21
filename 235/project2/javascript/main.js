const toggleButton = document.getElementById("toggleFilters");
const filtersPanel = document.getElementById("filtersPanel");

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

// Setting up the page - Asynchronous Functions to handle operations and their sequential execution
async function SetUp() {
  await loadCategories();
  await loadSavedSettings();
}

// Adds category options to the drop down to display
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

// Loads previous user preference fetched from the local storage if there is one
async function loadSavedSettings() {
  // Will return null if there isn't any
  const savedCategory = localStorage.getItem("previousCategory");
  const savedDifficulty = localStorage.getItem("previousDifficulty");
  const savedType = localStorage.getItem("previousType");

  // If there is a value display
  if (savedCategory) categorySelect.value = savedCategory;
  if (savedDifficulty) difficultySelect.value = savedDifficulty;
  if (savedType) typeSelect.value = savedType;
}

// Show the spinner when loading the questions
function showLoadingState(message) {
  feedbackText.textContent = message;
  loadingSpinner.classList.remove("hidden");
  startButton.disabled = true;                // When loading disable start button
}

// Stop the loading state when questions are loaded
function clearLoadingState(message = "") {
  feedbackText.textContent = message;
  loadingSpinner.classList.add('hidden');
  startButton.disabled = false;
}

// Clicking the toggle button expands the menu
toggleBtn.addEventListener("click", () => {
  const isHidden = filtersPanel.hasAttribute("hidden");

  if (isHidden) {
    filtersPanel.removeAttribute("hidden");
    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.textContent = "Hide Filters ▲";
  } else {
    filtersPanel.setAttribute("hidden", "");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.textContent = "Show Filters ▼";
  }
});

// When clicking the start button, fetch the questions and load the first one
startButton.addEventListener("click", async () => {
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;
  const type = typeSelect.value;

  // Validation
  if (!category && !difficulty && !type) {
    feedbackText.textContent = "Please select at least one filter option.";
    return;
  }

  // Save last searched user preferences when user clicks start
  localStorage.setItem("previousCategory", category);
  localStorage.setItem("previousDifficulty", difficulty);
  localStorage.setItem("previousType", type);

  // Loading State shown after selection confirmed
  showLoadingState("Fetching questions...");

  // Fetch questions
  const url = `https://opentdb.com/api.php?amount=10${category ? `&category=${category}` : ""}${difficulty ? `&difficulty=${difficulty}` : ""}${type ? `&type=${type}` : ""}`;
  const resource = await fetch(url);
  const data = await resource.json();

  // Clear the loading state after all of the questions are retrieved - it is too quick to even see it,
  // so I decided to add a setTimeout function for better visabiltiy
  // clearLoadingState("");
  setTimeout(() => clearLoadingState(""), 200);

  questions = data.results;

  if (questions.length === 0) {
    questionText.textContent = "No questions found for the selected options!";
    answersContainer.innerHTML = "";
    feedbackText.textContent = "Try different settings.";
    return;
  }

  currentQuestionIndex = 0;
  score = 0;
  scoreValue.textContent = score;

  setTimeout(() => showQuestion(), 300);
});

// Show the question on the screen with its elements
function showQuestion() {
  const q = questions[currentQuestionIndex];
  questionText.innerHTML = decodeHTML(q.question);

  // *... is a spread operator
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

  feedbackText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

// Check whether if player clicked the correct answer
function checkAnswer(selected, correct) {
  const decodedSelected = decodeHTML(selected);
  const decodedCorrect = decodeHTML(correct);

  // Disable all answer buttons once one is clicked
  const buttons = document.querySelectorAll(".answerBtn");
  buttons.forEach(btn => btn.disabled = true);

  // Reward user or give them feedback
  if (decodedSelected === decodedCorrect) {
    feedbackText.textContent = "Correct!";
    score++;
    scoreValue.textContent = score;
  }
  else {
    feedbackText.textContent = `Wrong! Correct answer: ${decodedCorrect}`;
    scoreValue.textContent = score;
  }

  // Go over to the next question after player clicks the right or wrong answer
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

// Finish Quiz - no more questions to display
function endQuiz() {
  questionText.textContent = "Quiz complete! Test your knowledge on other catergories too!";
  answersContainer.innerHTML = "";
  feedbackText.textContent = `Final Score: ${score}`;
}

// Returns the text value containing the content related to the current html object
function decodeHTML(html) {
  const txt = document.createElement("textArea");
  txt.innerHTML = html;
  return txt.value;
}

// Shuffles the elements of an array in place using Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Multiply a random decimal number >= 0 and < 1, 
    // and multiplying by (i+1) scales the random number into range
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Setting up page
SetUp();