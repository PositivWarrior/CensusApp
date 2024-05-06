// public/javascripts/auth.js

const fs = require('fs');
const basicAuth = require('express-basic-auth');

function getAdminCredentials() {
    const path = './participants.json';
    try {
        const data = fs.readFileSync(path, 'utf8');
        const adminData = JSON.parse(data).admin;
        console.log('Admin credentials loaded:', adminData);
        return { [adminData.login]: adminData.password };
    } catch (error) {
        console.error('Failed to read admin credentials from', path, error);
        return {};
    }
}

const auth = basicAuth({
    users: getAdminCredentials(),
    challenge: true,
    realm: 'CensusApp',
    authorizeAsync: false, 
});

module.exports = auth;