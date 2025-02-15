const {SuperAdminQuestion} = require("../models/superadmin-question");
const mongoose = require('mongoose');
console.log("Model:", SuperAdminQuestion);

// Fetch all questions
exports.getQuestions = async (req, res) => {
    try {
        const questions = await SuperAdminQuestion.find()
            .populate("userId", "name image username isAdmin email")
            .populate("answers.userId", "name username image isAdmin")
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions", error });
    }
};
  
exports.getQuestionsByUser = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from request parameters
        const questions = await SuperAdminQuestion.find({ userId }) // Filter questions by userId
            .sort({ createdAt: -1 })
            .populate("userId", "name image username isAdmin email") // Populate user details for the question
            .populate("answers.userId", "name username image isAdmin"); // Populate user details for answers
        res.json(questions); // Return the filtered questions
    } catch (error) {
        res.status(500).json({ message: "Error fetching user's questions", error });
    }
};

// Add a new question
exports.addQuestion = async (req, res) => {
    try {
        const { question, userId } = req.body; // Extract userId

        const objectUserId = mongoose.Types.ObjectId(userId);
        
        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId format" });
        }

        // Prepare question data
        const questionData = {
            userId: mongoose.Types.ObjectId(userId),
            question,
        };

        const newQuestion = new SuperAdminQuestion(questionData);
        await newQuestion.save();
        res.json(newQuestion);
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ message: "Error adding question", error });
    }
};
  
// Add an answer to a question
exports.addAnswer = async (req, res) => {
    try {
        const { text, userId } = req.body; // Extract userId
        const question = await SuperAdminQuestion.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        question.answers.push({ text, userId }); // Include userId in the answer
        await question.save();
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: "Error adding answer", error });
    }
};

// Edit a reply by ID
exports.editQuestion = async (req, res) => {
    const { questionId } = req.params;
    const { repliedBySuperadmin } = req.body;
    try {
        const question = await SuperAdminQuestion.findByIdAndUpdate(
            questionId,
            { repliedBySuperadmin: repliedBySuperadmin },
            { new: true }
        );
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        await question.save();
        res.json(question);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};