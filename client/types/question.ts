export type Question = {
  _id: string;
  question: string;
  options: string[];
  answer: string;
  pdfSource: string;
  createdAt: string;
};

export type QuestionsResponse = Question[];