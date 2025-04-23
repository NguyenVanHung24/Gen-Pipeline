const Platform = require('../models/platform');

// Create new platform
exports.createPlatform = async (req, res) => {
    try {
        const { name, supported_languages, config } = req.body;

        // Validate required fields
        if (!name || !supported_languages) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['name', 'supported_languages']
            });
        }

        // Check if platform already exists
        const existingPlatform = await Platform.findOne({ name });
        if (existingPlatform) {
            return res.status(409).json({
                error: 'Platform already exists',
                name: name
            });
        }

        // Create new platform
        const platform = new Platform({
            name,
            supported_languages,
            config: config || {}
        });

        const savedPlatform = await platform.save();
        res.status(201).json(savedPlatform);

    } catch (error) {
        console.error('Error creating platform:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Get all platforms
exports.getAllPlatforms = async (req, res) => {
    try {
        const platforms = await Platform.find().sort({ name: 1 });
        res.status(200).json({
            count: platforms.length,
            platforms: platforms
        });
    } catch (error) {
        console.error('Error fetching platforms:', error);
        res.status(500).json({
            error: 'Error fetching platforms',
            message: error.message
        });
    }
};

// Get platform by ID
exports.getPlatformById = async (req, res) => {
    try {
        const platform = await Platform.findById(req.params.id);
        if (!platform) {
            return res.status(404).json({
                error: 'Platform not found',
                id: req.params.id
            });
        }
        res.status(200).json(platform);
    } catch (error) {
        console.error('Error fetching platform:', error);
        res.status(500).json({
            error: 'Error fetching platform',
            message: error.message
        });
    }
};

// Update platform
exports.updatePlatform = async (req, res) => {
    try {
        const { name, supported_languages, config } = req.body;
        
        // Check if platform exists
        const platform = await Platform.findById(req.params.id);
        if (!platform) {
            return res.status(404).json({
                error: 'Platform not found',
                id: req.params.id
            });
        }

        // If name is being changed, check if new name already exists
        if (name && name !== platform.name) {
            const existingPlatform = await Platform.findOne({ name });
            if (existingPlatform) {
                return res.status(409).json({
                    error: 'Platform name already exists',
                    name: name
                });
            }
        }

        // Update platform
        const updatedPlatform = await Platform.findByIdAndUpdate(
            req.params.id,
            {
                name: name || platform.name,
                supported_languages: supported_languages || platform.supported_languages,
                config: config || platform.config
            },
            { new: true }
        );

        res.status(200).json(updatedPlatform);

    } catch (error) {
        console.error('Error updating platform:', error);
        res.status(500).json({
            error: 'Error updating platform',
            message: error.message
        });
    }
};

// Delete platform
exports.deletePlatform = async (req, res) => {
    try {
        const platform = await Platform.findByIdAndDelete(req.params.id);
        if (!platform) {
            return res.status(404).json({
                error: 'Platform not found',
                id: req.params.id
            });
        }
        res.status(200).json({
            message: 'Platform deleted successfully',
            platform: platform
        });
    } catch (error) {
        console.error('Error deleting platform:', error);
        res.status(500).json({
            error: 'Error deleting platform',
            message: error.message
        });
    }
};

// Add this function to platform.controller.js
exports.searchPlatforms = async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name) {
            return res.status(400).json({
                error: 'Name parameter is required',
                example: '/platforms/search?name=gitlab'
            });
        }

        const platforms = await Platform.find({
            name: { $regex: new RegExp(name, 'i') }
        }).sort({ name: 1 });

        if (!platforms.length) {
            return res.status(404).json({
                message: 'No platforms found matching the name',
                searchTerm: name
            });
        }

        res.status(200).json({
            count: platforms.length,
            platforms: platforms
        });

    } catch (error) {
        console.error('Error searching platforms:', error);
        res.status(500).json({
            error: 'Error searching platforms',
            message: error.message
        });
    }
};
