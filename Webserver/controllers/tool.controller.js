const Tool = require('../models/Tool');

// Create new tool
exports.createTool = async (req, res) => {
    try {
        const { name, version, config } = req.body;

        // Validate required fields
        if (!name || !version) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['name', 'version']
            });
        }

        // Check if tool already exists
        const existingTool = await Tool.findOne({ name });
        if (existingTool) {
            return res.status(409).json({
                error: 'Tool already exists',
                name: name
            });
        }

        // Create new tool
        const tool = new Tool({
            name,
            version,
            config: config || {}
        });

        const savedTool = await tool.save();
        res.status(201).json(savedTool);

    } catch (error) {
        console.error('Error creating tool:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Get all tools
exports.getAllTools = async (req, res) => {
    try {
        const tools = await Tool.find().sort({ name: 1 });
        res.status(200).json({
            count: tools.length,
            tools: tools
        });
    } catch (error) {
        console.error('Error fetching tools:', error);
        res.status(500).json({
            error: 'Error fetching tools',
            message: error.message
        });
    }
};

// Get tool by ID
exports.getToolById = async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({
                error: 'Tool not found',
                id: req.params.id
            });
        }
        res.status(200).json(tool);
    } catch (error) {
        console.error('Error fetching tool:', error);
        res.status(500).json({
            error: 'Error fetching tool',
            message: error.message
        });
    }
};

// Update tool
exports.updateTool = async (req, res) => {
    try {
        const { name, version, config } = req.body;
        
        // Check if tool exists
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({
                error: 'Tool not found',
                id: req.params.id
            });
        }

        // If name is being changed, check if new name already exists
        if (name && name !== tool.name) {
            const existingTool = await Tool.findOne({ name });
            if (existingTool) {
                return res.status(409).json({
                    error: 'Tool name already exists',
                    name: name
                });
            }
        }

        // Update tool
        const updatedTool = await Tool.findByIdAndUpdate(
            req.params.id,
            {
                name: name || tool.name,
                version: version || tool.version,
                config: config || tool.config
            },
            { new: true }
        );

        res.status(200).json(updatedTool);

    } catch (error) {
        console.error('Error updating tool:', error);
        res.status(500).json({
            error: 'Error updating tool',
            message: error.message
        });
    }
};

// Delete tool
exports.deleteTool = async (req, res) => {
    try {
        const tool = await Tool.findByIdAndDelete(req.params.id);
        if (!tool) {
            return res.status(404).json({
                error: 'Tool not found',
                id: req.params.id
            });
        }
        res.status(200).json({
            message: 'Tool deleted successfully',
            tool: tool
        });
    } catch (error) {
        console.error('Error deleting tool:', error);
        res.status(500).json({
            error: 'Error deleting tool',
            message: error.message
        });
    }
};

// Add this function to tool.controller.js
exports.searchTools = async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name) {
            return res.status(400).json({
                error: 'Name parameter is required',
                example: '/tools/search?name=truffle-hog'
            });
        }

        const tools = await Tool.find({
            name: { $regex: new RegExp(name, 'i') }
        }).sort({ name: 1 });

        if (!tools.length) {
            return res.status(404).json({
                message: 'No tools found matching the name',
                searchTerm: name
            });
        }

        res.status(200).json({
            count: tools.length,
            tools: tools
        });

    } catch (error) {
        console.error('Error searching tools:', error);
        res.status(500).json({
            error: 'Error searching tools',
            message: error.message
        });
    }
};
