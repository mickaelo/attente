// const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const { faker } = require('@faker-js/faker');
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');

// Create a document
const doc = new PDFDocument();
const app = express();
const port = 3001;
var cors = require('cors');
const { generateInvoicePdf } = require('./pdf-generator');
const { generateCourrierPdf } = require('./courrier-generator');
app.use(express.json());
// use it before all route definitions
app.use(cors({ origin: 'http://127.0.0.1:3000' }));
app.options('*', cors());

app.post('/generate-prescription', async (req, res) => {
    console.log(req.body)
    const { name, prescription } = req.body;

    if (!name || !prescription) {
        return res.status(400).json({ error: 'Paramètres manquants' });
    }
    const consultation = {
        date: '2023-01-01',
        diagnosis: 'Hypertension',
        prescription: ['Medicine A', 'Medicine B'],
        recommendations: ['Rest', 'Stay hydrated'],
    };


    // Définir la police et la taille du texte

    // Ajoute une image (remplace ces URLs par les URL de tes propres images)
    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage

    // Finalize PDF file
    await generateInvoicePdf(req.body, "./ordonnance.pdf")
    var data = fs.readFileSync('ordonnance.pdf');
    res.contentType("application/pdf");
    res.send(data);
    // Enregistre le document PDF dans un fichier
    // fs.writeFileSync('ordonnance.pdf', pdfBytes);
    // Envoie le PDF en réponse


});

app.post('/generate-courrier', async (req, res) => {
    console.log(req.body)
    const { name, prescription } = req.body;

    if (!name || !prescription) {
        return res.status(400).json({ error: 'Paramètres manquants' });
    }
    const consultation = {
        date: '2023-01-01',
        diagnosis: 'Hypertension',
        prescription: ['Medicine A', 'Medicine B'],
        recommendations: ['Rest', 'Stay hydrated'],
    };


    // Définir la police et la taille du texte

    // Ajoute une image (remplace ces URLs par les URL de tes propres images)
    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage

    // Finalize PDF file
    await generateCourrierPdf(req.body, "./courrier.pdf")
    var data = fs.readFileSync('courrier.pdf');
    res.contentType("application/pdf");
    res.send(data);
    // Enregistre le document PDF dans un fichier
    // fs.writeFileSync('ordonnance.pdf', pdfBytes);
    // Envoie le PDF en réponse


});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
