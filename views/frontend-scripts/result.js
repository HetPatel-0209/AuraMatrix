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
    if (level == 69) return 'Infinite Aura';
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
function createTraitCircle(trait, value, index, color) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "g");
    circle.setAttribute("transform", `translate(0, ${index * 140})`);

    // Create circle
    const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleElement.setAttribute("cx", "60");
    circleElement.setAttribute("cy", "60");
    circleElement.setAttribute("r", "60");
    circleElement.setAttribute("fill", color);
    // Create value text
    const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    valueText.setAttribute("x", "60");
    valueText.setAttribute("y", "65");
    valueText.setAttribute("text-anchor", "middle");
    valueText.setAttribute("font-size", "48");
    valueText.setAttribute("fill", "white");
    valueText.setAttribute("font-weight", "bold");
    valueText.textContent = Math.round(value);

    // Create trait name text
    const traitText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    traitText.setAttribute("x", "60");
    traitText.setAttribute("y", "87");
    traitText.setAttribute("text-anchor", "middle");
    traitText.setAttribute("font-size", "16");
    traitText.setAttribute("font-weight", "500");
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

    // Calculate aura level and description
    const auraLevel = calculateAuraLevel(prediction.traits);
    const auraDescription = getAuraDescription(auraLevel);

    // Aura Card Style Configurations
    const auraStyles = {
        'Emerging Aura': {
            decorativeCircle: '#000000',
            userName: '#000000',
            userType: '#000000',
            background: '#f1f1f1',
            traitCircles: '#000000',
            auraPercentage: '#ffffff',
            auraDescription: '#ffffff',
            traitValues: '#ffffff',
            brand: '#000000'
        },
        'Developing Aura': {
            decorativeCircle: '#6d6d6d',
            userName: '#000000',
            userType: '#000000',
            background: '#f1f1f1',
            traitCircles: '#6d6d6d',
            auraPercentage: '#ffffff',
            auraDescription: '#ffffff',
            traitValues: '#ffffff',
            brand: '#000000'
        },
        'Balanced Aura': {
            decorativeCircle: '#ffcf20',
            userName: '#584A05',
            userType: '#584A05',
            background: '#fffcee',
            traitCircles: '#ffcf20',
            auraPercentage: '#ffffff',
            auraDescription: '#ffffff',
            traitValues: '#ffffff',
            brand: '#584A05'
        },
        'Infinite Aura': {
            decorativeCircle: 'url(#infinite-aura-gradient)',
            userName: '#480405',
            userType: '#480405',
            background: '#FFE2E2',
            traitCircles: '#480405',
            auraPercentage: '#ffffff',
            auraDescription: '#ffffff',
            traitValues: '#ffffff',
            brand: '#480405'
        },
        'Strong Aura': {
            decorativeCircle: '#0CC0DF',
            userName: '#052858',
            userType: '#052858',
            background: '#EEFBFF',
            traitCircles: '#0CC0DF',
            auraPercentage: '#ffffff',
            auraDescription: '#ffffff',
            traitValues: '#ffffff',
            brand: '#052858'
        },
        'Exceptional Aura': {
            decorativeCircle: '#6E1867',
            userName: '#450558',
            userType: '#450558',
            background: '#FCEEFF',
            traitCircles: '#6E1867',
            auraPercentage: '#ffffff',
            auraDescription: '#ffffff',
            traitValues: '#ffffff',
            brand: '#450558'
        },
        'Legendry Aura': {
            decorativeCircle: 'url(#legendry-aura-gradient)',
            userName: '#5E1A7B',
            userType: '#5E1A7B',
            background: '#FFEEFD',
            traitCircles: '#5E1A7B',
            auraPercentage: '#ffffff',
            auraDescription: '#ffffff',
            traitValues: '#ffffff',
            brand: '#5E1A7B'
        }
    };

    const currentStyle = auraStyles[auraDescription] || auraStyles['Developing Aura'];

    // Additional gradient definitions to be added to SVG defs
    const additionalDefs = `
    <linearGradient id="legendry-aura-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#DF0C8B"/>
        <stop offset="100%" stop-color="#570779"/>
    </linearGradient>
    <radialGradient id="infinite-aura-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color="#DF0C10"/>
        <stop offset="100%" stop-color="#280D07"/>
    </radialGradient>
    `;

    // Add additional defs to the SVG if not already present
    const defsElement = svg.querySelector('defs');
    if (defsElement) {
        defsElement.innerHTML += additionalDefs;
    }

    // Get style for current aura description


    // Apply styles
    const decorativeCircle = svg.querySelector('path[fill^="url"]');
    if (decorativeCircle) {
        decorativeCircle.setAttribute('fill', currentStyle.decorativeCircle);
    }

    const backgroundRect = svg.querySelector('rect');
    if (backgroundRect) {
        backgroundRect.setAttribute('fill', currentStyle.background);
    }

    document.querySelector('#userName').setAttribute('fill', currentStyle.userName);
    document.querySelector('#userType').setAttribute('fill', currentStyle.userType);
    document.querySelector('#auraPercentage').setAttribute('fill', currentStyle.auraPercentage);
    document.querySelector('#auraDescription').setAttribute('fill', currentStyle.auraDescription);
    document.querySelector('.brand').setAttribute('fill', currentStyle.brand);

    // Clear existing trait circles
    const traitCirclesGroup = document.querySelector('#traitCircles');
    traitCirclesGroup.innerHTML = '';

    // Update trait circles color
    const traitCircles = svg.querySelectorAll('#traitCircles circle');
    traitCircles.forEach(circle => {
        circle.setAttribute('fill', currentStyle.traitCircles);
    });

    // Update trait texts color
    const traitTexts = svg.querySelectorAll('#traitCircles text');
    traitTexts.forEach(text => {
        text.setAttribute('fill', currentStyle.traitValues);
    });

    // Add new trait circles
    Object.entries(prediction.traits).forEach(([trait, value], index) => {
        const circle = createTraitCircle(trait, value, index, currentStyle.traitCircles);
        traitCirclesGroup.appendChild(circle);
    });

    // Update aura level
    document.querySelector('#auraPercentage').textContent = `${auraLevel}%`;
    document.querySelector('#auraDescription').textContent = auraDescription;
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
            backgroundColor: "#ffffff",
            logging: false,
            borderRadius: 20,
            useCORS: true,
            onclone: (clonedDoc) => {
                // Force font-family on cloned elements
                const nameText = clonedDoc.querySelector('.force-poppins');
                if (nameText) nameText.style.fontFamily = "'Bricolage Grotesque', sans-serif";

                const regularTexts = clonedDoc.querySelectorAll('.force-poppins');
                regularTexts.forEach(text => text.style.fontFamily = "'Poppins', sans-serif");

                const cardElement = clonedDoc.querySelector('.aura-card');
                if (cardElement) {
                    cardElement.style.border = '8px solid #fff';
                    cardElement.style.borderRadius = '20px';
                    cardElement.style.boxSizing = 'border-box';
                }
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

        const gender = localStorage.getItem('userGender') || 'neutral';

        const response = await fetch(`${baseUrl}/api/generate-stickers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalityType,
                gender
            }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Directly use base64 from artifacts
        if (data.artifacts && data.artifacts.length > 0) {
            // Update sticker cards with generated images
            data.artifacts.forEach((artifact, index) => {
                if (index < stickerCards.length) {
                    const imageUrl = `data:image/png;base64,${artifact.base64}`;
                    displaySticker(stickerCards[index], imageUrl, index);
                    stickerCards[index].querySelector('.sticker-loader').style.display = 'none';
                    stickerCards[index].style.display = 'block';
                }
            });

            // Hide any extra sticker cards if fewer than 4 are generated
            for (let i = data.artifacts.length; i < stickerCards.length; i++) {
                stickerCards[i].style.display = 'none';
            }
        } else {
            throw new Error('No artifacts found in response');
        }

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

        // Create download link
        const link = document.createElement('a');
        link.href = url;
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
    if (!matrixBody) {
        console.error('Matrix table body not found');
        return;
    }

    // Clear existing content
    matrixBody.innerHTML = '';

    // Validate inputs
    if (!Array.isArray(answers) || !matrixData) {
        console.error('Invalid answers or matrix data');
        return;
    }

    try {
        // Create table rows for each answer
        answers.forEach((answer, index) => {
            const row = document.createElement('tr');

            // Answer cell
            const answerCell = document.createElement('td');
            answerCell.textContent = answer || '';
            answerCell.className = 'answer-cell';
            // Trait cells
            const cellIndices = [1, 2, 3, 4].map(n => `cell${index * 4 + n}`);
            const cells = cellIndices.map(cellIndex => {
                const cell = document.createElement('td');
                const cellValue = matrixData[cellIndex];

                if (cellValue) {
                    if (cellValue == 'None') {
                        cell.innerHTML = 'None';
                    }
                    // Add visual emphasis for high traits
                    cell.innerHTML = cellValue.replace(
                        /(High\s+[EINSTFJP])\s*\((.*?)\)/g,
                        '<strong>$1</strong> ($2)'
                    );
                    // Add class for styling
                    cell.className = cellValue.includes('High') ? 'high-trait' : 'normal-trait';
                } else {
                    cell.textContent = '';
                    cell.className = 'empty-trait';
                }

                return cell;
            });

            // Append all cells
            row.appendChild(answerCell);
            cells.forEach(cell => row.appendChild(cell));
            matrixBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error updating personality matrix:', error);
        // Add error message to the table
        const errorRow = document.createElement('tr');
        const errorCell = document.createElement('td');
        errorCell.colSpan = 5;
        errorCell.textContent = 'Error loading personality matrix data';
        errorCell.className = 'error-message';
        errorRow.appendChild(errorCell);
        matrixBody.appendChild(errorRow);
    }
}

// Add this to your displayResult function
async function loadMatrixData(prediction, userAnswers) {
    try {
        const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000'
            : 'https://auramatrix.onrender.com';

        const response = await fetch(`${baseUrl}/extra-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answers: userAnswers,
                personalityType: prediction.personalityType
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.prediction?.values) {
            await updatePersonalityMatrix(userAnswers, data.prediction.values);
        } else {
            throw new Error('Invalid matrix data received');
        }
    } catch (error) {
        console.error('Error loading personality matrix:', error);
        const matrixBody = document.querySelector('#personalityMatrix tbody');
        if (matrixBody) {
            matrixBody.innerHTML = '<tr><td colspan="5" class="error-message">Failed to load personality matrix. Please try again later.</td></tr>';
        }
    }
}

