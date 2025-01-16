async function handleSubmit(event) {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;

    const form = event.target;
    const formData = new FormData(form);
    const answers = [];

    for (let i = 0; i < 10; i++) {
        answers.push(formData.get(`answer${i}`));
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch('http://localhost:3000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        if (result.prediction) {
            sessionStorage.setItem('lastAnswers', JSON.stringify(answers));
            window.location.href = `./result.html?prediction=${encodeURIComponent(JSON.stringify(result.prediction))}`;
        } else {
            throw new Error('Invalid prediction format received from server');
        }
    } catch (error) {
        console.error('Error details:', error);
        let errorMessage = 'There was a problem submitting your answers. ';

        if (error.name === 'AbortError') {
            errorMessage += 'The request timed out. Please try again.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Could not connect to the server. Please make sure the server is running.';
        } else {
            errorMessage += error.message;
        }

        alert(errorMessage);
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

// Add this function to check server health before form submission
