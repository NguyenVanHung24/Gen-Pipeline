const mongoose = require('mongoose');

const PipelineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tools: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool'
    }],
    platform: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Platform',
        required: true
    },
    language: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        required: true,
        enum: ['Secret Scanning', 'Software Composition Analysis', 'Static Application Security Testing', 'Dynamic Application Security Testing', 'Container Security', 'Infrastructure as Code Scan', 'Vulnerability Management']
    },
    version: {
        type: String,
        required: true
    },
    yaml_content: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Pipeline', PipelineSchema);