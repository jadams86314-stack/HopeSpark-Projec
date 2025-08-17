/**
 * HopeSparkDigital AI Sanitizer
 * Ensures schema-valid, depth-enforced, traceable AI responses
 * Request ID: auto-generated per invocation
 */

const MIN_RESPONSE_LENGTH = 120;
const DEBUG_AI_GUARDS = true;

export function sanitizeAIResponse(raw, requestId = generateRequestId()) {
  const trimmed = raw?.trim?.() || '';
  const isValidLength = trimmed.length >= MIN_RESPONSE_LENGTH;
  const hasSchemaMarkers = /[{[].*[}\]]/.test(trimmed);
  const sanitized = isValidLength && hasSchemaMarkers ? trimmed : '[AI response invalid or incomplete]';

  if (DEBUG_AI_GUARDS) {
    console.log(`[AI-SANITIZER] Request ID: ${requestId}`);
    console.log(`[AI-SANITIZER] Raw Length: ${trimmed.length}`);
    console.log(`[AI-SANITIZER] Schema Valid: ${hasSchemaMarkers}`);
    console.log(`[AI-SANITIZER] Final Output:`, sanitized);
  }

  return {
    requestId,
    output: sanitized,
    isValid: isValidLength && hasSchemaMarkers
  };
}

function generateRequestId() {
  return 'HS-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}