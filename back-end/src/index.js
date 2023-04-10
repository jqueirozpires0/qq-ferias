const express = require('express')
const app = express();
const routes = require('../src/routes/routes');
const sequelize = require('./conection/dbqq')
cors = require('cors');
const porta = 3000
app.use(express.json())
// import { google } from 'googleapis'

// const auth2Client = new google.auth.OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URL
// )

//---------------------------------------------------CORS--------------------------------------------//
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //aceita todos
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        )
        return res.status(200).send({})
    }
    next()
})

app.use(routes);

app.listen(porta, () => {
    console.log(`execução na porta => ${porta}...`)
})

app.options('*', cors())


// app.get('/google', (req, res) =>{

//     const url = "Oi"
// })