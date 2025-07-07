const { getUsersCollection } = require('../config/db');
const bcrypt = require('bcryptjs');
const { convertToObjectId, getCurrentDate, formatUser } = require('../utils/utils');
const ApiError = require('../utils/apiError');

exports.registerUser = async ({username, password}) => {
    const usersCollection = getUsersCollection();
    const existing = await usersCollection.findOne({ username });
    if (existing) {
        throw new ApiError('Username already exists', 409);
    }
    const hashed = await bcrypt.hash(password, 10);
    const date = getCurrentDate();
    const userData = {
        username,
        password: hashed,
        registerDate: date,
        lastLoggedIn: date,
        reputation: 0
    }; 
    await usersCollection.insertOne(userData);
    const user = await usersCollection.findOne({ username });
    return formatUser(user);
}

exports.loginUser = async ({ username, password }) => {
    const usersCollection = getUsersCollection();    
    const user = await usersCollection.findOne({ username });
    if (!user) {
        throw new ApiError('Incorrect Credentials', 409);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new ApiError('Incorrect Credentials', 409);
    }
    return formatUser(user);
}
exports.getUserByName = async (username) => {
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ username });
    if (!user) {
        throw new ApiError('User not found', 404);
    }
    return formatUser(user);
}
exports.incrementReputation = async (userId, amount) => {
    const usersCollection = getUsersCollection();
    const userIdObj = convertToObjectId(userId);
    await usersCollection.updateOne(
        { _id: userIdObj },
        { $inc: { reputation: amount } }
    );
}

