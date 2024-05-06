// routes/participants.js

const express = require('express');
const router = express.Router();
const auth = require('../auth');
const fs = require('fs');

// Global Object Variable to store participants data
const participants = {};


router.get('/', auth, (req, res, next) => {
    res.status(200).json(participants);
});

router.post('/add', auth, (req, res, next) => {
    const {email, firstname, lastname, dob, work, home} = req.body;

    // Input Validation
    if(!email || !firstname || !lastname || !dob || !work || !home || !work.companyname || !work.salary || !work.currency || !home.country || !home.city) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    // Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate Date of Birth Format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dob) || isNaN(new Date(dob).getTime())) {
        return res.status(400).json({ error: 'Invalid date of birth format. Use YYYY-MM-DD' });
    }

    // Check if participant already exists
    if(participants[email]) {
        return res.status(409).json({error: 'Participant already exists'});
    }

    // Add participant
    participants[email] = {
        email,
        firstname,
        lastname,
        dob,
        work: {
            companyname: work.companyname,
            salary: work.salary,
            currency: work.currency
        },
        home: {
            country: home.country,
            city: home.city
        }
    };
    res.status(201).json({message: 'Participant added successfully'});
});

router.get('/details', auth, (req, res, next) => {
    const {email} = req.query;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    res.status(200).json(participants[email]);
});

router.get('/details/:email', auth, (req, res, next) => {
    const {email} = req.params;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    res.status(200).json(participants[email]);
})

router.get('/work/:email', auth, (req, res, next) => {
    const {email} = req.params;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    res.status(200).json(participants[email].work);
});

router.get('/home/:email', auth, (req, res, next) => {
    const {email} = req.params;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    res.status(200).json(participants[email].home);
})

router.delete('/:email', auth, (req, res, next) => {
    const {email} = req.params;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    delete participants[email];
    res.status(200).json({message: 'Participant deleted successfully'});
});

router.put('/:email', auth, (req, res, next) => {
    const {email} = req.params;
    const {firstname, lastname, dob, work, home} = req.body;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    participants[email] = {email, firstname, lastname, dob, work, home};
    res.status(200).json({message: 'Participant updated successfully'});
});

module.exports = router;