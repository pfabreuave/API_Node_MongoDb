// config inicial

require('dotenv').config()

const express = require('express')

const app = express()

const mongoose = require('mongoose')


app.use(
    express.urlencoded({
      extended: true,
    }),
  )

  app.use(express.json())

// Rutas 
const personRoutes = require('./routes/personRoutes')

app.use('/person', personRoutes)


// informacion generada en Mongo Atlas
// (pfabreuave; Dani%6162; 201.17.123.43/32)
// mongodb+srv://pfabreuave:Dani%6162@apicluster.f9gdd.mongodb.net/apibanco?retryWrites=true&w=majority

//       ruta para agragar registros
//      se enviaran los datos via Body

/* 
  {
    nome: "Pedro Abreu",
    cpf: 5732359702,
    email: "pfabreuave@gmail.com",
    approved: true,
  }
*/

const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.f9gdd.mongodb.net/apibanco?retryWrites=true&w=majority`,
  )
  .then(() => {
    console.log('Conectou ao banco!')
    app.listen(3000)
  })
  