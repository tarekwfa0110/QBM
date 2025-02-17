import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find().sort('-createdAt');
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
