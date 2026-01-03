// File extraction utilities
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set PDF.js worker
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

export async function extractTextFromFile(file) {
    if (file.type.startsWith('image/')) {
        const worker = await Tesseract.createWorker('eng');
        const ret = await worker.recognize(file);
        await worker.terminate();
        return ret.data.text;
    }
    
    if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = "";
        const maxPages = Math.min(pdf.numPages, 5);
        for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ');
        }
        return fullText;
    }
    
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
    });
}

