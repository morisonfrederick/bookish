const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createInvoice(invoice, outputPath) {
    return new Promise((resolve, reject) => {
        try {
            // Ensure the directory exists
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            let doc = new PDFDocument({ margin: 50 });

            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);

            // Header
            doc.image('public/user/images/logo/logo-dark.png', 50, 45, { width: 50 })
                .fontSize(20)
                .text('Bookish', 110, 57)
                .fontSize(10)
                .text('Peters street, Industry ', 200, 65, { align: 'right' })
                .text('Dublin, 123456', 200, 80, { align: 'right' })
                .moveDown();

            // Invoice Title
            doc.fontSize(20)
                .text('Invoice', { align: 'center' });

            // Invoice Details
            doc.fontSize(12)
                .text(`Invoice Number: ${invoice.invoiceNumber}`, { align: 'right' })
                .text(`Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, { align: 'right' })
                .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, { align: 'right' })
                .moveDown();

            // Customer Information
            doc.text(`Billed To:`, 50)
                .text(invoice.customerName, 50)
                .text(invoice.customerAddress, 50)
                .moveDown();

            // Table Header
            const tableTop = 250;
            const itemDescriptionX = 50;
            const itemQuantityX = 250;
            const itemPriceX = 350;
            const itemTotalX = 450;

            doc.font('Helvetica-Bold')
                .text('Description', itemDescriptionX, tableTop)
                .text('Quantity', itemQuantityX, tableTop)
                .text('Price', itemPriceX, tableTop)
                .text('Total', itemTotalX, tableTop);

            doc.moveTo(50, tableTop + 15)
                .lineTo(550, tableTop + 15)
                .stroke();

            // Table Content
            let position;
            doc.font('Helvetica');
            invoice.items.forEach((item, i) => {
                position = tableTop + (i + 1) * 30;
                doc.text(item.description, itemDescriptionX, position)
                    .text(item.quantity, itemQuantityX, position)
                    .text(item.price.toFixed(2), itemPriceX, position)
                    .text((item.quantity * item.price).toFixed(2), itemTotalX, position);
            });

            // Total
            doc.moveDown();
            doc.font('Helvetica-Bold')
                .text(`Total: ${invoice.total.toFixed(2)}`, { align: 'right' });

            // Footer
            doc.fontSize(10)
                .text('Thank you for your business!', 50, 700, { align: 'center', width: 500 });

            doc.end();

            stream.on('finish', () => {
                console.log('Invoice PDF generated successfully.');
                resolve();
            });

            stream.on('error', (err) => {
                console.error('Error generating invoice PDF:', err);
                reject(err);
            });
        } catch (err) {
            console.error('Error in createInvoice function:', err);
            reject(err);
        }
    });
}

module.exports = createInvoice;
