let currentQuestion = 0;
let totalQuestions = 0;
let userAnswers = new Array(10).fill('');
gujQue = [
    "તમે નવા અને અસામાન્ય કાર્યો કરવા અંગે શુ અનુભવો છો ?",
    "જૂથમાં તમે કેવી રીતે વર્તો છો ?",
    "તમે ટીકાને કેવી રીતે હેન્ડલ કરો છો ?",
    "તમે ભવિષ્ય માટેની યોજના કેવી રીતે બનાવો છો ?",
    "તમે અન્ય લોકોને મદદ કરવા વિશે કેવી રીતે અનુભવો છો ?",
    "મુશ્કેલ ઘટના નો સામનો કરતી વખતે તમે શુ અનુભવો છો ?",
    "જૂથમાં તમારી વાત પ્રસ્તુત કરવાની વાત હોય ત્યારે તમે કેવી રીતે અનુભવો છો ?",
    "તમે સમયમર્યાદાઓ કેવી રીતે હેન્ડલ કરો છો ?",
    "એવા લોકો વિશે તમે કેવી રીતે અનુભવ કરો છો જે તમારા કરતાં ખુબ જુદા છે ?",
    "ખતરા લેવા અંગે તમારું શું મંતવ્ય છે ? "
]

hinQue = [
    "आप नए और असामान्य कार्य करने के बारे में कैसा महसूस करते हैं?",
    "जब आप किसी समूह में होते हैं, तो आप आमतौर पर कैसे व्यवहार करते हैं?",
    "आप आलोचना को कैसे संभालते हैं?",
    "भविष्य की योजना बनाते समय आप क्या दृष्टिकोण अपनाते हैं?",
    "दूसरों की मदद करने के बारे में आप कैसा महसूस करते हैं?",
    "जब आपको किसी चुनौतीपूर्ण समस्या का सामना करना पड़ता है, तो आप कैसे प्रतिक्रिया देते हैं?",
    "समूह में अपनी राय व्यक्त करने के बारे में आप कैसा महसूस करते हैं?",
    "आप समय-सीमाओं को कैसे संभालते हैं?",
    "जो लोग आपसे बहुत अलग हैं, उनके बारे में आप कैसा महसूस करते हैं?",
    "जोखिम लेने के बारे में आपका क्या दृष्टिकोण है?"
]

