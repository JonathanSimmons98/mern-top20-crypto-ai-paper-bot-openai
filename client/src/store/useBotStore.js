import { create } from 'zustand';
import { getAccount, getOrders, getTop20, runBot } from '../api.js';

export const useBotStore = create((set) => ({
  coins: [], account: null, orders: [], loading: false, lastRun: null,
  refresh: async () => {
    const [coins, account, orders] = await Promise.all([getTop20(), getAccount(), getOrders()]);
    set({ coins, account, orders });
  },
  run: async () => {
    set({ loading: true });
    try {
      const lastRun = await runBot();
      const [coins, account, orders] = await Promise.all([getTop20(), getAccount(), getOrders()]);
      set({ lastRun, coins, account, orders });
    } finally { set({ loading: false }); }
  }
}));
