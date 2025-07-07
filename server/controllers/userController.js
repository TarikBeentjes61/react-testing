const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const JWT_SECRET = process.env.JWT_SECRET || 'secret key';
const { registerSchema, loginSchema } = require('../schemas/userSchemas');
const ApiError = require('../utils/apiError');

exports.registerUser = async (req, res, next) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return next(new ApiError(error.details[0].message, 400));
    }
    try {
        const newUser = await userService.registerUser(value);
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1d' });

        res.status(201).json({ message: 'User registered successfully', token, user: newUser});
    } catch (error) {
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return next(new ApiError(error.details[0].message, 400));
    }
    try {
        const user = await userService.loginUser(value);
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: 'User logged in successfully', token, user});
    } catch (error) {
        next(error);
    }
};

exports.getUserProfile = async (req, res, next) => {
    const { username } = req.params;
    if (typeof username !== 'string' || !/^[a-zA-Z0-9]+$/.test(username)) {
        return next(new ApiError('Invalid username', 400));
    }
    try {
        const user = await userService.getUserByName(username);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

