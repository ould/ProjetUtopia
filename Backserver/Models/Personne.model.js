const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonneSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  nationalite: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: false,
  },
  ddn: {
    type: String,
    required: false,
  },
  situation: {
    type: String,
    required: false,
  },
  commentaire: {
    type: String,
    required: false,
  }
})

//TODO : if id is null
// PersonneSchema.pre('save', function(next) {
//   var doc = this;
//   doc.personneId = counter.seq;
// });

const Personne = mongoose.model('personne', PersonneSchema)
module.exports = Personne
