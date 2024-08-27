const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');
const auth = require('../middleware/authenticate');
// Create Quiz
router.post('/', async (req, res) => {
  const { title, description, questions } = req.body;
  try {
    const quiz = new Quiz({ title, description, questions });
    await quiz.save();
    res.status(201).send(quiz);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read Quiz
router.get('/', async (req, res) => {
  try {
    if(auth.checkRoleAdmin(req.user)) {
      const quizzes = await Quiz.find().populate('questions');
      res.status(200).send(quizzes);
    } else {
      res.status(200).send("Forbidden");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update Quiz
router.put('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) {
      return res.status(404).send();
    }
    res.send(quiz);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete Quiz
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).send();
    }
    res.send(quiz);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
