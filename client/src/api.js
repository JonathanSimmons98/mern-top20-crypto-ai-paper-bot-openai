import axios from 'axios';
export const api = axios.create({ baseURL: '/api' });
export const getTop20 = () => api.get('/coins/top20').then(r => r.data);
export const getAccount = () => api.get('/paper/account').then(r => r.data);
export const getOrders = () => api.get('/paper/orders').then(r => r.data);
export const runBot = () => api.post('/bot/run').then(r => r.data);
