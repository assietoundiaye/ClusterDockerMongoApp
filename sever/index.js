const express = require('express');
const mongoose = require('mongoose');
const Publication = require('./models/Publication'); // Assurez-vous que le chemin est correct

const app = express();
const port = 3000; // Définir le port ici

mongoose.connect('mongodb://localhost:27017/DBLP', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware pour les fichiers statiques

// Route pour récupérer la liste de tous les noms d'auteurs
app.get('/authors', async (req, res) => {
  try {
    // Récupérer tous les auteurs distincts de la base de données
    const authors = await Publication.distinct('authors');

    // Envoyer la liste des auteurs au format JSON en réponse
    res.json(authors);
  } catch (err) {
    // Gérer les erreurs en cas de problème avec la récupération des données
    console.error('Error fetching authors:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route pour générer le fichier HTML avec la liste des auteurs par livre
app.get('/nom_auteur_par_livre', async (req, res) => {
  try {
    // Récupérer toutes les publications
    const publications = await Publication.find({});

    // Initialiser une chaîne HTML pour stocker les auteurs par livre
    let html = '<html><head><title>Authors Per Book</title></head><body><h1 style="margin-top:5%;"> +--------------   LA LISTE DES AUTEURS PAR LIVRES  --------------+ </h1>';

    // Début du tableau HTML avec style
    html += '<table style="width: 80%; background-color: pink; border-collapse: collapse; border: 1px solid black;">';
    html += '<tr><th style="background-color: lightblue; ">Titre du Livre</th><th style="background-color: lightblue; ">Auteurs</th></tr>';

    // Parcourir toutes les publications
    publications.forEach(publication => {
      // Ajouter une ligne au tableau pour chaque livre
      html += '<tr>';
      // Ajouter le titre du livre dans la première colonne
      html += `<td style="border: 1px solid black;">${publication.title}</td>`;
      // Ajouter les auteurs dans la deuxième colonne
      html += '<td style="border: 1px solid black;">';
      publication.authors.forEach(author => {
        html += `${author}<br>`; // Chaque auteur sur une nouvelle ligne
      });
      html += '</td>';
      // Fermer la ligne du tableau
      html += '</tr>';
    });

    // Fermer le tableau et les balises body et html
    html += '</table></body></html>';

    // Envoyer la chaîne HTML en réponse
    res.send(html);
  } catch (err) {
    // Gérer les erreurs en cas de problème avec la récupération des données ou la génération du HTML
    console.error('Error generating HTML file:', err);
    res.status(500).send('Internal Server Error');
  }
});
