const fs = require("fs");
const PDFDocument = require("pdfkit");

async function generateCourrierPdf(patient, path) {
    const courrier = `Cher confrère,\n\nNous avons vu ce jour M. ${patient.name}\nIl/Elle a pour principaux antécédents : ${patient.antecedents}\n\nCe jour, l'acuité visuelle est de ${patient.measurements.refraction.od1} OD et ${patient.measurements.refraction.og1} OG.\nPIO : ${patient.measurements.pio.od} OD et ${patient.measurements.pio.og} OG.\nExamen lampe à fente :\n- OD : ${patient.exams.laf.od}\n- OG : ${patient.exams.laf.og}\nFond d'oeil :\n- OD : ${patient.exams.fo.od}\n- OG : ${patient.exams.fo.og}\n\n\n\nBien confraternellement,\n\nDr Léa Trouvé`
    const invoice = {
        "client": {
            "name": "toto",
            pricePerSession: 1
        },
        "subtotal": 1,
        "clientId": "JN-H",
        "description": courrier + "\n\n" + patient.description.courrier,
        "paid": 0,
        "moreDetails": "Nothing to add here",
        "debugMode": false
    }
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, patient);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    const writeStream = fs.createWriteStream(path);
    doc.pipe(writeStream);
    doc.end()

    await new Promise(resolve => {
        writeStream.on('finish', function () {
            resolve();
        });
    });
}

function generateHeader(doc) {
    doc
        .image("logo.png", 30, 45, { width: 100 })
        .fillColor("#444444")
        .fontSize(14)
        .text("Centre hospitalier de Haguenau", 110, 57)
        .fontSize(12)
        .text("64 Av. du Professeur René Leriche", 110, 80)
        .fontSize(12)
        .text("67500 Haguenau", 110, 100)
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(14)
        .text(`M. ${invoice.name}`, 50, 160, { align: "right" })
        .fontSize(12)
        .text(`Né le 28/07/1995`, 50, 190, { align: "right" });
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;
    const { client } = invoice;
    const { pricePerSession } = client;

    doc.font("Helvetica");
    generateTableRow(
        doc,
        invoiceTableTop,
        invoice.description,
    );
}

function generateFooter(doc) {
    doc

        .image("signature_sample.png", 300, 500, { width: 50, align: "center" })
        .fontSize(10)
        .text(
            "Copyright 2023",
            50,
            640,
            { align: "center", position: "bottom" }
        );


}

function generateTableRow(
    doc,
    y,
    description,
) {
    doc
        .fontSize(10)
        .text(description, 100, y)
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}



function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}

module.exports = {
    generateCourrierPdf
};