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