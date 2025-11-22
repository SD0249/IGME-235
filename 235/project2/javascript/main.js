const categorySelect = document.querySelector("#category");
const difficultySelect = document.querySelector("#difficulty");
const typeSelect = document.querySelector("#questionType");
const startButton = document.querySelector("#startQuiz");

const questionText = document.querySelector("#questionText");
const answersContainer = document.querySelector(".answers");
const feedbackText = document.querySelector("#feedbackText");
const scoreValue = document.querySelector("#scoreValue");

const loadingSpinner = document.querySelector("#loadingSpinner");

let timer = null;
let timeElapsed = 0;  // Resets every question
let times = [];
let categoryTimeStats = JSON.parse(localStorage.getItem("categoryTimeStats")) || {};

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Setting up the page - Asynchronous Functions to handle operations and their sequential execution
async function SetUp() {
  await loadCategories();
  await loadSavedSettings();
  await updateStrengthDisplay();
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
  const url = `https://opentdb.com/api.php?amount=10${category ? `&category=${category}` : ""}${difficulty ? `&difficulty=${difficulty}` : ""}${type ? `&type=${type}` : ""}`;

  // Fetch questions -
  // When there are too many requests in a short amount of time, the browser throws 429 error
  // Solution -> Wrap it in Try/Catch and Check HTTP status!
  try {
    const resource = await fetch(url);

    // Detect 429 or server errors
    if (!resource.ok) {
      if (resource.status === 429) {
        clearLoadingState("You are sending too many requests! Please wait a moment.");
      } else {
        clearLoadingState(`Server Error. Try again later. Detail: ${resource.status}`);
      }
      return;
    }

    // At this point, resource was successfully fetched!
    const data = await resource.json();

    // If OpenTrivia Database has returned a response_code of 5
    if (data.response_code === 5) {
      clearLoadingState("Too many requests! Please slow down.");
      return;
    }

    // Questions were returned, proceed
    questions = data.results;

  } catch (error) {
    // Catch only runs for Network failure - No HTTP Response could be established at all.
    clearLoadingState("Network error. Please check your connection.");
    console.error("Fetch error:", error);
  }

  // ** At this point, it means the response from trivia base was also good!
  // Clear the loading state after all of the questions are retrieved - it is too quick to even see it,
  // so I decided to add a setTimeout function for better visabiltiy
  // clearLoadingState("");
  setTimeout(() => clearLoadingState(""), 200);

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
  let answers = [...q.incorrect_answers, q.correct_answer];

  // Only shuffle the answers when it is a multiple choice question
  if (q.type.toLowerCase() === "multiple" && answers.length > 2) {
    shuffleArray(answers);
  }
  // Enforce not shuffled values for T/F questions
  else if (q.type === "boolean") {
    answers = ["True", "False"];

    // Swap if correct answer is false 
    if (!answers.includes(q.correct_answer)) {
      answers = [q.correct_answer, answers.find(a => a !== q.correct_answer)];
    }
  }

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

  startTimer();
}

// Set interval of timer to 1s
function startTimer() {
  if (timer) clearInterval(timer);  // reset if needed
  timeElapsed = 0;

  // Update timer every second
  timer = setInterval(() => {
    timeElapsed++;
    updateTimerDisplay();
  }, 1000);
}

// Show elapsed time each second
function updateTimerDisplay() {
  feedbackText.textContent = `Time: ${timeElapsed}s | Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

// Check whether if player clicked the correct answer
function checkAnswer(selected, correct) {
  // STOP Timing IMMEDIATELY!!
  clearInterval(timer);

  const decodedSelected = decodeHTML(selected);
  const decodedCorrect = decodeHTML(correct);

  // Disable all answer buttons once one is clicked
  const buttons = document.querySelectorAll(".answerBtn");
  buttons.forEach(btn => btn.disabled = true);

  // Reward user or give them feedback
  if (decodedSelected === decodedCorrect) {
    feedbackText.textContent = `Correct! You answered in ${timeElapsed}s!`;
    score++;
    scoreValue.textContent = score;
    times.push(timeElapsed);
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

  // Reset timer related values
  clearInterval(timer);
  timer = null;

  // Show average time on this subject
  const average = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
  feedbackText.textContent = `Final Score: ${score} - Average Time: ${average}`;

  // Store the average time for this category in local storage
  updateCategoryStats();
}

// Updates the value of the average solving time taken for this category
function updateCategoryStats() {
  const category = categorySelect.options[categorySelect.selectedIndex].textContent;

  if (!categoryTimeStats[category]) {
    categoryTimeStats[category] = { totalTime: 0, totalQuestions: 0 };
  }

  // Add this quiz session's run time
  const totalThisQuiz = times.reduce((sum, t) => sum + t, 0);
  const questionsThisQuiz = times.length;

  categoryTimeStats[category].totalTime += totalThisQuiz;
  categoryTimeStats[category].totalQuestions += questionsThisQuiz;

  // Save it to local storage every time it occurs!
  localStorage.setItem("categoryTimeStats", JSON.stringify(categoryTimeStats));

  // Update strongest/weakest display on score sidebar
  updateStrengthDisplay();
}

// Updates the display of user's strongest and weakest suite
async function updateStrengthDisplay() {
  let best = null;
  let worst = null;

  for (const category in categoryTimeStats) {
    const c = categoryTimeStats[category];
    const avg = c.totalTime / c.totalQuestions;

    if (!best || avg < best.avg) best = { category, avg };
    if (!worst || avg > worst.avg) worst = { category, avg };
  }

  // Update sidebar
  document.querySelector("#strongestCategory").textContent =
    best ? `${best.category} (${best.avg.toFixed(1)}s average)` : "N/A";

  document.querySelector("#weakestCategory").textContent =
    worst ? `${worst.category} (${worst.avg.toFixed(1)}s average)` : "N/A";

  // Reset the timers array
  times = [];
}

// Returns the text value containing the content related to the current html object
function decodeHTML(html) {
  const txt = document.createElement("textarea");
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