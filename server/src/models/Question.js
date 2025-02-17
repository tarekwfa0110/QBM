import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: String,
    pdfSource: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Question', QuestionSchema);
