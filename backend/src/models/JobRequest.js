const mongoose = require('mongoose');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const jobRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    location: { type: String, trim: true },
    contactName: { type: String, trim: true },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator(value) {
          if (!value) return true;
          return EMAIL_REGEX.test(value);
        },
        message: 'Invalid email format',
      },
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'jobRequests',
  }
);

module.exports = mongoose.model('JobRequest', jobRequestSchema);
