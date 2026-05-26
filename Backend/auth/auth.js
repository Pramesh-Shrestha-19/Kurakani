document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       PANEL SWITCHING
    ========================================= */

    const loginPanel = document.getElementById("loginPanel");
    const signupPanel = document.getElementById("signupPanel");

    const showSignup = document.getElementById("showSignup");
    const showLogin = document.getElementById("showLogin");

    // LOGIN → SIGNUP
    if (showSignup) {
        showSignup.addEventListener("click", () => {
            loginPanel.classList.add("hidden");
            signupPanel.classList.remove("hidden");
        });
    }

    // SIGNUP → LOGIN
    if (showLogin) {
        showLogin.addEventListener("click", () => {
            signupPanel.classList.add("hidden");
            loginPanel.classList.remove("hidden");
        });
    }


    /* =========================================
       PASSWORD TOGGLE
    ========================================= */

    document.querySelectorAll(".toggle-password").forEach(icon => {

        icon.addEventListener("click", () => {

            const input = icon.parentElement.querySelector("input");

            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                icon.setAttribute("name", "eye-off-outline");
            } else {
                input.type = "password";
                icon.setAttribute("name", "eye-outline");
            }

        });

    });


    /* =========================================
       API BASE
    ========================================= */

    const API_BASE = "http://localhost/Kurakani/Backend/auth";


    /* =========================================
       LOGIN HANDLER
    ========================================= */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async (e) => {

            e.preventDefault();

            const username = loginForm.username.value;
            const password = loginForm.password.value;

            try {

                const response = await fetch(`${API_BASE}/login.php`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                });

                const data = await response.json();

                if (data.status === "success") {

                    localStorage.setItem("kurakani_user", data.user);

                    alert("Login Successful");

                    window.location.href = "Kurakani.html";

                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.error(error);
                alert("Login error");
            }

        });

    }


    /* =========================================
       SIGNUP HANDLER
    ========================================= */

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {

        signupForm.addEventListener("submit", async (e) => {

            e.preventDefault();

            const username = signupForm.username.value;
            const email = signupForm.email.value;
            const password = signupForm.password.value;
            const confirmPassword = signupForm.confirmPassword.value;

            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            try {

                const response = await fetch(`${API_BASE}/register.php`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                        confirmPassword
                    })
                });

                const data = await response.json();

                if (data.status === "success") {

                    alert("Registration Successful");

                    signupForm.reset();

                    // Switch back to login
                    signupPanel.classList.add("hidden");
                    loginPanel.classList.remove("hidden");

                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.error(error);
                alert("Signup error");
            }

        });

    }

});