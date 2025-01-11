function formatTraitValue(value) {
    // Check if value is a number and not NaN
    if (typeof value === 'number' && !isNaN(value)) {
        return `${Math.round(value)}%`;
    }
    return '0%'; // Default fallback value
}

function getTraitDescription(name, value) {
    const descriptions = {
        'EXTRAVERSION': value >= 50 ? 'Extraverted' : 'Introverted',
        'INTUITION': value >= 50 ? 'Intuitive' : 'Sensing',
        'THINKING': value >= 50 ? 'Thinking' : 'Feeling',
        'JUDGING': value >= 50 ? 'Judging' : 'Perceiving'
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
                // Update Extraversion
                document.getElementById('extraversion-value').textContent = 
                    formatTraitValue(prediction.traits.Extraversion);
                
                // Update Intuition
                document.getElementById('intuition-value').textContent = 
                    formatTraitValue(prediction.traits.Intuition);
                
                // Update Thinking
                document.getElementById('thinking-value').textContent = 
                    formatTraitValue(prediction.traits.Thinking);
                
                // Update Judging
                document.getElementById('judging-value').textContent = 
                    formatTraitValue(prediction.traits.Judging);

                // Update descriptions
                document.querySelectorAll('.trait').forEach(traitElement => {
                    const nameElement = traitElement.querySelector('.trait-name');
                    const descElement = traitElement.querySelector('.trait-description');
                    if (nameElement && descElement) {
                        const traitName = nameElement.textContent;
                        const traitValue = prediction.traits[traitName] || 0;
                        descElement.textContent = getTraitDescription(traitName, traitValue);
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

// Add event listener for the back button
document.querySelector('.back-button').addEventListener('click', () => {
    window.location.href = '/test.html';
});

// Display results when page loads
window.onload = displayResult;