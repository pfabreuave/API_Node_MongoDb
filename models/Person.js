const mongoose = require('mongoose')

const Person = mongoose.model('Person', {
  nome: String,
  cpf: Number,
  email: String,
  approved: Boolean
})

module.exports = Person