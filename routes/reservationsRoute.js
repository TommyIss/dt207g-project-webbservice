/**
 * Route för att boka ett bord och skicka ett bekräftelse mejl
 */
let express = require('express');
let router = express.Router();
let nodemailer = require('nodemailer');
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

// Skapa mejltransport
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tois2401@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
});

// Hämta reservationer
router.get('/reservations', async(req, res) => {
    
    await client.query(`SELECT * FROM reservations;`, (err, result) => {
        if(err) {
            res.status(500).json({ error: 'Något har gått fel: ' + err});
            return;
        }

        if(!result.rows || result.rows.length === 0) {
            res.status(404).json({ message: 'Inga reservationer hittades'});
            return;
        }

        res.json(result.rows);
    });
});

router.get('/reservations/:id', async(req, res) => {
    let id = req.params.id;

    await client.query(`SELECT * FROM reservations WHERE id=$1;`, [id], (err, result) => {
        if(err) {
            res.status(500).json({ error: 'Något har gått fel: ' + err});
            return;
        }

        if(!result.rows || result.rows.length === 0) {
            res.status(404).json({ message: 'Inga reservationer hittades'});
            return;
        }

        res.json(result.rows[0]);
    });
});



// Skapa reservation
router.post('/reservations', async (req, res) => {
    let { guest_name, phone, email, guests_number, reservation_date, reservation_time } = req.body;

    let errors = {
        message: '',
        details: '',
        http_response: {

        }
    }

    if(!guest_name) {
        errors.message = 'Gästnamn saknas';
        errors.details = 'Du måste fylla gästens namn';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!phone) {
        errors.message = 'Mobilsnummer saknas';
        errors.details = 'Du måste fylla mobilsnummer';
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
    } else if(!guests_number) {
        errors.message = 'Antal gäster saknas';
        errors.details = 'Du måste fylla antal gäster';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!reservation_date) {
        errors.message = 'Reservationsdatum saknas';
        errors.details = 'Du måste fylla reservationsdatum';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!reservation_time) {
        errors.message = 'Reservationstid saknas';
        errors.details = 'Du måste fylla reservationstid';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    }

    await client.query(`INSERT INTO reservations (guest_name, phone, email, guests_number, reservation_date, reservation_time)VALUES($1, $2, $3, $4, $5, $6);`, [guest_name, phone, email, guests_number, reservation_date, reservation_time], (err, result) => {
        if(err) {
            res.status(500).json({ error: 'Något har gått fel: ' + err});
            return;
        }

        console.log('Frågan har skapat: ' + result);

        // Bekräftelse mejl
        let mailOptions = {
            from: 'tois2401@hotmail.com',
            to: email,
            subject: 'Bekräftelse på din reservation',
            text: `Hej ${guest_name}, \n\nTack för din bokning!\n\nGästnamn: ${guest_name}.\nMobilnummer: ${phone}.\nE-post: ${email}.\nAntal gäster: ${guests_number}.\nDatum: ${reservation_date}.\nTid: ${reservation_time}.\n\nKlicka på länken om du vill ändra/avboka reservationen!\n\nVänliga hälsningar\nt&m Deli`
        };

        transport.sendMail(mailOptions);
        res.status(200).json({message: 'Reservation har skapats och ett bekräftelse mejl har skickats.', reservation: result.rows});
    });
});

// Ändra reservation
router.put('/reservations/:id', async (req, res) => {
    let { guest_name, phone, email, guests_number, reservation_date, reservation_time } = req.body;
    let id = req.params.id;

    let errors = {
        message: '',
        details: '',
        http_response: {

        }
    }

    if(!guest_name) {
        errors.message = 'Gästnamn saknas';
        errors.details = 'Du måste fylla gästens namn';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!phone) {
        errors.message = 'Mobilsnummer saknas';
        errors.details = 'Du måste fylla mobilsnummer';
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
    } else if(!guests_number) {
        errors.message = 'Antal gäster saknas';
        errors.details = 'Du måste fylla antal gäster';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!reservation_date) {
        errors.message = 'Reservationsdatum saknas';
        errors.details = 'Du måste fylla reservationsdatum';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    } else if(!reservation_time) {
        errors.message = 'Reservationstid saknas';
        errors.details = 'Du måste fylla reservationstid';
        errors.http_response.message = 'Bad Request';
        errors.http_response.code = 400;

        res.status(400).json(errors);

        return;
    }

    await client.query(`SELECT * FROM reservations WHERE id=$1;`, [id], (err, result) => {
        if(err) {
            res.status(500).json({ error: 'Något har gått fel: ' + err});
            return;
        }

        if(!result.rows || result.rows.length === 0) {
            res.status(404).json({ message: 'Inga reservationer hittades'});
            return;
        }

        
        let previousReservation = result.rows[0];
        // SQL-fråga för uppdatering
        client.query(`UPDATE reservations SET guests_number=$1, reservation_date=$2, reservation_time=$3 WHERE id=$4;`, [ guests_number, reservation_date, reservation_time, id], (err, result) => {
            if(err) {
                res.status(500).json({ error: 'Något har gått fel: ' + err});
                return;
            }

            console.log('Frågan har skapat: ' + result);

            // Bekräftelse mejl
            let mailOptions = {
                from: 'tois2401@hotmail.com',
                to: email,
                subject: 'Bekräftelse på din ändring',
                text: `Hej ${previousReservation.guest_name}, \n\nTack för din bokning!\n\nHär kommer din nya uppgifter\nAntal gäster: ${guests_number}.\nDatum: ${reservation_date}.\nTid: ${reservation_time}.\n\nVänliga hälsningar\nt&m Deli`
            };

            transport.sendMail(mailOptions);
            res.status(200).json({message: 'Reservation har ändrats och ett bekräftelse mejl har skickats.', reservation: result.rows});
        });
    });
    
});

// Avboka reservation
router.delete('/reservations/:id', async(req, res) => {
    let id = req.params.id;

    await client.query(`SELECT * FROM reservations WHERE id=$1`, [id], (err, result) => {
        if(err) {
            res.status(500).json({error: 'Något har inträffat ' + err});
            return;
        }

        if(!result.rows || result.rows.length === 0) {
            res.status(404).json({message: 'Inga resor är tillagda'});
            return;
        }

        // Bekräftelse mejl
        let mailOptions = {
            from: 'tois2401@hotmail.com',
            to: result.rows[0].email,
            subject: 'Bekräftelse på avbokning',
            text: `Hej ${result.rows[0].guest_name}, \n\nDin reservation ${result.rows[0].reservation_date} kl.${result.rows[0].reservation_time}, har avbokats!\n\nVänliga hälsningar\nt&m Deli`
        };
        
        client.query(`DELETE FROM reservations WHERE id=$1`, [id], (err, result) => {
            if(err) {
                res.status(500).json({error: 'Något har inträffat ' + err});
                return;
            }

            console.log('Frågan har skapat: ' + result);

            

            transport.sendMail(mailOptions);
            res.status(200).json({message: `Reservation med id:${id} har avbokats`});
        });
    });
    
});

module.exports = router;