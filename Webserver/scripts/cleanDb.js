const mongoose = require('mongoose');
const Platform = require('../models/Platform');
const Tool = require('../models/Tool');
const Pipeline = require('../models/Pipeline');

const MONGODB_URI = 'mongodb://admin:password@localhost:27017/';

async function cleanDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete all documents from all collections
        await Platform.deleteMany({});
        await Tool.deleteMany({});
        await Pipeline.deleteMany({});

        console.log('All data has been deleted');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('Error cleaning database:', error);
        process.exit(1);
    }
}

// Run the clean function
cleanDatabase(); 