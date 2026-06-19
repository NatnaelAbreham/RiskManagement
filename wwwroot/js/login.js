document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/Account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Email: email,
                    Password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = "/Home/Index";
            } else {
                const errorBox = document.getElementById("errormessage");
                errorBox.classList.remove("d-none");
                errorBox.innerText = data.message;
            }

        } catch (error) {
            const errorBox = document.getElementById("errormessage");
            errorBox.classList.remove("d-none");
            errorBox.innerText = "Server error. Try again.";
        }
    });

});