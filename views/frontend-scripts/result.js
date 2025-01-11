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
            
            // Update trait values
            document.getElementById('extraversion-value').textContent = `${prediction.traits.Extraversion}%`;
            document.getElementById('intuition-value').textContent = `${prediction.traits.Intuition}%`;
            document.getElementById('thinking-value').textContent = `${prediction.traits.Thinking}%`;
            document.getElementById('judging-value').textContent = `${prediction.traits.Judging}%`;
            
            document.getElementById('description').textContent =
                "This personality assessment is based on your responses to our questionnaire. " +
                "Remember that personality is complex and multifaceted, and this is just one perspective on your unique characteristics.";
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