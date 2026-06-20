document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const loginBtn = document.getElementById("loginBtn");
        const errorBox = document.getElementById("errormessage");

        // Clear previous errors
        errorBox.classList.add("d-none");

        // Disable button
        loginBtn.disabled = true;
        loginBtn.innerHTML = "Logging in...";

        try {
            const response = await fetch("/login", {
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
                loginBtn.innerHTML = "Success ✓";
                window.location.href = data.redirectUrl;
            } else {
                errorBox.classList.remove("d-none");
                errorBox.innerText = data.message;
            }

        } catch (error) {
            errorBox.classList.remove("d-none");
            errorBox.innerText = "Server error. Try again.";
        }
        finally {
            // Re-enable button if login failed
            loginBtn.disabled = false;
            loginBtn.innerHTML = "Log In";
        }
    });

});