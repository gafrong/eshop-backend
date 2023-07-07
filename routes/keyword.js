const express = require('express');
const router = express.Router();
const {Keyword} = require('../models/keyword');
const mongoose = require('mongoose');

router.post('/:id', async (req, res) => {
    console.log('REQ BODY', req.body);
    const objUserId = mongoose.Types.ObjectId(req.body.userId);

    let keyword = new Keyword({
        keyword: req.body.keyword,
        user: objUserId
    })

    keyword = await keyword.save();

    if(!keyword)
    return res.status(500).send('The keyword cannot be created')

    res.send(keyword);
});

router.get('/keywords', async (req, res) => {
    try {
        // Fetch all keywords from the database
        const keywords = await Keyword.find();
    
        res.json(keywords);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/keywords', async (req, res) => {
    try {
        // Delete all keywords from the database
        await Keyword.deleteMany();
    
        res.json({ message: 'All keywords have been deleted' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;