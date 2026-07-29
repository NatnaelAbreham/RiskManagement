
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeIcon.className = "bi bi-moon-fill";
    }

    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("light-mode");

        const isLight =
            document.body.classList.contains("light-mode");

        localStorage.setItem(
            "theme",
            isLight ? "light" : "dark"
        );

        themeIcon.className = isLight
            ? "bi bi-moon-fill"
            : "bi bi-sun-fill";
    });
