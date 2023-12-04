const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const htmlDocx = require('html-docx-js');
const archiver = require('archiver');
const OpenAI = require('openai');
require('dotenv').config();

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
    throw new Error("The OPENAI_API_KEY environment variable is missing or empty. Please provide a valid API key.");
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(limiter);

const openai = new OpenAI({ key: openaiApiKey });

async function generateText(prompt) {
    const gptResponse = await openai.complete.create({
        engine: 'text-davinci-003',
        prompt,
        max_tokens: 500,
    });

    return gptResponse.data.choices[0].text;
}

app.post('/generate-doc', async (req, res) => {
    const { htmlContent } = req.body;

    try {
        const prompt = `${htmlContent}\n\n Create documentation for the above content with the title`;
        const generatedContent = await generateText(prompt);

        // Styled HTML
        const styledHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 20px;
                    }
                    p {
                        line-height: 1.5;
                        margin-bottom: 15px;
                    }
                </style>
            </head>
            <body>
                ${generatedContent}
            </body>
            </html>
        `;

        // Generate DOCX file
        const docxBuffer = htmlDocx.asBlob(styledHtml);
        const fileName = `document_${Date.now()}.docx`;
        fs.writeFileSync(fileName, docxBuffer);

        // Create ZIP archive
        const archive = archiver('zip');
        archive.file(fileName, { name: fileName });

        // Set response headers and pipe the archive to the response
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.zip`);
        archive.pipe(res);
        archive.finalize();

        console.log(`Document generated successfully.`);

    } catch (error) {
        console.error('An error occurred:', error);

        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
