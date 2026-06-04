const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    skillGaps: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    jobMatchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    jobDescription: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      default: 'General / Professional',
    },
    experienceLevel: {
      type: String,
      default: 'Mid Level',
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    skillsMatchPercentage: {
      type: Number,
      default: 0,
    },
    optimizedBullets: [
      {
        before: String,
        after: String,
        rationale: String,
      }
    ],
    domainVerbs: {
      type: [String],
      default: [],
    },
    domainMetrics: {
      type: [String],
      default: [],
    },
    formattingTips: {
      type: [String],
      default: [],
    },
    experienceAdvice: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analysis', analysisSchema);
