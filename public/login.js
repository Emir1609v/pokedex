document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        console.log("Attempting login with:", { username, password });  // Log the form data

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            console.log("Response status:", response.status);  // Log response status

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Invalid username or password");
            }

            const data = await response.json();
            console.log("Login successful, token received:", data.token);
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } catch (error) {
            console.error("Login error:", error.message);
            errorMessage.textContent = error.message;
        }
    });
});
