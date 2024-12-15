const Platform = require('../models/Platform');
const Tool = require('../models/Tool');
const Pipeline = require('../models/Pipeline');

exports.cleanDatabase = async (req, res) => {
    try {
        // Delete all documents from all collections
        await Platform.deleteMany({});
        await Tool.deleteMany({});
        await Pipeline.deleteMany({});

        res.status(200).json({
            message: 'Database cleaned successfully',
            deletedCollections: ['platforms', 'tools', 'pipelines']
        });
    } catch (error) {
        console.error('Error cleaning database:', error);
        res.status(500).json({
            error: 'Error cleaning database',
            message: error.message
        });
    }
}; 