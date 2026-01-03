// --- CONFIGURATION ---
// ⚠️ WARNING: Your API Key is visible in the browser source code.
// Ideally, restrict this key's usage to your domain in OpenRouter settings.
const OPENROUTER_API_KEY = "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"; 
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// --- PROMPTS ---
const PROMPTS = {
  'agent-a': "You are Deepseek, an expert sharing your own knowledge. Task: Answer the user's question based on your understanding and experience. Rules: Be clear, helpful, and structured. Share insights, reasoning, and practical ideas. Do not mention other agents. Keep it concise.",

  'agent-b': "You are Gemini, another expert. You are having a fascinating conversation with DeepSeek. participating in a collaborative discussion. Context: You have read Deepseek response. Your Task: Share your own perspective on the same question. Build upon Agent A's ideas where relevant. Add new insights, angles, or examples. Expand the thinking, not criticize or correct. You may agree, complement, or extend ideas naturally. Rules: Do NOT argue or criticize. Do NOT repeat Agent A's response. Do NOT mention system details or agent names. Instead, Yes, and... the conversation.Acknowledge DeepSeek's good points briefly.Share a completely NEW perspective, example, or nuance that DeepSeek missed.Use a conversational tone: That is a great point, DeepSeek, but we should also consider...Make the user think: Wow, I didn't think of that!.Keep it concise.",

  'consensus': "You are the Final Agent. You are DeepSeek. You have collaborated with Gemini to solve a problem. Context: You have: The user question Agent A's knowledge Agent B's additional insights Your Task: Combine the ideas from both agents into one cohesive, high-quality answer. Keep the tone natural, human-like, and confident. Present the answer as a expert response. Output Requirements: Well-organized and easy to read. Produce a single, high-quality response that looks like it was written by a team of geniuses. Actionable and practical. 120 to 180 words by default. Do NOT mention agents or internal conversation."
};

const MODELS = {
    'agent-a': "nex-agi/deepseek-v3.1-nex-n1:free",
    'agent-b': "xiaomi/mimo-v2-flash:free",
    'consensus': "nvidia/nemotron-3-nano-30b-a3b:free"
  };
  

// --- MAIN FUNCTION ---
// This function replaces the Supabase Edge Function call.
export async function callTwinFunction(stage, context) {
    console.log(`🧠 Brain.js: Calling ${stage}...`);

    // 1. Select Model & Prompt
    const model = MODELS[stage] || MODELS['agent-a'];
    const systemPrompt = PROMPTS[stage] || PROMPTS['agent-a'];

    // 2. Build Messages
    const messages = [
        { role: "system", content: systemPrompt },
        ...context
    ];

    try {
        // 3. Direct Fetch to OpenRouter
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
                messages: messages
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        // 4. Return just the content string
        return data.choices[0].message.content;

    } catch (error) {
        console.error("Brain.js Error:", error);
        return `Error: ${error.message}`;
    }
}

