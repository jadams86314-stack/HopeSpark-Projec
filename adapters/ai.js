/**
 * HopeSparkDigital AI Adapter
 * Handles AI requests with sanitation, tracing, and depth enforcement
 */

import { sanitizeAIResponse } from '../utils/aiSanitizer.js';

const AI_ENDPOINT = 'https://api.gemini.google.com/v1/chat'; // Replace with your actual endpoint
const DEFAULT_PROMPT = 'Expand this idea with emotional depth and brand fidelity: ';
const MIN_DEPTH = 120;
const DEBUG_AI_ADAPTER = true;

export async function fetchAIResponse(userInput, options = {}) {
  const prompt = options.prompt || DEFAULT_PROMPT;
  const requestId = options.requestId || generateRequestId();
  const fullPrompt = `${prompt}${userInput}`.trim();

  if (DEBUG_AI_ADAPTER) {
    console.log(`[AI-ADAPTER] Request ID: ${requestId}`);
    console.log(`[AI-ADAPTER] Prompt: ${fullPrompt}`);
  }

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.apiKey || 'YOUR_API_KEY'}`
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: fullPrompt }],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    const rawOutput = data?.choices?.[0]?.message?.content || '';
    const sanitized = sanitizeAIResponse(rawOutput, requestId);

    if (!sanitized.isValid && DEBUG_AI_ADAPTER) {
      console.warn(`[AI-ADAPTER] Response failed validation.`, sanitized);
    }

    return sanitized;
  } catch (err) {
    console.error(`[AI-ADAPTER] Error during fetch:`, err);
    return {
      requestId,
      output: '[AI fetch failed]',
      isValid: false
    };
  }
}

function generateRequestId() {
  return 'HS-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}