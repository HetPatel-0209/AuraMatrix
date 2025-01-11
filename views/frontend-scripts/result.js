function formatTraitValue(value) {
    return typeof value === 'number' && !isNaN(value) ? `${Math.round(value)}%` : '0%';
}

function getTraitDescription(name, value) {
    const opposites = {
        'EXTRAVERSION': ['Introverted', 'Extraverted'],
        'INTUITION': ['Sensing', 'Intuitive'],
        'THINKING': ['Feeling', 'Thinking'],
        'JUDGING': ['Perceiving', 'Judging']
    };

    const pair = opposites[name.toUpperCase()];
    if (!pair) return '';
    return value < 50 ? pair[0] : pair[1];
}

function createTraitElement(trait, value) {
    const traitElement = document.createElement('div');
    traitElement.className = 'trait';
    traitElement.innerHTML = `
        <div class="trait-name">${trait}</div>
        <div class="trait-bar">
            <div class="trait-bar-fill" style="width: 0%"></div>
        </div>
        <div class="trait-value">${formatTraitValue(value)}</div>
        <div class="trait-description">${getTraitDescription(trait, value)}</div>
    `;
    return traitElement;
}

function animateTraitBars() {
    const bars = document.querySelectorAll('.trait-bar');
    bars.forEach((bar, index) => {
        const fill = bar.querySelector('.trait-bar-fill');
        const targetWidth = parseInt(bar.dataset.value);
        
        // Reset initial state
        fill.style.width = '0%';
        
        // Stagger the animations slightly for visual effect
        setTimeout(() => {
            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                fill.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
                fill.style.width = `${targetWidth}%`;
            });
        }, index * 150); // Stagger each bar by 150ms
    });
}

function updateTraitsDisplay(prediction) {
    const traitsContainer = document.querySelector('.traits-container');
    traitsContainer.innerHTML = ''; // Clear existing traits

    Object.entries(prediction.traits).forEach(([trait, value]) => {
        const traitElement = createTraitElement(trait, value);
        traitsContainer.appendChild(traitElement);
    });

    setTimeout(animateTraitBars, 100);
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