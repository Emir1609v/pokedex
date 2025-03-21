const bcrypt = require('bcrypt');

const storedHashedPassword = "$2b$10$EOJkLEzdyjabGEn7C5oTJ.fzHnpWc9Cj3OF2VnPfbf/cliULtB/9a"; 
const enteredPassword = "erik";

bcrypt.compare(enteredPassword, storedHashedPassword, (err, result) => {
    if (err) {
        console.error("Error comparing passwords:", err);
    } else {
        console.log("Do passwords match?", result);
    }
});
