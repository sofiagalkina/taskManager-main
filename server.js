//import express
var express = require('express');
//create instances
var app = express();
const db = require('./db/connect');
//middleware:
app.use(express.json());


app.use('/', require('./routes'));

db.initDb((error)=>{
    if (error) {
        console.error(error);
        return;
    }

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });

});
