/**
 * Route för drycker
 */
let express = require('express');
let router = express.Router();
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
    if(err){
        console.log('Fel vid ansultning: ' + err);
    } else {
        console.log('Ansluten till databas');
    }
});

// Routing
router.get('/drinks', async(req, res) => {

    // Hämta alla drycker
    client.query(`SELECT * FROM drinks;`, (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något har gått fel: ' + err});
            return;
        }
        if(!result.rows || result.rows.length === 0) {
            res.status(404).json({message: 'Inga drycker hittades'});
            return;
        }

        res.json(result.rows);
    });
});

// Hämta en dryck med spesifik id
router.get('/drinks/:id', async(req, res) => {
    let id = req.params.id;

    // Hämta en dryck
    client.query(`SELECT * FROM drinks WHERE id=$1;`, [id], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något har gått fel: ' + err});
            return;
        }
        if(!result.rows || result.rows.length === 0) {
            res.status(404).json({message: 'Inga drycker hittades'});
            return;
        }

        res.json(result.rows[0]);
    });
});

// Lägga till ny dryck
router.post('/drinks', async(req, res) => {
    let { drink_name, price } = req.body;

    let errors = {
        message: '',
        details: '',
        http_response: {

        }
    }

    if(!drink_name) {
        errors.message = 'Drycksnamn saknas';
        errors.details = 'Du måste fylla namn på dryck';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;

    } else if(!price) {
        errors.message = 'Drycks pris saknas';
        errors.details = 'Du måste fylla pris av dryck';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    }

    await client.query(`INSERT INTO drinks(drink_name, price)VALUES($1, $2)`, [drink_name, price], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något har gått fel: ' + err});
            return;
        }

        console.log('Frågan har skapats: ' + result);

        res.status(200).json({message: 'Dryck har tillagts', drink: result.rows});
    });
});

// Uppdatera dryck
router.put('/drinks/:id', async (req, res) => {
    let id = req.params.id;
    let { drink_name, price } = req.body;

    let errors = {
        message: '',
        details: '',
        http_response: {

        }
    }

    if(!drink_name) {
        errors.message = 'Drycksnamn saknas';
        errors.details = 'Du måste fylla namn på dryck';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!price) {
        errors.message = 'Drycks pris saknas';
        errors.details = 'Du måste fylla pris av dryck';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    }

    client.query(`UPDATE drinks SET drink_name=$1, price=$2 WHERE id=$3`, [drink_name, price, id], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något fel har inträffat: ' + err});
            return;
        }

        console.log('Frågan har skapats: ' + result);

        res.status(200).json({message: `Dryck med id:${id} har uppdaterats`});
    });
});

// Radera dryck
router.delete('/drinks/:id', async(req, res) => {
    let id = req.params.id;

    client.query(`DELETE FROM drinks WHERE id=$1`, [id], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något har inträffat ' + err});
            return;
        }

        console.log('Frågan har skapat: ' + result);

        res.status(200).json({message: `Dryck med id:${id} har raderats`});
    });
});

module.exports = router;