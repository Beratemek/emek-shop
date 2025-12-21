const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');

const router = express.Router();

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { phone, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user with that id');

    // Only update allowed fields
    const updatedUser = await User.findByIdAndUpdate(id, { phone, address }, { new: true });

    res.json(updatedUser);
}

router.patch('/:id', updateUser);

module.exports = router;
