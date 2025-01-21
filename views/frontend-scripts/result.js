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
    valueText.textContent = Math.round(value);

    // Create trait name text
    const traitText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    traitText.setAttribute("x", "60");
    traitText.setAttribute("y", "85");
    traitText.setAttribute("text-anchor", "middle");
    traitText.setAttribute("font-size", "16");
    traitText.setAttribute("fill", "white");
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
            borderRadius: 20,
            useCORS: true,
            onclone: (clonedDoc) => {
                // Force font-family on cloned elements
                const nameText = clonedDoc.querySelector('.force-poppins');
                if (nameText) nameText.style.fontFamily = "'Bricolage Grotesque', sans-serif";

                const regularTexts = clonedDoc.querySelectorAll('.force-poppins');
                regularTexts.forEach(text => text.style.fontFamily = "'Poppins', sans-serif");
            }
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

        // Show loaders for all cards first
        stickerCards.forEach(card => {
            card.querySelector('.sticker-loader').style.display = 'block';
        });

        // Single API call for all stickers
        const response = await fetch(`${baseUrl}/generate-stickers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ personalityType }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const reader = response.body.getReader();
        let imageUrls = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            lines.forEach(line => {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(5));
                    if (data.imageUrls) imageUrls = data.imageUrls;
                }
            });
        }

        // Update all sticker cards with received URLs
        stickerCards.forEach((card, index) => {
            if (imageUrls[index]) {
                displaySticker(card, imageUrls[index], index);
            } else {
                displayStickerError(card);
            }
            card.querySelector('.sticker-loader').style.display = 'none';
        });

    } catch (error) {
        console.error('Error generating stickers:', error);
        stickerCards.forEach(card => {
            displayStickerError(card);
            card.querySelector('.sticker-loader').style.display = 'none';
        });
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

async function convertWebPToPNG(webpUrl) {
    try {
        // Create a new image element
        const img = new Image();
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Create a promise to handle image loading
        const imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.crossOrigin = 'anonymous'; // Enable CORS
            img.src = webpUrl;
        });

        // Wait for image to load
        const loadedImg = await imageLoadPromise;

        // Set canvas dimensions to match image
        canvas.width = loadedImg.width;
        canvas.height = loadedImg.height;

        // Draw image onto canvas
        ctx.drawImage(loadedImg, 0, 0);

        // Convert canvas content to PNG
        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error('Error converting WebP to PNG:', error);
        throw error;
    }
}

async function downloadSticker(url, filename) {
    try {
        if (!filename.endsWith('.png')) filename += '.png';

        // Convert WebP to PNG
        const pngDataUrl = await convertWebPToPNG(url);

        // Create download link
        const link = document.createElement('a');
        link.href = pngDataUrl;
        link.download = filename;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading sticker:', error);
        alert('Failed to download sticker. Please try again.');
    }
}

async function downloadAllStickers() {
    const stickerCards = document.querySelectorAll('.sticker-card');
    for (let i = 0; i < stickerCards.length; i++) {
        const card = stickerCards[i];
        const sticker = card.querySelector('.sticker');
        const backgroundImage = sticker.style.backgroundImage;

        if (backgroundImage) {
            try {
                const url = backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                const filename = `personality-sticker-${i + 1}.png`;

                // Add slight delay between downloads to prevent overwhelming the browser
                await new Promise(resolve => setTimeout(resolve, 500));
                await downloadSticker(url, filename);
            } catch (error) {
                console.error(`Error downloading sticker ${i + 1}:`, error);
            }
        }
    }
}

async function updatePersonalityMatrix(answers, matrixData) {
    const matrixBody = document.querySelector('#personalityMatrix tbody');
    if (!matrixBody) return;

    matrixBody.innerHTML = '';

    // Create table rows for each answer
    answers.forEach((answer, index) => {
        const row = document.createElement('tr');

        // Answer cell
        const answerCell = document.createElement('td');
        answerCell.textContent = answer;

        // Trait cells
        const cells = [
            matrixData[`cell${index * 4 + 1}`],
            matrixData[`cell${index * 4 + 2}`],
            matrixData[`cell${index * 4 + 3}`],
            matrixData[`cell${index * 4 + 4}`]
        ];

        row.appendChild(answerCell);

        cells.forEach(cellValue => {
            const cell = document.createElement('td');
            cell.textContent = cellValue || '-';
            cell.innerHTML = cellValue.replace(/High/g, '<strong>High</strong>');
            row.appendChild(cell);
        });

        matrixBody.appendChild(row);
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

    if (userAnswers.length > 0) {
        const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '[]');

        try {
            const response = await fetch('/extra-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers: userAnswers,
                    personalityType: prediction.personalityType
                })
            });
            const data = await response.json();
            if (data.prediction?.values) {
                await updatePersonalityMatrix(userAnswers, data.prediction.values);
            }
        } catch (error) {
            console.error('Error loading personality matrix:', error);
        }
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