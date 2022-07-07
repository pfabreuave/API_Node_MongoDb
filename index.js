// config inicial

require('dotenv').config()
const express = require('express')
const app = express()

const mongoose = require('mongoose')

const Person = require('./models/Person')

app.use(
    express.urlencoded({
      extended: true,
    }),
  )

  app.use(express.json())

// Rutas 

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

// creacion de registros en la base de datos

app.post('/person', async (req, res) => {
  const { nome, cpf, email, approved } = req.body

// para validar los datos de entrada

if(!nome) {
  res.status(422).json({error: 'nome é obrigatorio'})
  return
}
if(!cpf) {
  res.status(422).json({error: 'cpf é obrigatorio'})
  return
}

  const person = {
    nome,
    cpf,
    email,
    approved
  }

  try {
    await Person.create(person)

    res.status(201).json({ message: 'Pessoa inserida no sistema com sucesso!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})


// busca los registro grabados en la base de datos

app.get('/person', async (req, res) => {
  try {
    const people = await Person.find()

    res.status(200).json(people)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// busca un  registro determinado en la base de datos

app.get('/person/:id', async (req, res) => {

  const id = req.params.id

  try {
    const person = await Person.findOne({ _id: id })

    if (!person) {
      res.status(422).json({ message: 'Usuário não encontrado!' })
      return
    }

    res.status(200).json(person)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Actualiza un campo o mas de un registro grabado en la base de datos
//              llamado tambien actualizacion parcial (patch)

app.patch('/person/:id', async (req, res) => {
  const id = req.params.id

  const { nome, cpf, email, approved } = req.body

  const person = {
    nome,
    cpf,
    email,
    approved
  }

  try {
    const updatedPerson = await Person.updateOne({ _id: id }, person)

    if (updatedPerson.matchedCount === 0) {
      res.status(422).json({ message: 'Usuário não encontrado!' })
      return
    }

    res.status(200).json(person)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// elimina un registro existente en la base de datos


app.delete('/person/:id', async (req, res) => {
  const id = req.params.id

  const person = await Person.findOne({ _id: id })

  if (!person) {
    res.status(422).json({ message: 'Usuário não encontrado!' })
    return
  }

  try {
    await Person.deleteOne({ _id: id })

    res.status(200).json({ message: 'Usuário removido com sucesso!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})


app.get('/', (req, res) => {

    res.json({message: 'voy bien, falta poco'})
})


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
  