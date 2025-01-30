const form = document.querySelector('.flip-card__form');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstName = form.querySelector('input[name="fname"]').value.trim();
    const lastName = form.querySelector('input[name="lname"]').value.trim();
    const gender = form.querySelector('input[name="gender"]:checked')?.value;

    if (!firstName || !lastName || !gender) {
        alert("Please fill out all fields.");
        return;
    }

    localStorage.setItem('userFirstName', firstName);
    localStorage.setItem('userLastName', lastName);
    localStorage.setItem('userGender', JSON.stringify(gender));

    if (gender === "trans") {
        localStorage.setItem("lgbtqGradient", "true");
    } else {
        localStorage.removeItem("lgbtqGradient");
    }

    // Ping the /wakeup endpoint but don't block navigation
    fetch("https://auramatrix.onrender.com/wakeup", {
        method: "GET",
    }).catch(error => console.warn("Wakeup request failed, but proceeding:", error));

    // Immediately proceed to the next page
    window.location.href = './test.html';
});
