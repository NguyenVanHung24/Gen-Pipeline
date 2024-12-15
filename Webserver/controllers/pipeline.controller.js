const yaml = require('js-yaml');
const Tool = require('../models/Tool');
const Platform = require('../models/Platform');
const Pipeline = require('../models/Pipeline');

exports.generateYaml = async (req, res) => {
    try {
        const { tools, platform, language, name } = req.body;

        // Validate input
        if (!tools || !platform || !language || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Fetch tools and platform
        const selectedTools = await Tool.find({ _id: { $in: tools } });
        const selectedPlatform = await Platform.findById(platform);

        if (!selectedPlatform) {
            return res.status(404).json({ error: 'Platform not found' });
        }

        if (!selectedPlatform.supported_languages.includes(language)) {
            return res.status(400).json({ error: 'Language not supported by selected platform' });
        }

        // Generate YAML
        const pipelineConfig = {
            version: '1.0',
            name: name,
            platform: selectedPlatform.name,
            language: language,
            tools: selectedTools.map(tool => ({
                name: tool.name,
                version: tool.version,
                config: tool.config
            }))
        };

        const yamlContent = yaml.dump(pipelineConfig);

        // Save to database
        const pipeline = new Pipeline({
            name,
            tools,
            platform,
            language,
            yaml_content: yamlContent
        });

        await pipeline.save();

        res.status(200).json({
            message: 'Pipeline generated successfully',
            yaml: yamlContent,
            pipeline: pipeline
        });

    } catch (error) {
        console.error('Error generating pipeline:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/*
To test this API, you can use the following POST request:

POST http://localhost:3000/api/generate-yaml
Content-Type: application/json

{
    "name": "My Pipeline",
    "tools": ["toolId1", "toolId2"],  // Array of Tool document IDs from MongoDB
    "platform": "platformId",          // Platform document ID from MongoDB
    "language": "javascript"           // Must be one of the supported_languages in the platform
}

You can use tools like Postman or curl:

curl -X POST http://localhost:3000/api/generate-yaml \
-H "Content-Type: application/json" \
-d '{
    "name": "My Pipeline",
    "tools": ["toolId1", "toolId2"],
    "platform": "platformId",
    "language": "javascript"
}'

Note: Replace toolId1, toolId2, and platformId with actual MongoDB ObjectIds from your database.
*/

exports.getTools = async (req, res) => {
    try {
        const tools = await Tool.find();
        res.status(200).json(tools);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tools' });
    }
};

exports.getPlatforms = async (req, res) => {
    try {
        const platforms = await Platform.find();
        res.status(200).json(platforms);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching platforms' });
    }
};

exports.searchPipelines = async (req, res) => {
    try {
        const { 
            platform,
            language,
            version,
            stage,
            tool
        } = req.query;
        
        // Build pipeline query
        let pipelineQuery = {};
        let toolQuery = {};
        
        // Platform filter
        if (platform) {
            try {
                const platformDoc = await Platform.findOne({ 
                    name: { $regex: new RegExp(platform, 'i') }
                });
                if (platformDoc) {
                    pipelineQuery.platform = platformDoc._id;
                } else {
                    return res.status(404).json({ 
                        message: 'No platform found with the specified name',
                        criteria: req.query
                    });
                }
            } catch (err) {
                console.error('Error finding platform:', err);
                return res.status(400).json({ 
                    error: 'Invalid platform name',
                    message: err.message 
                });
            }
        }
        
        // Language filter
        if (language) {
            pipelineQuery.language = { 
                $regex: new RegExp(language, 'i')
            };
        }

        // Stage filter
        if (stage) {
            pipelineQuery.stage = stage;
        }

        // Tool filter
        if (tool) {
            try {
                const toolDoc = await Tool.findOne({
                    name: { $regex: new RegExp(tool, 'i') }
                });
                if (toolDoc) {
                    pipelineQuery.tools = toolDoc._id;
                } else {
                    return res.status(404).json({
                        message: 'No tool found with the specified name',
                        criteria: req.query
                    });
                }
            } catch (err) {
                console.error('Error finding tool:', err);
                return res.status(400).json({
                    error: 'Invalid tool name', 
                    message: err.message
                });
            }
        }

        // Version filter (stored in platform config)
        if (version) {
            pipelineQuery['platform.config.version'] = version;
        }

        // Find pipelines with populated references
        const pipelines = await Pipeline.find(pipelineQuery)
            .populate('platform')
            .populate('tools')
            .sort({ createdAt: -1 });

        if (!pipelines.length) {
            return res.status(404).json({ 
                message: 'No pipelines found matching the criteria',
                criteria: req.query
            });
        }

        // Format response
        const formattedPipelines = pipelines.map(pipeline => ({
            id: pipeline._id,
            name: pipeline.name,
            platform: {
                name: pipeline.platform.name,
                supported_languages: pipeline.platform.supported_languages,
                config: pipeline.platform.config
            },
            language: pipeline.language,
            stage: pipeline.stage,
            tools: pipeline.tools.map(tool => ({
                name: tool.name,
                version: tool.version,
                config: tool.config
            })),
            yaml_content: pipeline.yaml_content,
            created_at: pipeline.createdAt,
            updated_at: pipeline.updatedAt
        }));

        res.status(200).json({
            count: pipelines.length,
            pipelines: formattedPipelines
        });

    } catch (error) {
        console.error('Error searching pipelines:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
};

exports.getPipelineById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const pipeline = await Pipeline.findById(id)
            .populate('platform')
            .populate('tools');

        if (!pipeline) {
            return res.status(404).json({ 
                message: 'Pipeline not found',
                pipelineId: id 
            });
        }

        res.status(200).json(pipeline);

    } catch (error) {
        console.error('Error fetching pipeline:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
};

exports.testApi = async (req, res) => {
    console.log('Test API endpoint hit');
    res.json({ message: 'Pipeline API is working' });
};

exports.createPipeline = async (req, res) => {
    try {
        const { name, tools, platform, language, stage, yaml_content } = req.body;

        // Validate required fields
        if (!name || !tools || !platform || !language || !stage || !yaml_content) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['name', 'tools', 'platform', 'language', 'stage', 'yaml_content']
            });
        }

        const pipeline = new Pipeline({
            name,
            tools,
            platform,
            language,
            stage,
            yaml_content
        });

        const savedPipeline = await pipeline.save();
        res.status(201).json(savedPipeline);

    } catch (error) {
        console.error('Error creating pipeline:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

exports.getAllPipelines = async (req, res) => {
    try {
        const pipelines = await Pipeline.find()
            .populate('platform')
            .populate('tools')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: pipelines.length,
            pipelines: pipelines
        });
    } catch (error) {
        console.error('Error fetching pipelines:', error);
        res.status(500).json({
            error: 'Error fetching pipelines',
            message: error.message
        });
    }
};

exports.updatePipeline = async (req, res) => {
    try {
        const { name, tools, platform, language, stage, yaml_content } = req.body;
        
        const pipeline = await Pipeline.findById(req.params.id);
        if (!pipeline) {
            return res.status(404).json({
                error: 'Pipeline not found',
                id: req.params.id
            });
        }

        const updatedPipeline = await Pipeline.findByIdAndUpdate(
            req.params.id,
            {
                name: name || pipeline.name,
                tools: tools || pipeline.tools,
                platform: platform || pipeline.platform,
                language: language || pipeline.language,
                stage: stage || pipeline.stage,
                yaml_content: yaml_content || pipeline.yaml_content
            },
            { new: true }
        ).populate('platform').populate('tools');

        res.status(200).json(updatedPipeline);

    } catch (error) {
        console.error('Error updating pipeline:', error);
        res.status(500).json({
            error: 'Error updating pipeline',
            message: error.message
        });
    }
};

exports.deletePipeline = async (req, res) => {
    try {
        const pipeline = await Pipeline.findByIdAndDelete(req.params.id);
        if (!pipeline) {
            return res.status(404).json({
                error: 'Pipeline not found',
                id: req.params.id
            });
        }
        res.status(200).json({
            message: 'Pipeline deleted successfully',
            pipeline: pipeline
        });
    } catch (error) {
        console.error('Error deleting pipeline:', error);
        res.status(500).json({
            error: 'Error deleting pipeline',
            message: error.message
        });
    }
};