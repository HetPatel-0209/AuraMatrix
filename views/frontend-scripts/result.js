function displayResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const prediction = urlParams.get('prediction');
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';
    if (firstName || lastName) {
        document.getElementById('user-name').textContent = `${firstName} ${lastName}`;
    }
    if (prediction) {
        document.getElementById('personality-type').textContent = prediction;
        document.getElementById('description').textContent =
            "This personality assessment is based on your responses to our questionnaire. " +
            "Remember that personality is complex and multifaceted, and this is just one perspective on your unique characteristics.";
        document.getElementById('extraversion-value').textContent = `${traits.Extraversion}%`;
        document.getElementById('intuition-value').textContent = `${traits.Intuition}%`;
        document.getElementById('thinking-value').textContent = `${traits.Thinking}%`;
        document.getElementById('judging-value').textContent = `${traits.Judging}%`;
    } else {
        document.getElementById('personality-type').textContent = "No prediction available";
        document.getElementById('description').textContent = "Please try taking the test again.";
    }
}

// Display results when page loads
window.onload = displayResult;