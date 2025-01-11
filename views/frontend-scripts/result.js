function displayResult() {
    // Get stored results
    const storedResults = localStorage.getItem('personalityResults');
    const results = storedResults ? JSON.parse(storedResults) : null;
    
    // Get name from localStorage
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';

    // Display name if available
    if (firstName || lastName) {
        document.getElementById('user-name').textContent = `${firstName} ${lastName}`;
    }

    if (results) {
        // Display personality type
        document.getElementById('personality-type').textContent = results.prediction || 'Type not available';

        // Display trait percentages with fallbacks
        const traits = results.traits || {};
        
        // Update trait values and descriptions
        updateTrait('extraversion', traits.extraversion || 0, 'Extraverted', 'Introverted');
        updateTrait('intuition', traits.intuition || 0, 'Intuitive', 'Sensing');
        updateTrait('thinking', traits.thinking || 0, 'Thinking', 'Feeling');
        updateTrait('judging', traits.judging || 0, 'Judging', 'Perceiving');

        // Display description
        document.getElementById('description').textContent = 
            "This personality assessment is based on your responses to our questionnaire. " +
            "Remember that personality is complex and multifaceted, and this is just one perspective on your unique characteristics.";
    } else {
        // Handle case where no results are available
        document.getElementById('personality-type').textContent = "No results available";
        document.getElementById('description').textContent = "Please take the test to see your results.";
    }

    // Clear the results from localStorage after displaying
    localStorage.removeItem('personalityResults');
}

function updateTrait(traitName, value, highLabel, lowLabel) {
    // Update the percentage
    const valueElement = document.getElementById(`${traitName}-value`);
    if (valueElement) {
        valueElement.textContent = `${value}%`;
        valueElement.style.color = value > 0 ? '#4a90e2' : '#636e72';
    }

    // Update the description
    const descElement = document.getElementById(`${traitName}-description`);
    if (descElement) {
        descElement.textContent = value > 50 ? highLabel : lowLabel;
        descElement.style.color = '#636e72';
    }
}

// Display results when page loads
window.onload = displayResult;

