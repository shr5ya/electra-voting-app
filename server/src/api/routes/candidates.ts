import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import Candidate from '../../models/Candidate';
import Election from '../../models/Election';
import { authenticateUser, authorizeAdmin } from '../../middleware/auth';

const router = Router();

// Create Candidate
router.post('/', authenticateUser, authorizeAdmin, [
  body('name').notEmpty().withMessage('Name is required'),
  body('election').isMongoId().withMessage('Valid election ID required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, election } = req.body;
    const candidate = new Candidate({ name, election });
    await candidate.save();
    // Add candidate to election
    await Election.findByIdAndUpdate(election, { $push: { candidates: candidate._id } });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Get all candidates
router.get('/', authenticateUser, async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('election');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Get candidate by ID
router.get('/:id', authenticateUser, [
  param('id').isMongoId().withMessage('Valid candidate ID required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const candidate = await Candidate.findById(req.params.id).populate('election');
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Update candidate
router.put('/:id', authenticateUser, authorizeAdmin, [
  param('id').isMongoId().withMessage('Valid candidate ID required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Delete candidate
router.delete('/:id', authenticateUser, authorizeAdmin, [
  param('id').isMongoId().withMessage('Valid candidate ID required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    // Remove candidate from election
    await Election.findByIdAndUpdate(candidate.election, { $pull: { candidates: candidate._id } });
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router; 