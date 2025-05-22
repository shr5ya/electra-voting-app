import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Vote from '../../models/Vote';
import Candidate from '../../models/Candidate';
import Election from '../../models/Election';
import { authenticateUser } from '../../middleware/auth';

const router = Router();

// Record a vote
router.post('/', authenticateUser, [
  body('candidate').isMongoId().withMessage('Valid candidate ID required'),
  body('election').isMongoId().withMessage('Valid election ID required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const userId = req.user.id;
    const { candidate, election } = req.body;
    // Check if election exists
    const electionDoc = await Election.findById(election);
    if (!electionDoc) return res.status(404).json({ message: 'Election not found' });
    // Check if candidate exists and belongs to election
    const candidateDoc = await Candidate.findOne({ _id: candidate, election });
    if (!candidateDoc) return res.status(404).json({ message: 'Candidate not found in this election' });
    // Prevent duplicate votes
    const existingVote = await Vote.findOne({ user: userId, election });
    if (existingVote) return res.status(400).json({ message: 'User has already voted in this election' });
    // Record vote
    const vote = new Vote({ user: userId, candidate, election });
    await vote.save();
    // Increment candidate's vote count
    candidateDoc.voteCount += 1;
    await candidateDoc.save();
    res.status(201).json({ message: 'Vote recorded', vote });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router; 