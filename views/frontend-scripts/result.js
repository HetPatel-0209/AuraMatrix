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
    valueText.setAttribute("font-weight", "700");
    valueText.setAttribute("font-family", "Poppins");
    valueText.textContent = Math.round(value);

    // Create trait name text
    const traitText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    traitText.setAttribute("x", "60");
    traitText.setAttribute("y", "87");
    traitText.setAttribute("text-anchor", "middle");
    traitText.setAttribute("font-size", "16");
    traitText.setAttribute("font-weight", "700");
    traitText.setAttribute("fill", "white");
    traitText.setAttribute("font-family", "Poppins");
    traitText.textContent = trait;

    circle.appendChild(circleElement);
    circle.appendChild(valueText);
    circle.appendChild(traitText);

    return circle;
}

let fontCache = {
    bricolage: null,
    poppins: null,
    poppins1: null
};

async function loadAndCacheFonts() {
    try {
        const [bricolageBlob, poppinsBlob] = await Promise.all([
            fontLoader.bricolage,
            fontLoader.poppins
        ]);

        fontCache.bricolage = await blobToBase64(bricolageBlob);
        fontCache.poppins = await blobToBase64(poppinsBlob);
    } catch (error) {
        console.error('Error loading fonts:', error);
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function createFontStyles() {
    if (!fontCache.bricolage || !fontCache.poppins) {
        return '';
    }

    return `
        @font-face {
            font-family: 'BricolageGrotesque';
            src: url('${fontCache.bricolage}') format('truetype');
            font-weight: 200 800;
        }
        
        @font-face {
            font-family: 'Poppins';
            src: url('${fontCache.poppins}') format('truetype');
            font-weight: 300 700;
        }
        @font-face {
        font-family: 'Poppins1';
        src: url('${fontCache.poppins1}') format('truetype');
        font-weight: 300 ;
}

        #userName { 
            font-family: 'BricolageGrotesque', sans-serif;
            font-weight: 700;
        }
        #userType{
            font-family: 'Poppins1', sans-serif;
            font-weight: 300;
            
        }
        
        #auraDescription, #auraPercentage, .brand {
            font-family: 'Poppins';
            font-weight: 700;
        }
    `;
}

function updateSVGCard(prediction) {
    const svg = document.querySelector('#auraCard svg');
    if (!svg) return;

    // Update font styles
    const defsElement = svg.querySelector('defs');
    const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
    styleElement.textContent = createFontStyles();

    // Clear existing font styles
    const existingStyles = defsElement.querySelectorAll('style');
    existingStyles.forEach(style => style.remove());

    defsElement.prepend(styleElement);

    // Update name and type
    const firstName = localStorage.getItem('userFirstName') || 'User';
    const lastName = localStorage.getItem('userLastName') || '';
    const fullName = `${firstName}\n ${lastName}`.trim();

    document.querySelector('#userName').textContent = fullName;

    // Update personality type with format: "ENFJ (Protagonist)"
    const personalityType = prediction.personalityType;
    const matches = personalityType.match(/([A-Z]{4})\s*([^)]+)$/);
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

    // Additional gradient definitions
    const additionalDefs = `
    <radialGradient id="legendry-aura-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(530 500) rotate(90) scale(510 520)">
        <stop offset="0%" stop-color="#DF0C8B"/>
        <stop offset="100%" stop-color="#570779"/>
    </radialGradient>
    <radialGradient id="infinite-aura-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(530 500) rotate(90) scale(510 520)">
        <stop stop-color="#DF0C10"></stop>
        <stop offset="1" stop-color="#280D07"></stop>
    </radialGradient>
    `;

    // Add additional defs to SVG
    if (defsElement) {
        defsElement.innerHTML += additionalDefs;
    }

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

    // Clear and update trait circles
    const traitCirclesGroup = document.querySelector('#traitCircles');
    traitCirclesGroup.innerHTML = '';

    // Add new trait circles
    Object.entries(prediction.traits).forEach(([trait, value], index) => {
        const circle = createTraitCircle(trait, value, index, currentStyle.traitCircles);
        traitCirclesGroup.appendChild(circle);
    });

    // Update aura level and description
    document.querySelector('#auraPercentage').textContent = `${auraLevel}%`;
    document.querySelector('#auraDescription').textContent = auraDescription;
}

async function downloadAuraCard() {
    try {
        const svg = document.querySelector('#auraCard svg');
        if (!svg) return;

        // Ensure fonts are loaded
        if (!fontCache.bricolage || !fontCache.poppins) {
            await loadAndCacheFonts();
        }

        // Create a copy of the SVG with embedded fonts
        const svgCopy = svg.cloneNode(true);
        const defs = svgCopy.querySelector('defs');
        const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
        styleElement.textContent = createFontStyles();
        defs.prepend(styleElement);

        // Convert to string with proper XML declaration
        const svgString = new XMLSerializer().serializeToString(svgCopy);
        const svgBlob = new Blob([
            '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
            '<!DOCTYPE svg PUBLIC "-//W3//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
            svgString
        ], { type: 'image/svg+xml;charset=utf-8' });

        // Create URL and image
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();

        // Set up canvas
        const canvas = document.createElement('canvas');
        canvas.width = svg.getAttribute('width');
        canvas.height = svg.getAttribute('height');
        const ctx = canvas.getContext('2d');

        // Wait for image to load
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
        });

        // Draw and convert to PNG
        ctx.drawImage(img, 0, 0);
        const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

        // Download
        const downloadUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'AuraMatrix-Card.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error generating card:', error);
        alert('Failed to generate card. Please try again.');
    }
}

