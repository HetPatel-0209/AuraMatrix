function formatTraitValue(value) {
    return typeof value === 'number' && !isNaN(value) ? `${Math.round(value)}%` : '0%';
}

function calculateAuraScore(traits) {
    const values = Object.values(traits);
    return Math.round(values.reduce((acc, val) => acc + val, 0) / values.length);
}

function getAuraDescription(score) {
    if (score >= 90) return "Legendary";
    if (score >= 80) return "Exceptional";
    if (score >= 70) return "Strong";
    if (score >= 60) return "Balanced";
    if (score >= 50) return "Developing";
    return "Emerging";
}

function getTraitDescription(name, value) {
    const opposites = {
        'EXTRAVERSION': ['Introverted', 'Extraverted'],
        'INTUITION': ['Sensing', 'Intuitive'],
        'THINKING': ['Feeling', 'Thinking'],
        'JUDGING': ['Perceiving', 'Judging'],
        'FEELING': ['Thinking', 'Feeling']
    };

    const pair = opposites[name.toUpperCase()];
    if (!pair) return '';
    return value < 50 ? pair[0] : pair[1];
}

function createAuraMeter(traits) {
    const auraScore = calculateAuraScore(traits);
    const auraElement = document.createElement('div');
    auraElement.className = 'aura-meter';
    
    auraElement.innerHTML = `
        <h3 class="aura-title">Your Aura Score</h3>
        <div class="aura-circle">
            <div class="aura-value">${auraScore}%</div>
            <div class="aura-description">${getAuraDescription(auraScore)}</div>
        </div>
        <div class="aura-bar">
            <div class="aura-bar-fill" data-target="${auraScore}" style="width: 0%"></div>
        </div>
    `;
    return auraElement;
}

function animateTraitBars() {
    const fills = document.querySelectorAll('.trait-bar-fill');
    fills.forEach((fill, index) => {
        const targetWidth = parseInt(fill.getAttribute('data-target'));
    
        fill.getBoundingClientRect();
        
        setTimeout(() => {
            fill.style.width = `${targetWidth}%`;
        }, index * 200);
    });
}

function updateAuraMeter(traits) {
    const auraScore = calculateAuraScore(traits);
    const auraValue = document.querySelector('.aura-value');
    const auraDescription = document.querySelector('.aura-description');
    const auraBarFill = document.querySelector('.aura-bar-fill');

    // Update values
    auraValue.textContent = `${auraScore}%`;
    auraDescription.textContent = getAuraDescription(auraScore);
    
    // Animate the bar
    setTimeout(() => {
        auraBarFill.style.width = `${auraScore}%`;
    }, 100);
}

function updateTraitsDisplay(prediction) {
    const traitsContainer = document.querySelector('.traits-container');
    traitsContainer.innerHTML = '';

    Object.entries(prediction.traits).forEach(([trait, value]) => {
        const traitElement = createTraitElement(trait, value);
        traitsContainer.appendChild(traitElement);
    });

    requestAnimationFrame(() => {
        animateTraitBars();
    });
}

function displayResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const predictionStr = urlParams.get('prediction');
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';

    if (firstName || lastName) {
        document.getElementById('user-name').textContent = `${firstName} ${lastName}`;
    }

    if (predictionStr) {
        try {
            const prediction = JSON.parse(decodeURIComponent(predictionStr));

            document.getElementById('personality-type').textContent = 
                `Your personality type is: ${prediction.personalityType}`;

            if (prediction.traits) {
                updateTraitsDisplay(prediction);
            }

            document.getElementById('description').textContent =
                "This personality assessment is based on your responses to our questionnaire. " +
                "Remember that personality is complex and multifaceted, and this is just one perspective on your unique characteristics.";

        } catch (error) {
            console.error('Error parsing prediction:', error);
            document.getElementById('personality-type').textContent = "Error displaying results";
            document.getElementById('description').textContent = "Please try taking the test again.";
            document.querySelector('.traits-container').innerHTML = '';
        }
    } else {
        document.getElementById('personality-type').textContent = "No prediction available";
        document.getElementById('description').textContent = "Please try taking the test again.";
    }
}

document.addEventListener('DOMContentLoaded', displayResult);