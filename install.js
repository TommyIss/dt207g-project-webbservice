/**
 * Installation-fil för tabell i databas
 */
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

client.query(`
    DROP TABLE IF EXISTS meals;
    CREATE TABLE meals(
        id SERIAL PRIMARY KEY,
        meal_name TEXT,
        meal_type TEXT,
        ingredients JSONB,
        price DECIMAL(6, 2),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

client.query(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );    
`);