function displayPersonalityDescription(data) {
    const descriptionDiv = document.getElementById('personalityDescription');
    const examplesList = document.getElementById('examplesList');

    if (!descriptionDiv || !examplesList) {
        console.error('Could not find description elements');
        return;
    }

    // Clear existing content
    descriptionDiv.innerHTML = '';
    examplesList.innerHTML = '';

    if (data?.description) {
        descriptionDiv.textContent = data.description;
    } else {
        descriptionDiv.textContent = 'Description not available';
    }

    if (data?.examples && Array.isArray(data.examples)) {
        examplesList.innerHTML = data.examples
            .map(example => `<li>${example}</li>`)
            .join('');
    } else {
        examplesList.innerHTML = '<li>No famous examples available</li>';
    }
}

async function displayResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const predictionStr = urlParams.get('prediction');
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '[]');
    const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://auramatrix.onrender.com';

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
            if (userAnswers.length > 0) {
                await loadMatrixData(prediction, userAnswers);
            }
            try {
                const descResponse = await fetch(`${baseUrl}/description`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        personalityType: prediction.personalityType
                    })
                });

                if (!descResponse.ok) {
                    throw new Error(`HTTP error! status: ${descResponse.status}`);
                }
                const descData = await descResponse.json();
                console.log('Description data received:', descData);

                if (descData.prediction) {
                    displayPersonalityDescription(descData.prediction);
                } else {
                    console.warn('Unexpected response structure:', descData);
                    displayPersonalityDescription({});
                }
            } catch (error) {
                console.error('Error loading personality description:', error);
                displayPersonalityDescription({
                    description: 'Could not load personality description',
                    examples: []
                });
            }

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
    await oldDisplayResult();
    const urlParams = new URLSearchParams(window.location.search);
    const predictionStr = urlParams.get('prediction');
    if (predictionStr) {
        try {
            const prediction = JSON.parse(decodeURIComponent(predictionStr));
            updateSVGCard(prediction);
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