// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { generateToken,checkRoleAdmin } = require('../middleware/authenticate');
const User = require('../models/user');

// POST /auth/register - Đăng ký người dùng
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Tạo một instance mới của User
        user = new User({
            username,
            password
        });

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Lưu người dùng vào cơ sở dữ liệu
        await user.save();

        // Tạo và trả về token
        const token = generateToken(user);
        res.status(201).json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /auth/login - Đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
            
        // Kiểm tra xem người dùng tồn tại
        let user = await User.findOne({ username });
        if(checkRoleAdmin(user)) {
            console.log("HEHE ADMIN");
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Tạo và trả về token
        const token = generateToken(user);
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
