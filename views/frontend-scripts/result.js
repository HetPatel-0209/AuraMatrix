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
            
            // Clear previous traits
            const traitsContainer = document.getElementById('traits-container');
            traitsContainer.innerHTML = '';
            
            // Check if traits object has exactly four properties
            if (Object.keys(prediction.traits).length !== 4) {
                traitsContainer.innerHTML = '<p>Invalid number of traits received.</p>';
            } else {
                // Loop through each trait and create UI elements
                Object.keys(prediction.traits).forEach(trait => {
                    const traitDiv = document.createElement('div');
                    traitDiv.className = 'trait';
                    traitDiv.innerHTML = `
                        <div class="trait-name">${trait}</div>
                        <div class="trait-value">${prediction.traits[trait]}%</div>
                        <div class="trait-description"></div>
                    `;
                    traitsContainer.appendChild(traitDiv);
                });
            }
            
            document.getElementById('description').textContent =
                "This personality assessment is based on your responses to our questionnaire. " +
                "Remember that personality is complex and multifaceted, and this is just one perspective on your unique characteristics.";
            
            // Trigger trait value animations after 1 second
            setTimeout(() => {
                document.querySelectorAll('.trait-value').forEach(el => {
                    el.classList.add('animate');
                });
            }, 1000);
            
        } catch (error) {
            console.error('Error parsing prediction:', error);
            document.getElementById('personality-type').textContent = "Error displaying results";
            document.getElementById('description').textContent = "Please try taking the test again.";
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