const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/pixiebooth")
        console.log("Database connection Successful")
    } catch (e) {
        console.log(e)
    }
};

module.exports = connectDB;