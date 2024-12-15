const mongoose = require('mongoose');

const PlatformSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    supported_languages: [{
        type: String,
        required: true
    }],
    config: {
        type: Object,
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('Platform', PlatformSchema);