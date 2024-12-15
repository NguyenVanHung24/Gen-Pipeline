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
    config: {
        type: Object,
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('Tool', ToolSchema);