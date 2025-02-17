import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import Question from '../models/Question.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const pythonProcess = spawn('python3', [
            'src/utils/pdfProcessor.py',
            req.file.path
        ]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            try {
                // Cleanup the uploaded file
                await fs.remove(req.file.path);

                if (code !== 0 || errorString) {
                    throw new Error(errorString || 'PDF processing failed');
                }

                const questions = JSON.parse(dataString);
                if (!Array.isArray(questions)) {
                    throw new Error("Invalid question data format");
                }

                const questionsWithSource = questions.map(q => ({
                    ...q,
                    pdfSource: req.file.originalname,
                }));

                await Question.insertMany(questionsWithSource);
                res.json({ success: true, count: questions.length });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 