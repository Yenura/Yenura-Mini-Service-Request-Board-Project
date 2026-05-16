const express = require('express');
const JobRequest = require('../models/JobRequest');

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_STATUSES = ['Open', 'In Progress', 'Closed'];

function validateCreateBody(body) {
  const errors = [];
  if (!body.title?.trim()) errors.push('title is required');
  if (!body.description?.trim()) errors.push('description is required');
  if (body.contactEmail && !EMAIL_REGEX.test(body.contactEmail)) {
    errors.push('contactEmail must be a valid email');
  }
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    errors.push('status must be Open, In Progress, or Closed');
  }
  return errors;
}

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Job request not found',
      });
    }
    res.json(job);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const errors = validateCreateBody(req.body);
    if (errors.length) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.join(', '),
      });
    }

    const job = await JobRequest.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      category: req.body.category?.trim(),
      location: req.body.location?.trim(),
      contactName: req.body.contactName?.trim(),
      contactEmail: req.body.contactEmail?.trim(),
      status: req.body.status || 'Open',
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    if (!req.body.status) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'status is required',
      });
    }
    if (!VALID_STATUSES.includes(req.body.status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'status must be Open, In Progress, or Closed',
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Job request not found',
      });
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Job request not found',
      });
    }
    res.json({ message: 'Job request deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
