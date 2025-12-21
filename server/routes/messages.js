const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/message');

const router = express.Router();

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const createMessage = async (req, res) => {
    const message = req.body;
    const newMessage = new Message(message);

    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const deleteMessage = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No message with that id');

    await Message.findByIdAndDelete(id);

    res.json({ message: 'Message deleted successfully' });
}

router.get('/', getMessages);
router.post('/', createMessage);
router.delete('/:id', deleteMessage);

module.exports = router;
