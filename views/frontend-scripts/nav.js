function navigateToPage(destination, data, paramName) {
    const queryString = data ? `?${paramName}=${encodeParam(data)}` : '';
    
    window.location.href = `./${destination}.html${queryString}`;
}

function initializeNavigation() {
    if (window.location.pathname.includes('result.html')) {
        const aboutButton = document.querySelector('.about-button');
        if (aboutButton) {
            aboutButton.addEventListener('click', (e) => {
                e.preventDefault();
                const params = new URLSearchParams(window.location.search);
                const prediction = params.get('prediction');
                
                navigateToPage('aboutUs', prediction, 'returnData');
            });
        }
    }

    if (window.location.pathname.includes('aboutUs.html')) {
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                const params = new URLSearchParams(window.location.search);
                const returnData = params.get('returnData');
                
                navigateToPage('result', returnData, 'prediction');
            });
        }
    }

    if (window.location.pathname.includes('result.html')) {
        const params = new URLSearchParams(window.location.search);
        if (!params.get('prediction')) {
            console.warn('No prediction data found. User might need to retake the test.');
        }
    }
}
document.addEventListener('DOMContentLoaded', initializeNavigation);