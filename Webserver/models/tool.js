const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    version: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        default: ''
    },
    config: {
        type: Object,
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('Tool', ToolSchema);