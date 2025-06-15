import { rest } from 'msw';

// Initial test data
const initialQuestions = [
  {
    id: 1,
    prompt: "lorem testum 1",
    answers: ["answer 1", "answer 2", "answer 3", "answer 4"],
    correctIndex: 0
  },
  {
    id: 2,
    prompt: "lorem testum 2",
    answers: ["answer 1", "answer 2", "answer 3", "answer 4"],
    correctIndex: 1
  }
];

let questions = [...initialQuestions];

export const handlers = [
  // GET all questions
  rest.get('http://localhost:4000/questions', (req, res, ctx) => {
    return res(ctx.json(questions));
  }),

  // POST new question
  rest.post('http://localhost:4000/questions', (req, res, ctx) => {
    const newQuestion = {
      id: Math.max(...questions.map(q => q.id)) + 1,
      prompt: req.body.prompt,
      answers: req.body.answers,
      correctIndex: parseInt(req.body.correctIndex)
    };
    questions.push(newQuestion);
    return res(ctx.json(newQuestion));
  }),

  // DELETE question
  rest.delete('http://localhost:4000/questions/:id', (req, res, ctx) => {
    const { id } = req.params;
    questions = questions.filter(q => q.id !== parseInt(id));
    return res(ctx.status(200));
  }),

  // PATCH (update) question
  rest.patch('http://localhost:4000/questions/:id', (req, res, ctx) => {
    const { id } = req.params;
    const question = questions.find(q => q.id === parseInt(id));
    if (question) {
      question.correctIndex = parseInt(req.body.correctIndex);
    }
    return res(ctx.json(question || {}));
  }),

  // Reset endpoint for tests
  rest.get('http://localhost:4000/reset', (req, res, ctx) => {
    questions = [...initialQuestions];
    return res(ctx.status(200));
  })
];