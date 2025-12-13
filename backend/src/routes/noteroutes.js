import express from 'express';
import { createNote, deleteNote, getAllNotes, updateNote, getAllNotesById } from '../controllers/notecontroller.js';

const router = express.Router(); 
router.get('/',getAllNotes);
router.get('/:id',getAllNotesById)
router.post('/', createNote );
router.put('/:id',updateNote);
router.delete('/:id', deleteNote);

export default router;