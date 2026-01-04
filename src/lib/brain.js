// --- CONFIGURATION ---
const OPENROUTER_API_KEY = "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"; 
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// --- PROMPTS ---
const PROMPTS = {
  'agent-a': "You are Deepseek. Answer the user's question. For every major fact, you MUST include a real source URL in brackets [e.g. source: https://example.com]. If you don't know the specific URL, suggest the official website for that topic.",

  'agent-b': "You are Gemini. Read Deepseek's response and add NEW details or context. You must also provide at least one source URL for your new information. Do not repeat what Deepseek said.",

  'consensus': `You are the NVIDIA AI Verifier. 
  Your goal is to format the previous insights into a "Verified Report".
  
  RULES:
  1. Use the format: ### [CLAIM TITLE]
  2. Write a clear explanation.
  3. Provide the source on a new line: **Source:** [URL]
  5. If the previous agents didn't provide a link, search your memory for the most likely official URL.`
};

const MODELS = {
    'agent-a': "google/gemini-2.5-flash-lite-preview-09-2025", 
    'agent-b': "x-ai/grok-code-fast-1", 
    'consensus': "nvidia/nemotron-3-nano-30b-a3b:free" 
};

// --- MAIN FUNCTION ---
export async function callTwinFunction(stage, context) {
    console.log(`🧠 Brain.js: Calling ${stage}...`);

    const model = MODELS[stage] || MODELS['agent-a'];
    const systemPrompt = PROMPTS[stage] || PROMPTS['agent-a'];

    // If stage is consensus, we ensure it knows it's the final verifier
    const messages = [
        { role: "system", content: systemPrompt },
        ...context
    ];

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'TwinAI Local'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                // Lower temperature for the Verifier to keep it factual
                temperature: stage === 'consensus' ? 0.1 : 0.7 
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;

        // --- SOURCE FORMATTING LOGIC ---
        // This regex looks for URLs and ensures they are formatted as clean links
        if (stage === 'consensus') {
            content = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #60a5fa; text-decoration: underline;">$1</a>');
        }

        return content;

    } catch (error) {
        console.error("Brain.js Error:", error);
        return `Error: ${error.message}`;
    }
}