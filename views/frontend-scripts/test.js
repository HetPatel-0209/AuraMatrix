let currentQuestion = 0;
let totalQuestions = 0;
const questions = [
    {
        id: 0,
        question: "How do you feel about trying new and unconventional activities?",
        options: [
            { value: "A", text: "I'm always excited to try new things and embrace challenges." },
            { value: "B", text: "I'm open to trying new activities, but I like to plan ahead." },
            { value: "C", text: "I prefer to stick to familiar activities but might try something new occasionally." },
            { value: "D", text: "I'm hesitant about unconventional activities but might consider them with encouragement." },
        ],
    },
    {
        id: 1,
        question: "When you're in a group, how do you usually behave?",
        options: [
            { value: "A", text: "I take the lead and guide the group when necessary." },
            { value: "B", text: "I contribute ideas and participate actively." },
            { value: "C", text: "I listen more than I speak and offer help when needed." },
            { value: "D", text: "I prefer to stay in the background and observe." },
        ],
    },
    {
        id: 2,
        question: "How do you handle criticism?",
        options: [
            { value: "A", text: "I welcome criticism as a way to grow and improve." },
            { value: "B", text: "I try to reflect on it and make changes if needed." },
            { value: "C", text: "I initially feel defensive but think about it later." },
            { value: "D", text: "I find it hard to handle and prefer positive feedback." },
        ],
    },
    {
        id: 3,
        question: "How do you approach planning for the future?",
        options: [
            { value: "A", text: "I set long-term goals and create detailed plans." },
            { value: "B", text: "I make flexible plans and adjust as I go." },
            { value: "C", text: "I focus on short-term goals and take things step by step." },
            { value: "D", text: "I prefer not to plan too far ahead and live in the moment." },
        ],
    },
    {
        id: 4,
        question: "How do you feel about helping others?",
        options: [
            { value: "A", text: "I enjoy helping others whenever I can." },
            { value: "B", text: "I help when I'm asked or see a clear need." },
            { value: "C", text: "I help if it doesn't interfere with my priorities." },
            { value: "D", text: "I'm not always comfortable helping unless I feel confident." },
        ],
    },
    {
        id: 5,
        question: "How do you react when faced with a challenging problem?",
        options: [
            { value: "A", text: "I enjoy tackling challenges and finding solutions." },
            { value: "B", text: "I approach it logically and seek help if needed." },
            { value: "C", text: "I feel stressed but try to work through it." },
            { value: "D", text: "I avoid it until I have no choice but to handle it." },
        ],
    },
    {
        id: 6,
        question: "How do you feel about expressing your opinions in a group?",
        options: [
            { value: "A", text: "I confidently express my thoughts and ideas." },
            { value: "B", text: "I share my opinions when asked or necessary." },
            { value: "C", text: "I only speak up if I feel strongly about the topic." },
            { value: "D", text: "I prefer to keep my opinions to myself." },
        ],
    },
    {
        id: 7,
        question: "How do you handle deadlines?",
        options: [
            { value: "A", text: "I complete my tasks well ahead of deadlines." },
            { value: "B", text: "I prioritize and meet deadlines efficiently." },
            { value: "C", text: "I sometimes procrastinate but still make the deadline." },
            { value: "D", text: "I struggle to meet deadlines but try my best." },
        ],
    },
    {
        id: 8,
        question: "How do you feel about people who are very different from you?",
        options: [
            { value: "A", text: "I'm curious and enjoy learning from them." },
            { value: "B", text: "I respect their differences but find it hard to connect sometimes." },
            { value: "C", text: "I feel neutral and let interactions unfold naturally." },
            { value: "D", text: "I find it challenging to understand their perspective." },
        ],
    },
    {
        id: 9,
        question: "How do you feel about taking risks?",
        options: [
            { value: "A", text: "I'm enthusiastic about taking calculated risks." },
            { value: "B", text: "I take risks after considering all possible outcomes." },
            { value: "C", text: "I take small risks but avoid major ones." },
            { value: "D", text: "I prefer to avoid risks altogether." },
        ],
    },
];

totalQuestions = questions.length;

function renderQuestion(questionNumber) {
    const questionContainer = document.getElementById("questionContainer");
    const question = questions[questionNumber];

    const questionHTML = `
        <div class="brutalist-container ${questionNumber === currentQuestion ? "active" : ""}" data-question="${questionNumber}">
            <div class="dynamic-input-container">
                <input type="text" 
                       name="answer${questionNumber}" 
                       class="brutalist-input smooth-type dynamic-input" 
                       placeholder="Select or type your answer" 
                       autocomplete="off" 
                       required />
                <div class="dropdown-options">
                    ${question.options.map((option) => `
                        <div class="option" data-value="${option.value}">${option.text}</div>
                    `).join("")}
                </div>
            </div>
            <label class="brutalist-label">${question.question}</label>
        </div>
    `;

    questionContainer.innerHTML = questionHTML;
    setupDynamicInputs();
}

