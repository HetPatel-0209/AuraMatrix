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

    const img = new Image();
    img.onload = () => {
        // Create canvas to display as PNG
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Use PNG data URL for display
        sticker.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
    };
    img.onerror = () => {
        sticker.style.backgroundImage = `url(${stickerUrl})`;
    };
    img.src = stickerUrl;

    // Update download handler
    downloadBtn.onclick = () => downloadSticker(stickerUrl, `sticker-${index + 1}.png`);
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
    filename = filename.endsWith('.png') ? filename : `${filename}.png`;
    const img = new Image();
    img.onload = async () => {
        try {
            // Create canvas and draw image
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Convert to PNG blob
            const blob = await new Promise(resolve => 
                canvas.toBlob(resolve, 'image/png')
            );

            // Create download link
            const link = document.createElement('a');
            link.download = filename;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Conversion error:', error);
            // Fallback to original download
            const fallbackLink = document.createElement('a');
            fallbackLink.download = filename;
            fallbackLink.href = url;
            fallbackLink.click();
        }
    };

    img.onerror = () => {
        console.error('Error loading image');
        // Fallback to original URL
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
    };

    img.src = url;
}

async function downloadAllStickers() {
    const stickerCards = document.querySelectorAll('.sticker-card');
    
    // Create helper function to convert WebP to PNG
    const convertWebPtoPNG = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const img = await createImageBitmap(blob);
            
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            return new Promise((resolve) => 
                canvas.toBlob(resolve, 'image/png')
            );
        } catch (error) {
            console.error('Conversion failed:', error);
            return null;
        }
    };

    // Process all stickers with progress feedback
    for (let i = 0; i < stickerCards.length; i++) {
        const card = stickerCards[i];
        const sticker = card.querySelector('.sticker');
        const backgroundImage = sticker.style.backgroundImage;
        
        if (backgroundImage) {
            const originalUrl = backgroundImage
                .replace(/^url\(["']?/, '')
                .replace(/["']?\)$/, '');
            
            try {
                // Show converting status
                const originalText = card.querySelector('.download-sticker-btn').textContent;
                card.querySelector('.download-sticker-btn').textContent = 'Converting...';
                
                // Convert and download
                const pngBlob = await convertWebPtoPNG(originalUrl);
                if (pngBlob) {
                    const link = document.createElement('a');
                    link.download = `aura-sticker-${i + 1}.png`;
                    link.href = URL.createObjectURL(pngBlob);
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(link.href);
                    document.body.removeChild(link);
                }
                
                // Restore button text after short delay
                setTimeout(() => {
                    card.querySelector('.download-sticker-btn').textContent = originalText;
                }, 2000);
                
                // Add slight delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`Error downloading sticker ${i + 1}:`, error);
                // Fallback to original download
                const fallbackLink = document.createElement('a');
                fallbackLink.download = `aura-sticker-${i + 1}.webp`;
                fallbackLink.href = originalUrl;
                fallbackLink.click();
            }
        }
    }
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