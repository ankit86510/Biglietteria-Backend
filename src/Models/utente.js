const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SchemaUtente = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },

    cognome: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },

    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    hash_password: {
        type: String,
        required: true,
        trim: true,
    },
    ruolo: {
        type: String,
        enum: ['utente', 'admin'],
        default: 'utente'
    },
    recapito: { type: String},
    profilePicture: { type: String}
},
{ timestamps: true});

// SchemaUtente.virtual('password')
// .set(function(password){
//     this.hash_password = bcrypt.hashSync(password, 10);
// })
SchemaUtente.virtual('fullname')
.get(function() {
    return `${this.nome} ${this.cognome}`
})


SchemaUtente.methods = {
    autenticazione: async function(password){
        return await bcrypt.compare(password, this.hash_password);
        }
}


module.exports = mongoose.model('Utente', SchemaUtente);