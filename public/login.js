document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simulate login (replace with actual API call)
        if (username === 'erikmeulenberg' && password === 'Jf3r9n!dWN5Qqae') {
            // Redirect to the main page or dashboard
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
        }
    });
});