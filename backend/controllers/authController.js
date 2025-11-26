const User = require('../models/login.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });

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

        res.status(200).json({ 
            msg: "Login Berhasil",
            token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role
        } });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong" });
    }
};

const getUserDetail = async (req, res) => {
    try {
        let token;

        if (req.headers.authorization) {
            const [type, value] = req.headers.authorization.split(" ");
            if (type === "Bearer" && value) {
                token = value;
            }
        }

        if (!token) {
            return res.status(401).json({ message: "Token Missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("ERROR:", error);
        return res.status(500).json({
            message: "Something went wrong",
            errorName: error.name,
            errorMessage: error.message,
        });
    }
};


const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            expires: new Date(0),
        });
        res.status(200).json({ msg: "Logout Sucessfull" });
    } catch (error) {
        return res.status(500).json({ msg: "Server error", error });

    }
}

module.exports = {
    login,
    register,
    logout,
    getUserDetail
};