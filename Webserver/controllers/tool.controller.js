const Tool = require('../models/tool');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../UI/public/tools/');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const toolName = req.body.name;
        const ext = path.extname(file.originalname);
        const filename = `${toolName}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file) {
            cb(null, true);
            return;
        }
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Get all tools
exports.getTools = async (req, res) => {
    try {
        const tools = await Tool.find();
        res.status(200).json({
            tools: tools
        });
    } catch (error) {
        console.error('Error getting tools:', error);
        res.status(500).json({
            error: 'Error getting tools',
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
        console.error('Error getting tool:', error);
        res.status(500).json({
            error: 'Error getting tool',
            message: error.message
        });
    }
};

// Create new tool
exports.createTool = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { name, version, config } = req.body;
            const parsedConfig = JSON.parse(config);

            // Xử lý severity_levels
            if (typeof parsedConfig.severity_levels === 'string') {
                parsedConfig.severity_levels = parsedConfig.severity_levels
                    .split(',')
                    .map(level => level.trim());
            }

            // Xử lý exclude_patterns
            if (typeof parsedConfig.exclude_patterns === 'string') {
                parsedConfig.exclude_patterns = parsedConfig.exclude_patterns
                    .split(',')
                    .map(pattern => pattern.trim());
            }

            const existingTool = await Tool.findOne({ name });
            if (existingTool) {
                return res.status(409).json({
                    error: 'Tool already exists',
                    name: name
                });
            }

            const tool = new Tool({
                name,
                version,
                imagePath: req.file ? `/tools/${req.file.filename}` : '/tools/default.png',
                config: parsedConfig
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
    }
];

// Update tool
exports.updateTool = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { name, version, config } = req.body;
            const parsedConfig = config ? JSON.parse(config) : {};
            
            const tool = await Tool.findById(req.params.id);
            if (!tool) {
                return res.status(404).json({
                    error: 'Tool not found',
                    id: req.params.id
                });
            }

            // Xử lý severity_levels
            if (typeof parsedConfig.severity_levels === 'string') {
                parsedConfig.severity_levels = parsedConfig.severity_levels
                    .split(',')
                    .map(level => level.trim());
            }

            // Xử lý exclude_patterns
            if (typeof parsedConfig.exclude_patterns === 'string') {
                parsedConfig.exclude_patterns = parsedConfig.exclude_patterns
                    .split(',')
                    .map(pattern => pattern.trim());
            }

            if (name && name !== tool.name) {
                const existingTool = await Tool.findOne({ name });
                if (existingTool) {
                    return res.status(409).json({
                        error: 'Tool name already exists',
                        name: name
                    });
                }
            }

            const updateData = {
                name: name || tool.name,
                version: version || tool.version,
                config: {
                    ...tool.config,
                    ...parsedConfig
                }
            };

            if (req.file) {
                if (tool.imagePath) {
                    const oldFilePath = path.join(__dirname, '../../UI/public', tool.imagePath);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
                updateData.imagePath = `/tools/${req.file.filename}`;
            }

            const updatedTool = await Tool.findByIdAndUpdate(
                req.params.id,
                updateData,
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
    }
];

// Delete tool
exports.deleteTool = async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({
                error: 'Tool not found',
                id: req.params.id
            });
        }

        // Xóa file ảnh nếu tồn tại
        if (tool.imagePath) {
            const filePath = path.join(__dirname, '../../UI/public', tool.imagePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Tool.findByIdAndDelete(req.params.id);

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

// Search tools
exports.searchTools = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        
        if (type) {
            // Tìm kiếm không phân biệt hoa thường và một phần của type
            query['config.type'] = new RegExp(type, 'i');
        }

        const tools = await Tool.find(query);
        
        res.status(200).json({
            tools: tools,
            count: tools.length,
            query: {
                type: type || 'all'
            }
        });
    } catch (error) {
        console.error('Error searching tools:', error);
        res.status(500).json({
            error: 'Error searching tools',
            message: error.message
        });
    }
};
