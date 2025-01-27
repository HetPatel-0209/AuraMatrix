function navigateToAboutUs(prediction) {
    try {
        if (prediction) {
            localStorage.setItem('tempPrediction', prediction);
        }
        
        const aboutUsUrl = './aboutUs.html';
        window.location.href = aboutUsUrl;
    } catch (error) {
        console.error('Error navigating to About Us:', error);
    }
}

function navigateToResults() {
    try {
        const storedPrediction = localStorage.getItem('tempPrediction');
        
        const resultUrl = storedPrediction 
            ? `./result.html?prediction=${encodeURIComponent(storedPrediction)}`
            : './result.html';
            
        localStorage.removeItem('tempPrediction');
        
        window.location.href = resultUrl;
    } catch (error) {
        console.error('Error navigating to Results:', error);
    }
}

export { navigateToAboutUs, navigateToResults };