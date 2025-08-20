/**
 * Autentisering route
 */
let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let { Client } = require('pg');
require('dotenv').config();

// Anslut till databas
let client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect((err) => {
    if(err) {
        console.log('Fel vid anslutning till databas: ' + err);
    } else {
        console.log('Ansluten till databas');
    }
});

// Skapa ett konto
router.post('/register', async(req, res) => {
    let { username, email, password} = req.body;

    let errors = {
        message: '',
        details: '',
        http_response: {

        }
    };

    if(!username) {
        errors.message = 'Användarnamn saknas';
        errors.details = 'Du måste fylla användanamn';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;
        res.status(400).json(errors);
        return;
    } else if(!email) {
        errors.message = 'E-post saknas';
        errors.details = 'Du måste fylla e-post';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;
        res.status(400).json(errors);
        return;
    } else if(!password) {
        errors.message = 'Lösenord saknas';
        errors.details = 'Du måste fylla lösenord';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;
        res.status(400).json(errors);
        return;
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    
    await client.query(`INSERT INTO users (username, email, password)VALUES($1, $2, $3);`, [username, email, hashedPassword], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Fel vid registrering: ' + err});
            return;
        }

        res.status(200).json({ message: 'Användaren skapppad', user: result.rows[0]});
    });

});

router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    let errors = {
        message: '',
        details: '',
        http_response: {

        }
    };

    

    try {
        if(!email) {
            errors.message = 'E-post saknas';
            errors.details = 'Du måste fylla e-post';
            errors.http_response.message = 'Bad Request';
            errors.http_response.code = 400;
            res.status(400).json(errors);
            return;
        } else if(!password) {
            errors.message = 'Lösenord saknas';
            errors.details = 'Du måste fylla lösenord';
            errors.http_response.message = 'Bad Request';
            errors.http_response.code = 400;
            res.status(400).json(errors);
            return;
        }
        let result = await client.query(`SELECT * FROM users WHERE email=$1`, [email]);
        let user = result.rows[0];

        if(!user) {
            res.status(401).json({ error: 'Felaktig e-post eller lösenord' });
            return;
        }

        let match = await bcrypt.compare(password, user.password);
        if(!match) {
            res.status(401).json({ error: 'Felaktig e-post eller lösenord'});
            return;
        }

        let token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        });

        res.json({ message: 'Inloggning har lyckats', token });
    } catch (error) {
        res.status(500).json({ error: 'Fel vid inloggning: ' + err});
    }
    
});

module.exports = router;