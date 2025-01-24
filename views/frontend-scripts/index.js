const form = document.querySelector('.flip-card__form');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const firstName = form.querySelector('input[name="fname"]').value;
    const lastName = form.querySelector('input[name="lname"]').value;
    const gender = form.querySelector('input[name="gender"]:checked').value;

    localStorage.setItem('userFirstName', firstName);
    localStorage.setItem('userLastName', lastName);
    localStorage.setItem('userGender', JSON.stringify(gender));

    console.log(gender);
    window.location.href = './test.html';
});