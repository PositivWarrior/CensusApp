// routes/participants.js

const express = require('express');
const router = express.Router();
const basicAuth = require('express-basic-auth');
const fs = require('fs');

// Define a custom authorizer
function getAdminCredentials() {
    const adminData = JSON.parse(fs.readFileSync('participants.json', 'utf8'));
    return {
        [adminData.admin.login]: adminData.admin.password
    };
}

const auth = basicAuth({
    users: getAdminCredentials(),
    challenge: true, 
    realm: 'CensusApp',
});

// Global Object Variable to store participants data
const participants = {};


router.post('/participants/add', auth, (req, res, next) => {
    const {email, firstname, lastname, dob, work, home} = req.body;

    // Input Validation
    if(!email || !firstname || !lastname || !dob || !work || !home || !work.companyname || !work.salary || !work.currency || !home.country || !home.city) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    // Check if participant already exists
    if(participants[email]) {
        return res.status(409).json({error: 'Participant already exists'});
    }

    // Add participant
    participants[email] = {email, firstname, lastname, dob, work, home};
    res.status(201).json({message: 'Participant added successfully'});
});

router.get('/participants', auth, (req, res, next) => {
    res.status(200).json(participants);
})

router.get('/patricipants/details', auth, (req, res, next) => {
    const {email} = req.query;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    res.status(200).json(participants[email]);
});

router.get('/participants/details/:email', auth, (req, res, next) => {
    const {email} = req.params;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    res.status(200).json(participants[email]);
})

router.get('participants/work/:email', auth, (req, res, next) => {
    const {email} = req.params;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    res.status(200).json(participants[email].work);
});

router.get('participants/home/:email', auth, (req, res, next) => {
    const {email} = req.params;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    res.status(200).json(participants[email].home);
})

router.delete('/participants/:email', auth, (req, res, next) => {
    const {email} = req.params;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    delete participants[email];
    res.status(200).json({message: 'Participant deleted successfully'});
});

router.put('/participants/:email', auth, (req, res, next) => {
    const {email} = req.params;
    const {firstname, lastname, dob, work, home} = req.body;
    if(!participants[email]) {
        return res.status(404).json({error: 'Participant not found'});
    }
    participants[email] = {email, firstname, lastname, dob, work, home};
    res.status(200).json({message: 'Participant updated successfully'});
});

module.exports = router;