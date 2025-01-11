async function fetchResults() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const answers = JSON.parse(decodeURIComponent(urlParams.get('answers')));

        const response = await fetch('https://auramatrix.onrender.com/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        displayResult(result);
    } catch (error) {
        console.error('Error:', error);
        displayError();
    }
}

function displayResult(result) {
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';
    
    // Display name
    if (firstName || lastName) {
        document.getElementById('user-name').textContent = `${firstName} ${lastName}`;
    }

    // Display personality type
    document.getElementById('personality-type').textContent = result.prediction;

    // Display trait percentages
    document.getElementById('extraversion-value').textContent = `${result.traits.extraversion}%`;
    document.getElementById('intuition-value').textContent = `${result.traits.intuition}%`;
    document.getElementById('thinking-value').textContent = `${result.traits.thinking}%`;
    document.getElementById('judging-value').textContent = `${result.traits.judging}%`;

    // Update descriptions based on percentages
    document.getElementById('extraversion-description').textContent = result.traits.extraversion > 50 ? 'Extraverted' : 'Introverted';
    document.getElementById('intuition-description').textContent = result.traits.intuition > 50 ? 'Intuitive' : 'Sensing';
    document.getElementById('thinking-description').textContent = result.traits.thinking > 50 ? 'Thinking' : 'Feeling';
    document.getElementById('judging-description').textContent = result.traits.judging > 50 ? 'Judging' : 'Perceiving';

    // Display description
    document.getElementById('description').textContent = 
        "This personality assessment is based on your responses to our questionnaire. " +
        "Remember that personality is complex and multifaceted, and this is just one perspective on your unique characteristics.";

    // Show result container
    document.getElementById('result').style.display = 'block';
}

function displayError() {
    document.getElementById('personality-type').textContent = "Error occurred";
    document.getElementById('description').textContent = "We encountered an error while processing your results. Please try taking the test again.";
    document.getElementById('result').style.display = 'block';
}

// Fetch and display results when page loads
window.onload = fetchResults;
window.onload = displayResult;