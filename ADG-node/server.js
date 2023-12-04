const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const htmlDocx = require('html-docx-js');
const archiver = require('archiver');
const ejs = require('ejs');
const path = require('path');

app.use(bodyParser.json());
app.use(cors());

app.post('/generate-doc', (req, res) => {
    const { html } = req.body;

    if (!html) {
        return res.status(400).send('HTML content is required');
    }

    // Load EJS template
    const templatePath = path.join(__dirname, 'template.ejs');
    ejs.renderFile(templatePath, { html }, (err, styledHTML) => {
        if (err) {
            console.error('Error rendering EJS template:', err);
            return res.status(500).send('Internal Server Error');
        }

        try {
            // Convert HTML to DOCX using html-docx-js
            const docxBuffer = htmlDocx.asBlob(styledHTML);

            // Create a zip file
            const archive = archiver('zip');

            // Pipe the archive to a writable stream for the response
            archive.pipe(res);

            // Append the DOCX file to the archive
            archive.append(docxBuffer, { name: 'document.docx' });

            // Finalize the archive and send it
            archive.finalize();
        } catch (error) {
            console.error('An error occurred:', error.message);
            res.status(500).send('Internal Server Error');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
