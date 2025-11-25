const User = require('../models/login.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtKnow = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({message: "Something went wrong"});

    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: `User dengan ${email} tersebut tidak ditemukan` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Hubungi putri gultom " })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong" });
    }
};

module.exports = {
    login,
    register
};