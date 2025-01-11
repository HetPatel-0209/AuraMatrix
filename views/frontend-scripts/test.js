async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const answers = [];
    
    for (let i = 0; i < 10; i++) {
        answers.push(formData.get(`answer${i}`));
    }

    window.location.href = `/result.html?answers=${encodeURIComponent(JSON.stringify(answers))}`;
}