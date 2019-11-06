const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,     //This is added after you check user(inside users.js) in the database when registering
            useFindAndModify: false   //This is added if we see "DeprecationWarning" in terminal after we finish 
                                      // creating user profile in profile.js
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