function showQuestion(questionNumber) {
    document.querySelectorAll(".brutalist-container").forEach((container) => {
        container.classList.remove("active");
    });

    const currentContainer = document.querySelector(`[data-question="${questionNumber}"]`);
    if (currentContainer) {
        currentContainer.classList.add("active");
    }

    document.getElementById("prevBtn").disabled = questionNumber === 0;
    document.getElementById("nextBtn").style.display = questionNumber === totalQuestions - 1 ? "none" : "inline-block";
    document.getElementById("submitBtn").style.display = questionNumber === totalQuestions - 1 ? "inline-block" : "none";

    const currentInput = currentContainer.querySelector(".dynamic-input");
    if (currentInput) {
        currentInput.focus();
    }
}

function nextQuestion() {
    const currentInput = document.querySelector(`[data-question="${currentQuestion}"] .dynamic-input`);
    if (currentInput && currentInput.value.trim() === "") {
        alert("Please answer the current question before proceeding.");
        return;
    }
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        renderQuestion(currentQuestion);
        showQuestion(currentQuestion);
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion(currentQuestion);
        showQuestion(currentQuestion);
    }
}

function setupDynamicInputs() {
    const dynamicInputs = document.querySelectorAll(".dynamic-input");

    dynamicInputs.forEach((input) => {
        const container = input.closest(".dynamic-input-container");
        const dropdownOptions = container.querySelector(".dropdown-options");

        input.addEventListener("click", () => {
            dropdownOptions.classList.add("show");
        });

        input.addEventListener("focus", () => {
            dropdownOptions.classList.add("show");
        });

        input.addEventListener("blur", (e) => {
            setTimeout(() => {
                if (!container.contains(document.activeElement)) {
                    dropdownOptions.classList.remove("show");
                }
            }, 200);
        });

        input.addEventListener("input", () => {
            const value = input.value.toLowerCase().trim();
            const options = dropdownOptions.querySelectorAll(".option");
            let hasVisibleOptions = false;

            options.forEach((option) => {
                const text = option.textContent.toLowerCase();
                if (text.includes(value)) {
                    option.style.display = "block";
                    hasVisibleOptions = true;
                } else {
                    option.style.display = "none";
                }
            });

            if (hasVisibleOptions) {
                dropdownOptions.classList.add("show");
            } else {
                dropdownOptions.classList.remove("show");
            }
        });

        const options = dropdownOptions.querySelectorAll(".option");
        options.forEach((option) => {
            option.addEventListener("click", () => {
                input.value = option.textContent;
                input.focus();
                dropdownOptions.classList.remove("show");
            });
        });

        input.addEventListener("keydown", (e) => {
            const options = Array.from(dropdownOptions.querySelectorAll(".option:not([style*='display: none'])"));
            if (!options.length) return;

            let currentIndex = options.findIndex(opt => opt.classList.contains("highlighted"));

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    if (currentIndex < options.length - 1) {
                        options[currentIndex]?.classList.remove("highlighted");
                        options[currentIndex + 1].classList.add("highlighted");
                        options[currentIndex + 1].scrollIntoView({ block: "nearest" });
                    }
                    break;

                case "ArrowUp":
                    e.preventDefault();
                    if (currentIndex > 0) {
                        options[currentIndex]?.classList.remove("highlighted");
                        options[currentIndex - 1].classList.add("highlighted");
                        options[currentIndex - 1].scrollIntoView({ block: "nearest" });
                    }
                    break;

                case "Enter":
                    e.preventDefault();
                    if (currentIndex >= 0) {
                        options[currentIndex].click();
                    }
                    break;
            }
        });
    });
}

async function handleSubmit(event) {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Processing...";
    submitButton.disabled = true;

    const form = event.target;
    const formData = new FormData(form);
    const answers = [];

    for (let i = 0; i < totalQuestions; i++) {
        answers.push(formData.get(`answer${i}`));
    }

    localStorage.setItem("userAnswers", JSON.stringify(answers));

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 40000);

        const response = await fetch("https://auramatrix.onrender.com/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answers }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        if (result.prediction) {
            sessionStorage.setItem("lastAnswers", JSON.stringify(answers));
            window.location.href = `./result.html?prediction=${encodeURIComponent(JSON.stringify(result.prediction))}`;
        } else {
            throw new Error("Invalid prediction format received from server");
        }
    } catch (error) {
        console.error("Error details:", error);
        let errorMessage = "There was a problem submitting your answers. ";

        if (error.name === "AbortError") {
            errorMessage += "The request timed out. Please try again.";
        } else if (error.message.includes("Failed to fetch")) {
            errorMessage += "Could not connect to the server. Please make sure the server is running.";
        } else {
            errorMessage += error.message;
        }

        alert(errorMessage);
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

// Initialize the form
renderQuestion(currentQuestion);
showQuestion(currentQuestion);