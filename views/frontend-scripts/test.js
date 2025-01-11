async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const answers = [];
    
    for (let i = 0; i < 10; i++) {
        answers.push(formData.get(`answer${i}`));
    }

    try {
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
        
        // Store the results in localStorage
        localStorage.setItem('personalityResults', JSON.stringify(result));
        
        // Redirect to results page
        window.location.href = '/result.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit answers. Please try again.');
    }
}