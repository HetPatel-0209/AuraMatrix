const form = document.querySelector('.flip-card__form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const firstName = form.querySelector('input[name="fname"]').value;
    const lastName = form.querySelector('input[name="lname"]').value;
    
    localStorage.setItem('userFirstName', firstName);
    localStorage.setItem('userLastName', lastName);
    
    window.location.href = '/test.html';
});