import 'dotenv/config';
import axios from 'axios';

const API_KEY = process.env.OPENAI_API_KEY_2 || '';
const BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

export async function callOpenAI2(prompt) {
  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY_2 is not configured');
  }

  const response = await axios.post(`${BASE_URL}/chat/completions`, {
    model: MODEL,
    temperature: 0.1,
    messages: [{ role: 'user', content: prompt }]
  }, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: 20000
  });

  return response.data;
}
