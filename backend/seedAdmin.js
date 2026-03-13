const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        // Clear existing admin if you want to reset
        await User.deleteMany({ role: 'admin' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('vivek123', salt); // Change 'vivek123' to your desired password

        const admin = new User({
            username: 'vivek_admin',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log("✅ Admin account 'vivek_admin' created successfully!");
        process.exit();
    })
    .catch(err => console.error(err));
    