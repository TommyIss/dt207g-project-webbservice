/**
 * Route för maträtter
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
router.get('/meals', async(req, res) => {

    // Hämta alla maträtter
    client.query(`SELECT * FROM meals;`, (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något har gått fel: ' + err});
            return;
        }
        if(!result.rows || result.rows.length === 0) {
            res.status(404).json({message: 'Inga matträtter hittades'});
            return;
        }

        res.json(result.rows);
    });
});

// Hämta maträtter med spesifik typ
router.get('/meals/type/:type', async(req, res) => {
    let mealType = req.params.type;

    // Hämta alla maträtter
    client.query(`SELECT * FROM meals WHERE meal_type ILIKE $1 ORDER BY id asc;`, [mealType], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något har gått fel: ' + err});
            return;
        }
        if(!result.rows || result.rows.length === 0) {
            res.status(404).json({message: 'Inga matträtter hittades'});
            return;
        }

        res.json(result.rows);
    });
});

// Hämta en maträtt med spesifik id
router.get('/meals/:id', async(req, res) => {
    let id = req.params.id;

    // Hämta alla maträtter
    client.query(`SELECT * FROM meals WHERE id=$1;`, [id], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något har gått fel: ' + err});
            return;
        }
        if(!result.rows || result.rows.length === 0) {
            res.status(404).json({message: 'Inga matträtter hittades'});
            return;
        }

        res.json(result.rows[0]);
    });
});

// Lägga till ny maträtt
router.post('/meals', async(req, res) => {
    let { meal_name, meal_type, ingredients, price } = req.body;

    let errors = {
        message: '',
        details: '',
        http_response: {

        }
    }

    if(!meal_name) {
        errors.message = 'Maträtts benämning saknas';
        errors.details = 'Du måste fylla namn på matträtten';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!meal_type) {
        errors.message = 'Maträtts typ saknas';
        errors.details = 'Du måste fylla typ av matträtten';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!Array.isArray(ingredients) || ingredients.length === 0) {
        errors.message = 'Maträtts ingredienser saknas';
        errors.details = 'Du måste fylla ingredienser av matträtten';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!price) {
        errors.message = 'Maträtts pris saknas';
        errors.details = 'Du måste fylla pris av matträtten';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    }

    await client.query(`INSERT INTO meals(meal_name, meal_type, ingredients, price)VALUES($1, $2, $3::jsonb, $4)`, [meal_name, meal_type, JSON.stringify(ingredients), price], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något har gått fel: ' + err});
            return;
        }

        console.log('Frågan har skapats: ' + result);

        res.status(200).json({message: 'Måltid har tillagts', meal: result.rows});
    });
});

// Uppdatera maträtt
router.put('/meals/:id', async (req, res) => {
    let id = req.params.id;
    let { meal_name, meal_type, ingredients, price } = req.body;

    let errors = {
        message: '',
        details: '',
        http_response: {

        }
    }

    if(!meal_name) {
        errors.message = 'Maträtts benämning saknas';
        errors.details = 'Du måste fylla namn på matträtten';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!meal_type) {
        errors.message = 'Maträtts typ saknas';
        errors.details = 'Du måste fylla typ av matträtten';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!Array.isArray(ingredients) || ingredients.length === 0) {
        errors.message = 'Maträtts ingredienser saknas';
        errors.details = 'Du måste fylla ingredienser av matträtten';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!price) {
        errors.message = 'Maträtts pris saknas';
        errors.details = 'Du måste fylla pris av matträtten';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    }

    client.query(`UPDATE meals SET meal_name=$1, meal_type=$2, ingredients=$3::jsonb, price=$4 WHERE id=$5`, [meal_name, meal_type, JSON.stringify(ingredients), price, id], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något fel har inträffat: ' + err});
            return;
        }

        console.log('Frågan har skapats: ' + result);

        res.status(200).json({message: `Maträtten med id:${id} har uppdaterats`});
    });
});

// Radera maträtt
router.delete('/meals/:id', async(req, res) => {
    let id = req.params.id;

    client.query(`DELETE FROM meals WHERE id=$1`, [id], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något har inträffat ' + err});
            return;
        }

        console.log('Frågan har skapat: ' + result);

        res.status(200).json({message: `Maträtt med id:${id} har raderats`});
    });
});

module.exports = router;