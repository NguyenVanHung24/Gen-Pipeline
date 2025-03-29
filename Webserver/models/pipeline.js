const mongoose = require('mongoose');

const PipelineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tool_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool',
        required: true
    },
    platform: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Platform',
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['Python', 'Java', 'C#', 'JavaScript', 'Go', 'Ruby', 'PHP', 'C/C++', 'Clojure', 'Kotlin', 'Swift', 'Rust', 'TypeScript', 'Scala', 'Haskell', 'Erlang', 'Elixir', 'R', 'Perl', 'Lua', 'Groovy', 'Racket', 'OCaml', 'D', 'Rust', 'TypeScript', 'Scala', 'Haskell', 'Erlang', 'Elixir', 'R', 'Perl', 'Lua', 'Groovy', 'Racket', 'OCaml', 'D']
    },
    stage: {
        type: String,
        required: true,
        enum: ['Secret Scanning', 'Software Composition Analysis', 'Static Application Security Testing', 'Dynamic Application Security Testing', 'Container Security', 'Infrastructure as Code Scan', 'Vulnerability Management']
    },
    version: {
        type: String,
        default: '1.0',
        required: true
    },
    yaml_content: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Pipeline', PipelineSchema);