// Add event listener to download button
document.getElementById('downloadCard').addEventListener('click', downloadAuraCard);



async function generateStickers(personalityType) {
    const stickerCards = document.querySelectorAll('.sticker-card');
    
    // Show loading state for all cards
    stickerCards.forEach(card => {
        card.querySelector('.sticker-loader').style.display = 'block';
        card.querySelector('.sticker').style.backgroundImage = '';
        card.style.display = 'block';
    });

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

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // Check for images array in the response
        if (!data.images || data.images.length === 0) {
            throw new Error('No stickers were generated');
        }

        // Process each image
        data.images.forEach((base64Image, index) => {
            if (index < stickerCards.length) {
                if (!base64Image) {
                    displayStickerError(stickerCards[index], 'Invalid sticker data received.');
                } else {
                    // Remove the "data:image/..." prefix if it exists in the base64 string
                    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                    const imageUrl = `data:image/png;base64,${base64Data}`;
                    displaySticker(stickerCards[index], imageUrl, index);
                }
                stickerCards[index].querySelector('.sticker-loader').style.display = 'none';
            }
        });

        // Handle any remaining cards
        for (let i = data.images.length; i < stickerCards.length; i++) {
            displayStickerError(stickerCards[i], 'No sticker data available.');
            stickerCards[i].querySelector('.sticker-loader').style.display = 'none';
        }

    } catch (error) {
        console.error('Error generating stickers:', error);
        stickerCards.forEach(card => {
            displayStickerError(card, 'Failed to generate sticker. Please try again.');
            card.querySelector('.sticker-loader').style.display = 'none';
        });
    }
}

function displaySticker(card, stickerUrl, index) {
    const sticker = card.querySelector('.sticker');
    const downloadBtn = card.querySelector('.download-sticker-btn');

    // Clear any existing error messages
    sticker.innerHTML = '';
    
    // Create a new Image object to verify the image loads correctly
    const img = new Image();
    
    img.onload = () => {
        sticker.style.backgroundImage = `url("${stickerUrl}")`;
        sticker.style.backgroundSize = 'contain';
        sticker.style.backgroundPosition = 'center';
        sticker.style.backgroundRepeat = 'no-repeat';
        sticker.style.display = 'block';
        
        if (downloadBtn) {
            downloadBtn.style.display = 'block';
            downloadBtn.onclick = () => downloadSticker(stickerUrl, `personality-sticker-${index + 1}.png`);
        }
    };
    
    img.onerror = () => {
        console.error('Failed to load sticker:', stickerUrl);
        displayStickerError(card, 'Failed to load sticker image.');
    };

    img.src = stickerUrl;
}

function displayStickerError(card, message = 'Error loading sticker') {
    const sticker = card.querySelector('.sticker');
    const downloadBtn = card.querySelector('.download-sticker-btn');

    sticker.style.backgroundImage = 'none';
    sticker.innerHTML = `
        <div class="sticker-error">
            <p>${message}</p>
            <p>Please try refreshing the page.</p>
        </div>
    `;
    sticker.style.display = 'flex';
    sticker.style.flexDirection = 'column';
    sticker.style.justifyContent = 'center';
    sticker.style.alignItems = 'center';
    sticker.style.textAlign = 'center';
    sticker.style.padding = '20px';
    sticker.style.backgroundColor = '#fff5f5';
    sticker.style.border = '1px solid #feb2b2';
    sticker.style.borderRadius = '8px';
    sticker.style.color = '#c53030';
    sticker.style.fontSize = '14px';

    if (downloadBtn) {
        downloadBtn.style.display = 'none';
    }
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
                console.error(`Error downloading sticker ${i + 1}:, error`);
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
        } catch (error) {
            console.error('Error creating aura card or stickers:', error);
        }
    }
};

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const applyGradient = localStorage.getItem('lgbtqGradient') === 'true';
    console.log('Apply Gradient:', applyGradient);
    if (applyGradient) {
        document.body.classList.add('lgbtq-gradient');
    }
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