/**
 * Webbtjänst
 */
let express = require('express');
let cors = require('cors');
let mealsRoute = require('./routes/mealsRoute');
require('dotenv').config();

let app = express();
let port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', mealsRoute);


app.listen(port, () => {
    console.log('Server körs på port: ' + port);
});