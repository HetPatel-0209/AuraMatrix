function formatTraitValue(value) {
    return typeof value === 'number' && !isNaN(value) ? `${Math.round(value)}%` : '0%';
}

function mapTraitToValue(prediction, traitName) {
    const traitMap = {
        'EXTRAVERSION': 'Extraversion',
        'INTUITION': 'Intuition',
        'THINKING': 'Feeling',  // Map Thinking display to Feeling value
        'JUDGING': 'Judging'
    };
    
    return prediction.traits[traitMap[traitName.toUpperCase()]] || 0;
}

function getTraitDescription(name, value) {
    const descriptions = {
        'EXTRAVERSION': value < 50 ? 'Introverted' : 'Extraverted',
        'INTUITION': value < 50 ? 'Sensing' : 'Intuitive',
        'THINKING': value > 50 ? 'Feeling' : 'Thinking',  // Reversed for Thinking/Feeling
        'JUDGING': value < 50 ? 'Perceiving' : 'Judging'
    };
    return descriptions[name.toUpperCase()] || '';
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
            
            // Update personality type
            document.getElementById('personality-type').textContent = 
                `Your personality type is: ${prediction.personalityType}`;
            
            // Update trait values using the existing IDs
            if (prediction.traits) {
                // Update each trait
                const traits = ['extraversion', 'intuition', 'thinking', 'judging'];
                
                traits.forEach(trait => {
                    const valueElement = document.getElementById(`${trait}-value`);
                    const traitElement = valueElement.closest('.trait');
                    const nameElement = traitElement.querySelector('.trait-name');
                    const descElement = traitElement.querySelector('.trait-description');
                    
                    const traitValue = mapTraitToValue(prediction, nameElement.textContent);
                    
                    // Update value
                    valueElement.textContent = formatTraitValue(traitValue);
                    
                    // Update description
                    if (descElement) {
                        descElement.textContent = getTraitDescription(nameElement.textContent, traitValue);
                    }
                });
            }
            
            document.getElementById('description').textContent =
                "This personality assessment is based on your responses to our questionnaire. " +
                "Remember that personality is complex and multifaceted, and this is just one perspective on your unique characteristics.";
            
        } catch (error) {
            console.error('Error parsing prediction:', error);
            document.getElementById('personality-type').textContent = "Error displaying results";
            document.getElementById('description').textContent = "Please try taking the test again.";
            
            // Reset all trait values to 0% on error
            ['extraversion', 'intuition', 'thinking', 'judging'].forEach(trait => {
                document.getElementById(`${trait}-value`).textContent = '0%';
            });
        }
    } else {
        document.getElementById('personality-type').textContent = "No prediction available";
        document.getElementById('description').textContent = "Please try taking the test again.";
    }
}

document.querySelector('.back-button').addEventListener('click', () => {
    window.location.href = '/test.html';
});

// Display results when page loads
window.onload = displayResult;