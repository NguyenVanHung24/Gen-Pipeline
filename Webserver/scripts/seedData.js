const mongoose = require('mongoose');
const Platform = require('../models/Platform');
const Tool = require('../models/Tool');
const Pipeline = require('../models/Pipeline');

const MONGODB_URI = 'mongodb://localhost:27017/your_database';

const platforms = [
  {
    name: "GitHub",
    supported_languages: ["JavaScript", "Python", "Java", "Go", "Ruby"],
    config: {
      api_url: "https://api.github.com",
      webhook_enabled: true,
      scan_frequency: "daily"
    }
  },
  {
    name: "GitLab",
    supported_languages: ["Python", "JavaScript", "Java", "C++"],
    config: {
      api_url: "https://gitlab.com/api/v4",
      webhook_enabled: true,
      scan_frequency: "weekly"
    }
  },
  {
    name: "Bitbucket",
    supported_languages: ["Java", "Python", "JavaScript"],
    config: {
      api_url: "https://api.bitbucket.org/2.0",
      webhook_enabled: false,
      scan_frequency: "monthly"
    }
  }
];

const tools = [
  {
    name: "Git-leak",
    version: "8.15.2",
    config: {
      severity_levels: ["HIGH", "CRITICAL"],
      scan_timeout: 300,
      exclude_patterns: [".env", "*.log"],
      type: "Secret Scanner",
      target: "Git History",
      analytics: 85
    }
  },
  {
    name: "Snyk",
    version: "1.1045.0",
    config: {
      severity_levels: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      auto_fix: true,
      scan_dev_dependencies: true,
      type: "Security Testing",
      target: "Code & Dependencies",
      analytics: 95
    }
  },
  {
    name: "Trivy",
    version: "0.38.3",
    config: {
      severity_levels: ["CRITICAL", "HIGH"],
      scan_timeout: 600,
      ignore_unfixed: true,
      type: "Vulnerability Scanner",
      target: "Container Images",
      analytics: 82
    }
  },
  {
    name: "OWASP ZAP",
    version: "2.12.0",
    config: {
      attack_strength: "HIGH",
      alert_threshold: "MEDIUM",
      spider_timeout: 300,
      type: "Vulnerability Scanner",
      target: "Web Applications",
      analytics: 88
    }
  }
];

// Function to generate YAML content based on tools and platform
const generateYamlContent = (tools, platform, language) => {
  return `
name: Security Scan Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security_scan:
    runs-on: ${platform.name.toLowerCase()}-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up ${language}
        uses: actions/setup-${language.toLowerCase()}@v2
      ${tools.map(tool => `
      - name: Run ${tool.name}
        uses: ${tool.name.toLowerCase()}-action@v${tool.version}
        with:
          severity: ${tool.config.severity_levels.join(',')}
          timeout: ${tool.config.scan_timeout || 300}
      `).join('')}
`;
};

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Platform.deleteMany({});
    await Tool.deleteMany({});
    await Pipeline.deleteMany({});
    console.log('Cleared existing data');

    // Insert platforms and tools
    const insertedPlatforms = await Platform.insertMany(platforms);
    const insertedTools = await Tool.insertMany(tools);
    console.log('Inserted platforms and tools');

    // Create pipelines using the inserted platforms and tools
    const pipelines = [];
    for (const platform of insertedPlatforms) {
      for (const language of platform.supported_languages) {
        // Create multiple pipelines with different tool combinations
        const toolSubsets = [
          insertedTools.slice(0, 2),  // First two tools
          insertedTools.slice(1, 3),  // Second and third tools
          insertedTools.slice(2, 4),  // Third and fourth tools
          insertedTools              // All tools
        ];

        for (const toolSet of toolSubsets) {
          pipelines.push({
            name: `${platform.name}-${language}-${toolSet.length}-tools`,
            tools: toolSet.map(tool => tool._id),
            platform: platform._id,
            language: language,
            yaml_content: generateYamlContent(toolSet, platform, language)
          });
        }
      }
    }

    // Insert pipelines
    await Pipeline.insertMany(pipelines);
    console.log('Successfully seeded pipelines');

    // Log some statistics
    console.log('\nSeeding completed:');
    console.log(`- Platforms: ${insertedPlatforms.length}`);
    console.log(`- Tools: ${insertedTools.length}`);
    console.log(`- Pipelines: ${pipelines.length}`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedData(); 