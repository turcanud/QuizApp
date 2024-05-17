const mongoose = require('mongoose');
require('dotenv').config();

class Database {
    constructor() {
        if (!Database.instance) {
            this.connect();
            Database.instance = this;
        }
        return Database.instance;
    }

    connect() {
        const dbURI = process.env.DB_URI;
        return mongoose.connect(dbURI)
            .catch(err => {
                console.error('Database connection error:', err);
                throw err;
            });
    }
}

module.exports = new Database();