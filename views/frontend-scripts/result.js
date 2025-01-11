function formatTraitValue(value) {
    return typeof value === 'number' && !isNaN(value) ? `${Math.round(value)}%` : '0%';
}

function getTraitDescription(name, value) {
    const opposites = {
        'EXTRAVERSION': ['Introverted', 'Extraverted'],
        'INTUITION': ['Sensing', 'Intuitive'],
        'THINKING': ['Feeling', 'Thinking'],
        'JUDGING': ['Perceiving', 'Judging']
    };
    
    const pair = opposites[name.toUpperCase()];
    if (!pair) return '';
    return value < 50 ? pair[0] : pair[1];
}

function updateCircleChart(prediction) {
    const circle = document.querySelector('.circle-chart');
    const radius = 150; // Circle radius in pixels
    
    // Clear existing elements
    circle.querySelectorAll('.trait-bar, .trait-label, .trait-value-label').forEach(el => el.remove());

    // Get available traits from prediction
    const traits = Object.keys(prediction.traits);
    const traitCount = traits.length;
    
    traits.forEach((trait, index) => {
        const value = prediction.traits[trait];
        const barHeight = (radius * value) / 100;
        
        // Calculate angle based on number of traits
        const angle = (360 / traitCount) * index;
        
        // Create and position bar
        const bar = document.createElement('div');
        bar.className = 'trait-bar';
        bar.style.height = '0';
        bar.style.transform = `rotate(${angle}deg)`;
        
        // Create trait label
        const label = document.createElement('div');
        label.className = 'trait-label';
        label.textContent = trait.toUpperCase();
        label.style.opacity = '0';
        
        // Position label
        const labelRadius = radius + 30;
        const labelAngle = angle * (Math.PI / 180);
        label.style.left = `${radius + labelRadius * Math.cos(labelAngle) - 50}px`;
        label.style.top = `${radius + labelRadius * Math.sin(labelAngle) - 10}px`;
        
        // Create and position value label
        const valueLabel = document.createElement('div');
        valueLabel.className = 'trait-value-label';
        valueLabel.textContent = `${Math.round(value)}%`;
        valueLabel.style.opacity = '0';
        
        // Position value label dynamically based on bar height
        const valueLabelRadius = (barHeight / 2);
        valueLabel.style.left = `${radius + valueLabelRadius * Math.cos(labelAngle) - 20}px`;
        valueLabel.style.top = `${radius + valueLabelRadius * Math.sin(labelAngle) - 6}px`;
        
        // Add elements to chart
        circle.appendChild(bar);
        circle.appendChild(label);
        circle.appendChild(valueLabel);
        
        // Animate elements
        requestAnimationFrame(() => {
            bar.style.height = `${barHeight}px`;
            label.style.opacity = '1';
            valueLabel.style.opacity = '1';
        });
    });
}

function updateTraitsDisplay(prediction) {
    const traitsContainer = document.querySelector('.traits-container');
    traitsContainer.innerHTML = ''; // Clear existing traits

    Object.entries(prediction.traits).forEach(([trait, value]) => {
        const traitDiv = document.createElement('div');
        traitDiv.className = 'trait';
        
        const description = getTraitDescription(trait, value);
        
        traitDiv.innerHTML = `
            <div class="trait-name">${trait.toUpperCase()}</div>
            <div class="trait-value">${formatTraitValue(value)}</div>
            <div class="trait-description">${description}</div>
        `;
        
        traitsContainer.appendChild(traitDiv);
    });
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
            
            // Update traits display and circle chart
            if (prediction.traits) {
                updateTraitsDisplay(prediction);
                updateCircleChart(prediction);
            }
            
            document.getElementById('description').textContent =
                "This personality assessment is based on your responses to our questionnaire. " +
                "Remember that personality is complex and multifaceted, and this is just one perspective on your unique characteristics.";
            
        } catch (error) {
            console.error('Error parsing prediction:', error);
            document.getElementById('personality-type').textContent = "Error displaying results";
            document.getElementById('description').textContent = "Please try taking the test again.";
            
            // Clear traits on error
            document.querySelector('.traits-container').innerHTML = '';
        }
    } else {
        document.getElementById('personality-type').textContent = "No prediction available";
        document.getElementById('description').textContent = "Please try taking the test again.";
    }
}

// Add CSS for smooth animations
const style = document.createElement('style');
style.textContent = `
    .trait-bar {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3px;
        background: #4299e1;
        transform-origin: bottom center;
        transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .trait-label, .trait-value-label {
        position: absolute;
        transition: opacity 0.5s ease-in-out;
    }

    .trait-value {
        transition: all 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

document.querySelector('.back-button').addEventListener('click', () => {
    window.location.href = '/test.html';
});

// Display results when page loads
window.onload = displayResult;