hinEnQue = [
    "Aap naye aur asamaanya activities try karne ke baare mein kaisa feel karte ho?",
    "Jab aap group mein hote ho, to aap kaise behave karte ho?",
    "Aap criticism kaise handle karte ho?",
    "Future planning ke liye aap kaise approach karte ho?",
    "Dusron ki madad karne ke baare mein aap kaisa feel karte ho?",
    "Jab aapko ek challenging problem ka samna karna padta hai, to aap kaise react karte ho?",
    "Group mein apne opinions express karne ke baare mein aap kaisa feel karte ho?",
    "Aap deadlines ko kaise handle karte ho?",
    "Jo log aapse bohot alag hote hain, unke baare mein aap kaisa feel karte ho?",
    "Risks lene ke baare mein aapka kya soch hai?"
]
const questions = [
    {
        id: 0,
        question: "How do you feel about trying new and unconventional activities?",
        helpText: `<br><strong>Gujrati : </strong>${gujQue[0]}<br><br><strong>Hindi : </strong>${hinQue[0]}<br><br><strong>Hinglish : </strong>${hinEnQue[0]}<br><br>`,
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
        helpText: "Reflect on your typical behavior in group settings, such as meetings, social gatherings, or team projects. Consider your natural tendencies in these situations.",
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
        helpText: "Think about past situations where you received feedback or criticism. Consider your initial reaction and how you processed the feedback afterward.",
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
        helpText: "Consider how you typically organize your life goals and make decisions about your future. Think about both short-term and long-term planning.",
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
        helpText: "Think about situations where you've had the opportunity to help others. Consider your natural inclination to offer assistance and how you feel when helping.",
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
        helpText: "Reflect on past situations where you encountered difficult problems. Think about your typical approach to solving complex challenges.",
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
        helpText: "Think about situations where you've had the opportunity to share your thoughts in group settings. Consider your comfort level with speaking up.",
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
        helpText: "Consider your typical approach to managing tasks with deadlines. Think about how you organize your time and prioritize work.",
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
        helpText: "Think about your interactions with people who have different backgrounds, beliefs, or perspectives. Consider your typical reaction to diversity.",
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
        helpText: "Reflect on situations where you've had to make decisions involving uncertainty or potential risks. Consider your typical approach to such situations.",
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
                       value="${userAnswers[questionNumber] || ''}"
                       name="answer${questionNumber}" 
                       class="brutalist-input smooth-type dynamic-input" 
                       placeholder="Select or type your answer (we suggest that you write your own answer)" 
                       autocomplete="on" 
                       required />
                <div class="dropdown-options">
                    ${question.options.map((option) => `
                        <div class="option" data-value="${option.value}">${option.text}</div>
                    `).join("")}
                </div>
            </div>
            <label class="brutalist-label">
                ${question.question}
                <span class="help-icon" onclick="showHelp(${questionNumber})">?</span>
            </label>
        </div>
    `;

    questionContainer.innerHTML = questionHTML;
    setupDynamicInputs();
}

function showHelp(questionNumber) {
    const question = questions[questionNumber];
    const helpDialog = document.createElement('div');
    helpDialog.className = 'help-dialog';
    helpDialog.innerHTML = `
        <div class="help-dialog-content">
            <div class="help-dialog-header">
                <h3 style="font-family: 'Poppins'">Question Translations</h3>
                <button class="close-help" onclick="closeHelp()">×</button>
            </div>
            <div class="help-dialog-body">
                <p>${question.helpText}</p>
            </div>
        </div>
    `;
    document.body.appendChild(helpDialog);

    helpDialog.addEventListener('click', (e) => {
        if (e.target === helpDialog) {
            closeHelp();
        }
    });
}

function closeHelp() {
    const helpDialog = document.querySelector('.help-dialog');
    if (helpDialog) {
        helpDialog.remove();
    }
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
    if (currentInput) {
        userAnswers[currentQuestion] = currentInput.value.trim();
    }
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        renderQuestion(currentQuestion);
        showQuestion(currentQuestion);
    }
}

function previousQuestion() {
    const currentInput = document.querySelector(`[data-question="${currentQuestion}"] .dynamic-input`);
    if (currentInput) {
        userAnswers[currentQuestion] = currentInput.value.trim();
    }
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
        const navigationButtons = document.querySelector(".navigation-buttons");
        let isInputFocused = false;

        const showDropdownAndAdjustButtons = () => {
            if (!isInputFocused) {
                dropdownOptions.classList.add("show");
                navigationButtons.classList.add("buttons-with-dropdown");
            }
        };

        const hideDropdownAndAdjustButtons = () => {
            dropdownOptions.classList.remove("show");
            navigationButtons.classList.remove("buttons-with-dropdown");
        };

        showDropdownAndAdjustButtons();

        input.addEventListener('focus', () => {
            isInputFocused = true;
            hideDropdownAndAdjustButtons();
        });

        input.addEventListener('blur', (e) => {
            isInputFocused = false;
            const relatedTarget = e.relatedTarget;
            if (!relatedTarget || !relatedTarget.classList.contains('option')) {
                setTimeout(() => {
                    if (!isInputFocused) {
                        showDropdownAndAdjustButtons();
                    }
                }, 100);
            }
        });

        input.addEventListener("input", (e) => {
            userAnswers[currentQuestion] = e.target.value.trim();
            if (isInputFocused) {
                hideDropdownAndAdjustButtons();
                return;
            }

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
        });

        const options = dropdownOptions.querySelectorAll(".option");
        options.forEach((option) => {
            option.addEventListener("mousedown", (e) => {
                e.preventDefault();
                input.value = option.textContent;
                userAnswers[currentQuestion] = option.textContent;
                hideDropdownAndAdjustButtons();

                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);
            });

            option.addEventListener("click", () => {
                input.blur();
                setTimeout(() => {
                    if (!isInputFocused) {
                        showDropdownAndAdjustButtons();
                    }
                }, 100);
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
                        input.value = options[currentIndex].textContent;
                        userAnswers[currentQuestion] = options[currentIndex].textContent;
                        hideDropdownAndAdjustButtons();
                        input.blur();
                        setTimeout(() => {
                            if (!isInputFocused) {
                                showDropdownAndAdjustButtons();
                            }
                        }, 100);
                    }
                    break;
            }
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && !isInputFocused) {
                showDropdownAndAdjustButtons();
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

    // Use the stored answers array
    const answers = userAnswers.map(answer => answer.trim());

    if (answers.length !== totalQuestions || answers.some(answer => !answer)) {
        alert("Please answer all questions before submitting.");
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        return;
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

renderQuestion(currentQuestion);
showQuestion(currentQuestion);