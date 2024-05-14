const express = require('express');

const app = express();

// connect to mongoBD
//...

//Private calls
require('dotenv').config();

// Allow json
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Helo")
})

app.use('/user')

app.listen(3000, () => {
    console.log('3000 listening');
})