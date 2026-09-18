import { getAccount } from './services/paperBroker.js';
console.log({ persistence: 'process-memory', account: getAccount() });
