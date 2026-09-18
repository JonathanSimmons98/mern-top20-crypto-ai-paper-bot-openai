import axios from 'axios';
import Bottleneck from 'bottleneck';
import { config } from '../config.js';

const limiter = new Bottleneck({ minTime: 1200, maxConcurrent: 2 });

export async function cgGet(path, params = {}) {
  const headers = {};
  if (config.coinGeckoKey) {
    headers['x-cg-demo-api-key'] = config.coinGeckoKey;
  }
  return limiter.schedule(async () => {
    const response = await axios.get(`${config.coinGeckoBase}${path}`, {
      params,
      headers,
      timeout: 15000
    });
    return response.data;
  });
}
