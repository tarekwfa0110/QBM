import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import Question from '../models/Question.js';

const router = express.Router();

// Configure multer to store files in uploads directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create uploads directory if it doesn't exist
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log('File uploaded:', req.file);
        console.log('File path:', req.file.path);

        const pythonProcess = spawn('python', [
            path.join(process.cwd(), 'src', 'utils', 'pdfProcessor.py'),
            req.file.path
        ]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
            console.log('Python stdout:', data.toString());
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
            console.log('Python stderr:', data.toString());
        });

        pythonProcess.on('close', async (code) => {
            console.log('Python process exited with code:', code);
            try {
                if (code !== 0 || errorString) {
                    throw new Error(errorString || 'PDF processing failed');
                }

                const questions = JSON.parse(dataString.trim());
                await Question.insertMany(questions);
                res.json({ success: true, count: questions.length });
            } catch (error) {
                res.status(500).json({ error: error.message });
            } finally {
                // Clean up uploaded file
                await fs.remove(req.file.path);
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 