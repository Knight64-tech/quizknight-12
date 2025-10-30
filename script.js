// 1. Define all your quizzes here
const allQuizzes = {
    // Quiz 1: General Knowledge
    generalKnowledge: [
        {
            question: "What is the capital of France?",
            answers: [
                { text: "Berlin", correct: false },
                { text: "Madrid", correct: false },
                { text: "Paris", correct: true },
                { text: "Rome", correct: false },
            ]
        },
        {
            question: "Which planet is known as the Red Planet?",
            answers: [
                { text: "Earth", correct: false },
                { text: "Mars", correct: true },
                { text: "Jupiter", correct: false },
                { text: "Venus", correct: false },
            ]
        },
        // Add more General Knowledge questions...
    ],

    // Quiz 2: Programming Fundamentals
    programming: [
        {
            question: "What does HTML stand for?",
            answers: [
                { text: "HyperText Markup Language", correct: true },
                { text: "High-level Text Management Language", correct: false },
                { text: "Hyperlink and Text Markup", correct: false },
            ]
        },
        {
            question: "Which keyword is used to declare a variable in JavaScript?",
            answers: [
                { text: "var", correct: true },
                { text: "int", correct: false },
                { text: "string", correct: false },
                { text: "declare", correct: false },
            ]
        },
        // Add more Programming questions...
    ],
    // You can add more quizzes (e.g., 'history', 'science') here
};


// Get DOM elements
const quizTitleElement = document.getElementById("quiz-title");
const quizSelectionScreen = document.getElementById("quiz-selection");
const quizContainer = document.querySelector(".quiz-container");
const questionTextElement = document.getElementById("question-text");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreValueElement = document.getElementById("score-value");

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// 2. Function to load the selected quiz
function loadQuiz(quizKey) {
    currentQuestions = allQuizzes[quizKey];
    quizSelectionScreen.classList.add("hide"); // Hide selection screen
    quizContainer.classList.remove("hide"); // Show quiz container
    quizTitleElement.textContent = formatQuizName(quizKey) + " Quiz"; // Update title
    
    startQuiz();
}

// Helper function to format the key for the title
function formatQuizName(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
}

// 3. Setup event listeners for quiz buttons
function setupQuizSelection() {
    // Dynamically create buttons for each quiz defined in allQuizzes
    for (const key in allQuizzes) {
        const button = document.createElement("button");
        button.textContent = formatQuizName(key);
        button.classList.add("quiz-select-btn");
        button.addEventListener("click", () => loadQuiz(key));
        quizSelectionScreen.appendChild(button);
    }
}

// --- Standard Quiz Logic (Mostly unchanged) ---

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreValueElement.textContent = score;
    nextButton.classList.add("hide");
    showQuestion();
}

function showQuestion() {
    resetState();

    let currentQuestion = currentQuestions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionTextElement.textContent = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add("hide");
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    
    scoreValueElement.textContent = score;

    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.classList.remove("hide");
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    resetState();
    questionTextElement.textContent = `You scored ${score} out of ${currentQuestions.length}! 🎉`;
    nextButton.textContent = "Take Another Quiz";
    nextButton.classList.remove("hide");
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuestions.length) {
        handleNextButton();
    } else {
        // If finished, reset back to the selection screen
        quizContainer.classList.add("hide");
        quizSelectionScreen.classList.remove("hide");
        nextButton.textContent = "Next Question"; // Reset button text
        quizTitleElement.textContent = "Select a Quiz";
        scoreValueElement.textContent = 0;
    }
});

// 4. Initialize the Quiz Selection when the page loads
setupQuizSelection();