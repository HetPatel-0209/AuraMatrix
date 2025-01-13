function formatTraitValue(value) {
    return typeof value === 'number' && !isNaN(value) ? `${Math.round(value)}%` : '0%';
}

function getTraitDescription(name, value) {
    const opposites = {
        'EXTRAVERSION': ['Introverted', 'Extraverted'],
        'INTROVERTED': ['Extraversion', 'Extraverted'],
        'EXTRAVERTED': ['Introverted', 'Extraversion'],
        'INTROVERSION': ['Introverted', 'Timidness'],
        'INTUITION': ['Sensing', 'Intuitive'],
        'SENSING': ['Intuition', 'Intuitive'],
        'INTUITIVE': ['Intuition', 'Sensing'],
        'THINKING': ['Feeling', 'Thinking'],
        'FEELING': ['Thinking', 'Feeling'],
        'JUDGING': ['Perceiving', 'Judging'],
        'PERCEIVING':['Judging', 'Perceiving']
    };

    const pair = opposites[name.toUpperCase()];
    if (!pair) return '';
    return value < 50 ? pair[0] : pair[1];
}

function calculateAuraLevel(traits) {
    const values = Object.values(traits);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    return Math.round(average);
}

function getAuraDescription(level) {
    if (level >= 90) return 'Legendry Aura';
    if (level >= 80) return 'Exceptional Aura';
    if (level >= 70) return 'Strong Aura';
    if (level >= 60) return 'Balanced Aura';
    if (level >= 50) return 'Developing Aura';
    return 'Emerging Aura';
}

function createAuraMeter(traits) {
    const auraLevel = calculateAuraLevel(traits);
    const auraDescription = getAuraDescription(auraLevel);
    
    const auraElement = document.createElement('div');
    auraElement.className = 'aura-meter';
    auraElement.innerHTML = `
      <div class="aura-title">Your Aura Level</div>
        <div class="aura-ring" style="--aura-level: ${auraLevel}">
            <div class="aura-circle">
                <div class="aura-percentage">${auraLevel}%</div>
                <div class="aura-description">${auraDescription}</div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const ring = auraElement.querySelector('.aura-ring');
        if (ring) {
            ring.classList.add('animate');
        }
    }, 100);

    return auraElement;
}

function createTraitElement(trait, value) {
    const traitElement = document.createElement('div');
    traitElement.className = 'trait';
    traitElement.innerHTML = `
        <div class="trait-name">${trait}</div>
        <div class="trait-bar">
            <div class="trait-bar-fill" data-target="${value}"></div>
        </div>
        <div class="trait-value">${formatTraitValue(value)}</div>
        <div class="trait-description">${getTraitDescription(trait, value)}</div>
    `;
    return traitElement;
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

function updateTraitsDisplay(prediction) {
    const traitsContainer = document.querySelector('.traits-grid');
    const auraMeterWrapper = document.querySelector('.aura-meter-wrapper');

    if (!traitsContainer) return;
    
    // Clear existing content
    traitsContainer.innerHTML = '';
    auraMeterWrapper.innerHTML = '';

    // Create a wrapper for the aura meter
    auraMeterWrapper.appendChild(createAuraMeter(prediction.traits));

    // Add traits in a separate wrapper
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

// Aura card
function createTraitCircle(trait, value, index) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "g");
    circle.setAttribute("transform", `translate(0, ${index * 120})`);
    
    // Create circle
    const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleElement.setAttribute("cx", "60");
    circleElement.setAttribute("cy", "60");
    circleElement.setAttribute("r", "50");
    circleElement.setAttribute("fill", "#FFB347");
    
    // Create value text
    const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    valueText.setAttribute("x", "60");
    valueText.setAttribute("y", "55");
    valueText.setAttribute("text-anchor", "middle");
    valueText.setAttribute("font-size", "42");
    valueText.setAttribute("fill", "white");
    valueText.setAttribute("font-weight", "bold");
    valueText.textContent = Math.round(value);
    
    // Create trait name text
    const traitText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    traitText.setAttribute("x", "60");
    traitText.setAttribute("y", "80");
    traitText.setAttribute("text-anchor", "middle");
    traitText.setAttribute("font-size", "16");
    traitText.setAttribute("fill", "white");
    traitText.textContent = trait.toLowerCase();
    traitText.style.textTransform = "capitalize";
    
    circle.appendChild(circleElement);
    circle.appendChild(valueText);
    circle.appendChild(traitText);
    
    return circle;
}

function updateSVGCard(prediction) {
    const svg = document.querySelector('#auraCard svg');
    if (!svg) return;

    // Update name and type
    const firstName = localStorage.getItem('userFirstName') || 'User';
    const lastName = localStorage.getItem('userLastName') || '';
    const fullName = `${firstName} ${lastName}`.trim();
    document.querySelector('#userName').textContent = fullName;
    
    const personalityType = prediction.personalityType;
    const matches = personalityType.match(/([A-Z]{4})\s*$$([^)]+)$$/);
    if (matches) {
        document.querySelector('#userType').textContent = `${matches[1]} (${matches[2]})`;
    } else {
        document.querySelector('#userType').textContent = personalityType;
    }

    // Clear existing trait circles
    const traitCircles = document.querySelector('#traitCircles');
    traitCircles.innerHTML = '';

    // Add new trait circles
    Object.entries(prediction.traits).forEach(([trait, value], index) => {
        const circle = createTraitCircle(trait, value, index);
        traitCircles.appendChild(circle);
    });

    const auraLevel = calculateAuraLevel(prediction.traits);
    const auraPercentage = document.querySelector('.auraPercentage');
    const auraDescription = document.querySelector('.auraDescription');
    
    auraPercentage.textContent = `${auraLevel}%`;
    auraDescription.textContent = getAuraDescription(auraLevel);
}

async function downloadAuraCard() {
    const card = document.getElementById('auraCard');
    
    try {
        // Temporarily make visible for capture
        card.style.position = 'fixed';
        card.style.left = '0';
        card.style.top = '0';
        card.style.visibility = 'visible';
        
        const canvas = await html2canvas(card, {
            scale: 2,
            backgroundColor: '#FFF9F0',
            logging: false,
            useCORS: true,
            allowTaint: true,
            width: 600,
            height: 800,
            borderRadius: 20
        });

        // Hide again
        card.style.position = 'absolute';
        card.style.left = '-9999px';
        card.style.visibility = 'hidden';

        // Download
        const link = document.createElement('a');
        link.download = 'AuraMatrix-Card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error generating card:', error);
        // Ensure card is hidden on error
        card.style.position = 'absolute';
        card.style.left = '-9999px';
        card.style.visibility = 'hidden';
    }
}


const oldDisplayResult = displayResult;
displayResult = function() {
    oldDisplayResult();
    const urlParams = new URLSearchParams(window.location.search);
    const predictionStr = urlParams.get('prediction');
    if (predictionStr) {
        try {
            const prediction = JSON.parse(decodeURIComponent(predictionStr));
            updateSVGCard(prediction);
        } catch (error) {
            console.error('Error creating aura card:', error);
        }
    }
};

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('downloadCard');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadAuraCard);
    }
});

document.addEventListener('DOMContentLoaded', displayResult);