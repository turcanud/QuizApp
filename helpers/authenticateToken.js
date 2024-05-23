require('dotenv').config();
const jwt = require('jsonwebtoken');

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    //console.log(authHeader);
    const token = req.cookies['accessToken'];

    if (token == null) {
        console.log('No token provided');
        return res.status(401).send('No token provided');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).send('Token verification failed');
        }
        req.user = user;
        next();
    });
}

async function authenticateTokenRaw(req, res, next) {
    const authHeader = req.headers['authorization'];
    //console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        console.log('No token provided');
        return res.status(401).send('No token provided');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).send('Token verification failed');
        }
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
    authenticateTokenRaw
}