
import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_OPENAI_API_KEY is not set in the .env file.");
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // This is required for client-side usage
});

export default openai;