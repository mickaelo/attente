const fs = require("fs");
const PDFDocument = require("pdfkit");

async function generateInvoicePdf(patient, path) {
    const measures = patient.measurements?.[1]?.['OD_measure']?.[0] ? `\n\nOD ${patient.measurements[1]['OD_measure'][0] > 0 ? "+" : ""}${patient.measurements[1]['OD_measure'][0]}  (${patient.measurements[1]['OD_measure'][1] > 0 ? "+" : ""}${patient.measurements[1]['OD_measure'][1]})  ${patient.measurements[1]['OD_measure'][2]}°` : ''
    const measures2 = patient.measurements?.[1]?.['OG_measure']?.[0] ? `\n\nOG ${patient.measurements[1]['OG_measure'][0] > 0 ? "+" : ""}${patient.measurements[1]['OG_measure'][0]}  (${patient.measurements[1]['OG_measure'][1] > 0 ? "+" : ""}${patient.measurements[1]['OG_measure'][1]})  ${patient.measurements[1]['OG_measure'][2]}°` : ''
    const measures3 = patient.measurements[1] && patient.measurements[1]['OD_ADD'] ? `\n\nAdd ODG ${patient.measurements[1]['OD_ADD']}` : ''
    const invoice = {
        "client": {
            "name": "toto",
            pricePerSession: 1
        },
        "subtotal": 1,
        "clientId": "JN-H",
        "items": [
            {
                "description": patient.description.prescription + measures + measures2 + measures3,
            }
        ],
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

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Ordonnance",
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.description,
        );
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
    );

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
    );
    doc.font("Helvetica");
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
        .text(description, 150, y)
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
    generateInvoicePdf
};