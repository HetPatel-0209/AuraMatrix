async function fetchResults() {
    try {
        const answers = JSON.parse(localStorage.getItem('personalityAnswers') || '[]');
        
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

    // Display trait percentages with animation
    const traits = ['extraversion', 'intuition', 'thinking', 'judging'];
    traits.forEach(trait => {
        const value = result.traits[trait];
        const element = document.getElementById(`${trait}-value`);
        element.textContent = '0%';
        
        // Animate the percentage
        let current = 0;
        const target = value;
        const increment = target / 50; // Adjust for animation speed
        
        const animate = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                element.textContent = `${Math.round(current)}%`;
                requestAnimationFrame(animate);
            }
        };
        
        animate();
        
        // Update descriptions
        const description = document.getElementById(`${trait}-description`);
        description.textContent = value > 50 ? 
            trait.charAt(0).toUpperCase() + trait.slice(1) :
            getOppositeDescription(trait);
    });

    // Display description
    document.getElementById('description').textContent = 
        "Your personality profile has been analyzed based on your responses. " +
        "This assessment provides insights into your personality traits and tendencies. " +
        "Remember that personality is dynamic and can evolve over time.";
}

function getOppositeDescription(trait) {
    const opposites = {
        'extraversion': 'Introverted',
        'intuition': 'Sensing',
        'thinking': 'Feeling',
        'judging': 'Perceiving'
    };
    return opposites[trait] || '';
}

function displayError() {
    document.getElementById('personality-type').textContent = "Error occurred";
    document.getElementById('description').textContent = 
        "We encountered an error while processing your results. Please try taking the test again.";
}

// Fetch and display results when page loads
window.addEventListener('load', fetchResults);