import express from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
  getNoteById,
  getStatistics,
  toggleFavorite,
  toggleArchive,
  getTagStatistics,
  getActivity,
  getDetailedStatistics
} from '../controllers/noteController.js';

const router = express.Router();

// Note CRUD routes
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

// Special actions
router.patch('/:id/favorite', toggleFavorite);
router.patch('/:id/archive', toggleArchive);

// Statistics routes
router.get('/stats/overview', getStatistics);
router.get('/stats/tags', getTagStatistics);
router.get('/stats/activity', getActivity);
router.get('/stats/detailed', getDetailedStatistics);

export default router;