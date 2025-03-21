require('dotenv').config();
const jwt = require('jsonwebtoken');

const testTokenGeneration = () => {
    const payload = { id: "someUserId" };
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("Generated Token:", token);
    } catch (err) {
        console.error("Error generating token:", err);
    }
};

testTokenGeneration();