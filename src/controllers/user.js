//Imports
const User = require('../models/user');
const Token = require('../models/token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Register User
const registerUser = async (req, res) => {
    try {
        await User.findOne({ email: req.body.email })
            .then(async (result) => {
                if (result) return res.status(400).send('Email is already in use.');

                //Encrypt
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(req.body.password, salt);

                //Create User
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword
                })

                await user.save()
                    .then((result) => {
                        res.status(201).json({ message: 'Registration successful', user: result });
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json({ error: 'An error occurred during registration.' });
                    })
            })
    }
    catch (error) {
        console.error(error);
    }
}

// Login User
const loginUser = async (req, res) => {
    User.findOne({ email: req.body.email })
        .then(async (result) => {
            if (result === null) {
                return res.status(400).send('User not registered.');
            }
            const userObject = result.toObject();
            // Use bcrypt.compare to compare hashed password
            const passwordMatch = await bcrypt.compare(req.body.password, userObject.password);
            if (passwordMatch) {
                //Token
                const accessToken = generateAccessToken(userObject)
                const refreshToken = jwt.sign(userObject, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })
                const token = new Token({
                    refresh_token: refreshToken
                })
                token.save()

                res.json({ accessToken: accessToken, refreshToken: refreshToken })
            } else {
                // Incorrect credentials
                res.status(400).send('Incorrect credentials');
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Server Error');
        });
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}

// app.delete('/logout', (req, res) => {
//     Token.findOneAndDelete({ refresh_token: req.body.token })
//         .then(() => {
//             res.status(204).send();
//         })
//         .catch((error) => {
//             console.error(error);
//             res.status(500).send();
//         });
// })

module.exports = {
    registerUser,
    loginUser
};
