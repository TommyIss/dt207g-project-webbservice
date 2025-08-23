/**
 * Webbtjänst
 */
let express = require('express');
let cors = require('cors');
let jwt = require('jsonwebtoken');
let mealsRoute = require('./routes/mealsRoute');
let drinksRoute = require('./routes/drinksRoute');
let authRoute = require('./routes/authRoute');
let reservationsRoute = require('./routes/reservationsRoute');
require('dotenv').config();

let app = express();
let port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', mealsRoute);

app.use('', drinksRoute);

app.use('/', authRoute);

app.use('/', reservationsRoute);

// Funktion för varifiera jwt-token
let verifyToken = (req, res, next) => {
    let authHeader = req.headers['authorization'];
    let token = authHeader?.split(' ')[1];

    if(!token) {
        res.status(403).json({ error: 'Ingen token angiven'});
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err) {
            res.status(403).json({ error: 'Ogiltig token'});
            return;
        }
        req.user = user;
        next();
    });
};

// Skyddad route
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Du är autentiserad', user: req.user});
});

app.listen(port, () => {
    console.log('Server körs på port: ' + port);
});