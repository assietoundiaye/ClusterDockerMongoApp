const mongoose = require('mongoose');

// Définition du schéma de la publication
const publicationSchema = new mongoose.Schema({
    _id: String,
    type: String,
    title: String,
    pages: Object,
    year: Number,
    booktitle: String,
    url: String,
    authors: [String]
}, { collection: 'publis' }); // Définition du nom de la collection

// Création du modèle de publication à partir du schéma
const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;
