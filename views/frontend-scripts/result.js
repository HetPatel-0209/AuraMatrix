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
        'PERCEIVING': ['Judging', 'Perceiving']
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

// Aura card
function createTraitCircle(trait, value, index) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "g");
    circle.setAttribute("transform", `translate(0, ${index * 140})`);

    // Create circle
    const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleElement.setAttribute("cx", "60");
    circleElement.setAttribute("cy", "60");
    circleElement.setAttribute("r", "60");
    circleElement.setAttribute("fill", "#febd59");
    // Create value text
    const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    valueText.setAttribute("x", "60");
    valueText.setAttribute("y", "55");
    valueText.setAttribute("text-anchor", "middle");
    valueText.setAttribute("font-size", "48");
    valueText.setAttribute("fill", "white");
    valueText.setAttribute("font-weight", "bold");
    valueText.setAttribute("font-family","Poppins");
    valueText.textContent = Math.round(value);

    // Create trait name text
    const traitText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    traitText.setAttribute("x", "60");
    traitText.setAttribute("y", "85");
    traitText.setAttribute("text-anchor", "middle");
    traitText.setAttribute("font-size", "16");
    traitText.setAttribute("fill", "white");
    traitText.setAttribute("font-family","Poppins");
    traitText.textContent = trait;

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
    const fullName = `${firstName}\n ${lastName}`.trim();
    document.querySelector('#userName').textContent = fullName;

    // Update personality type with format: "ENFJ (Protagonist)"
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

    // Update aura level
    const auraLevel = calculateAuraLevel(prediction.traits);
    document.querySelector('#auraPercentage').textContent = `${auraLevel}%`;
    document.querySelector('#auraDescription').textContent = getAuraDescription(auraLevel);
}

async function downloadAuraCard() {
    const card = document.getElementById('auraCard');

    try {
        // Create a hidden container
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.left = '-9999px';
        hiddenContainer.style.top = '-9999px';
        document.body.appendChild(hiddenContainer);
        
        // Clone the card and append to hidden container
        const cardClone = card.cloneNode(true);
        cardClone.style.display = 'block';
        hiddenContainer.appendChild(cardClone);

        const canvas = await html2canvas(cardClone, {
            scale: 2,
            backgroundColor: '#000000',
            logging: false,
            borderRadius: 20
        });
        hiddenContainer.remove();
        // Download the image
        const link = document.createElement('a');
        link.download = 'AuraMatrix-Card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error generating card:', error);
    }
}

async function generateStickers(personalityType) {
    const stickerCards = document.querySelectorAll('.sticker-card');
    try {
        const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000'
            : 'https://auramatrix.onrender.com';

        console.log(`Connecting to sticker generation API at ${baseUrl}/generate-stickers...`);

        for (let i = 0; i < stickerCards.length; i++) {
            const card = stickerCards[i];
            const loader = card.querySelector('.sticker-loader');
            const sticker = card.querySelector('.sticker');

            loader.style.display = 'block';
            sticker.style.backgroundImage = 'none';

            try {
                const response = await fetch(`${baseUrl}/generate-stickers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ personalityType }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body.getReader();
                let stickerUrl = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = new TextDecoder().decode(value);
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = JSON.parse(line.slice(5));
                            if (data.imageUrl) {
                                stickerUrl = data.imageUrl;
                                break;
                            }
                        }
                    }
                    if (stickerUrl) break;
                }

                displaySticker(card, stickerUrl, i);
            } catch (error) {
                console.error(`Error generating sticker ${i + 1}:`, error);
                displayStickerError(card);
            } finally {
                loader.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error in sticker generation process:', error);
    }
}

function displaySticker(card, stickerUrl, index) {
    const sticker = card.querySelector('.sticker');
    const downloadBtn = card.querySelector('.download-sticker-btn');

    sticker.style.backgroundImage = `url(${stickerUrl})`;
    downloadBtn.onclick = () => downloadSticker(stickerUrl, `personality-sticker-${index + 1}.png`);
}

function displayStickerError(card) {
    const sticker = card.querySelector('.sticker');
    sticker.innerHTML = `
        <p>Sorry, we couldn't generate this sticker.</p>
        <p>Please try refreshing the page.</p>
    `;
    sticker.style.display = 'flex';
    sticker.style.flexDirection = 'column';
    sticker.style.justifyContent = 'center';
    sticker.style.alignItems = 'center';
    sticker.style.textAlign = 'center';
    sticker.style.color = '#ff0000';
    sticker.style.fontSize = '14px';
}

function downloadSticker(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
}

function downloadAllStickers(stickers) {
    const stickerCards = document.querySelectorAll('.sticker-card');
    stickerCards.forEach((card, index) => {
        const sticker = card.querySelector('.sticker');
        const backgroundImage = sticker.style.backgroundImage;
        if (backgroundImage) {
            const url = backgroundImage.slice(5, -2); // Remove 'url("' and '")'
            downloadSticker(url, `personality-sticker-${index + 1}.png`);
        }
    });
}

async function displayResult() {
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
            document.getElementById('personality-type').textContent = `Your personality type is: ${prediction.personalityType}`;

            if (prediction.traits) {
                updateTraitsDisplay(prediction);
            }

            document.getElementById('description').textContent =
                "This personality assessment is based on your responses to our questionnaire. " +
                "Remember that personality is complex and multifaceted, and this is just one perspective on your unique characteristics.";
            updateSVGCard(prediction);
            await generateStickers(prediction.personalityType);
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

// Modify your existing displayResult function
const oldDisplayResult = displayResult;
displayResult = async function () {
    oldDisplayResult();
    const urlParams = new URLSearchParams(window.location.search);
    const predictionStr = urlParams.get('prediction');
    if (predictionStr) {
        try {
            const prediction = JSON.parse(decodeURIComponent(predictionStr));
            updateSVGCard(prediction);
            const stickers = await generateStickers(prediction.personalityType);
            if (stickers) {
                displayStickers(stickers);
            }
        } catch (error) {
            console.error('Error creating aura card or stickers:', error);
        }
    }
};

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    displayResult();
    const downloadButton = document.getElementById('downloadCard');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadAuraCard);
    }
    const downloadAllButton = document.querySelector('.download-all-btn');
    if (downloadAllButton) {
        downloadAllButton.addEventListener('click', downloadAllStickers);
    }
});