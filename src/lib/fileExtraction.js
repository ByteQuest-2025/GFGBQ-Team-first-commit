import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

let ocrWorker = null;

async function getOCRWorker() {
    if (!ocrWorker) {
        ocrWorker = await Tesseract.createWorker('eng');
    }
    return ocrWorker;
}

if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
}

export async function extractTextFromFile(file, options = {}) {
    const { maxPdfPages = 5 } = options;

    try {
        // IMAGE
        if (file.type.startsWith('image/')) {
            const worker = await getOCRWorker();
            const { data } = await worker.recognize(file);
            return data.text.trim();
        }

        // PDF
        if (file.type === 'application/pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = '';
            const pages = Math.min(pdf.numPages, maxPdfPages);

            for (let i = 1; i <= pages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items
                    .map(item => item.str)
                    .join(' ')
                    .replace(/\s+/g, ' ');

                fullText += pageText + '\n\n';
            }

            return fullText.trim();
        }

        // TEXT FILE
        return await file.text();

    } catch (err) {
        console.error('File extraction failed:', err);
        throw new Error('Unable to extract text from file');
    }
}
