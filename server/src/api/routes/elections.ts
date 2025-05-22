import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import Election from '../../models/Election';
import { authenticateUser, authorizeAdmin } from '../../middleware/auth';

const router = Router();

// Create Election
router.post('/', authenticateUser, authorizeAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('startDate').isISO8601().toDate().withMessage('Valid start date required'),
  body('endDate').isISO8601().toDate().withMessage('Valid end date required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, startDate, endDate } = req.body;
    const election = new Election({ title, description, startDate, endDate });
    await election.save();
    res.status(201).json(election);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Get all elections
router.get('/', authenticateUser, async (req, res) => {
  try {
    const elections = await Election.find().populate('candidates');
    res.json(elections);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Get election by ID
router.get('/:id', authenticateUser, [
  param('id').isMongoId().withMessage('Valid election ID required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const election = await Election.findById(req.params.id).populate('candidates');
    if (!election) return res.status(404).json({ message: 'Election not found' });
    res.json(election);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Update election
router.put('/:id', authenticateUser, authorizeAdmin, [
  param('id').isMongoId().withMessage('Valid election ID required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!election) return res.status(404).json({ message: 'Election not found' });
    res.json(election);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Delete election
router.delete('/:id', authenticateUser, authorizeAdmin, [
  param('id').isMongoId().withMessage('Valid election ID required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    res.json({ message: 'Election deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Get candidates for a specific election
router.get('/:id/candidates', authenticateUser, [
  param('id').isMongoId().withMessage('Valid election ID required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const election = await Election.findById(req.params.id).populate('candidates');
    if (!election) return res.status(404).json({ message: 'Election not found' });
    res.json(election.candidates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router; 