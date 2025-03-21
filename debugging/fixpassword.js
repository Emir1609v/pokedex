require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('users', new mongoose.Schema({ username: String, password: String }));

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const user = await User.findOne({ username: "testuser" });
    if (user) {
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        console.log("Password hashed successfully!");
    } else {
        console.log("User not found.");
    }
    process.exit();
});
